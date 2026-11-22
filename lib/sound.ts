/**
 * Tiny Web Audio SFX engine — synthesizes soft, short cues at runtime so the
 * project ships no audio assets. Kept intentionally quiet and non-melodic.
 * See Design.md §6.
 */

const STORAGE_KEY = "sarak:sound";

type Ctx = AudioContext & { webkitAudioContext?: never };

let ctx: Ctx | null = null;
let master: GainNode | null = null;
let filter: BiquadFilterNode | null = null;
let enabled = true;
let initialized = false;

function readPref(): boolean {
  if (typeof window === "undefined") return true;
  try {
    return window.localStorage.getItem(STORAGE_KEY) !== "off";
  } catch {
    return true;
  }
}

function ensure(): Ctx | null {
  if (typeof window === "undefined") return null;
  if (!initialized) {
    enabled = readPref();
    initialized = true;
  }
  if (!ctx) {
    const AC: typeof AudioContext =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (!AC) return null;
    ctx = new AC() as Ctx;
    filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 2600; // round off the edge, keep it soft
    master = ctx.createGain();
    master.gain.value = 0.11; // low master ceiling
    filter.connect(master);
    master.connect(ctx.destination);
  }
  return ctx;
}

/** A single soft note with a gentle attack/decay envelope. */
function note(freq: number, dur: number, peak: number, type: OscillatorType) {
  const c = ensure();
  if (!c || !filter || !enabled) return;
  if (c.state === "suspended") void c.resume();
  const t = c.currentTime;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(peak, t + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(g);
  g.connect(filter);
  osc.start(t);
  osc.stop(t + dur + 0.03);
}

export const sound = {
  /** Must be called from a user gesture to satisfy autoplay policy. */
  unlock() {
    const c = ensure();
    if (c && c.state === "suspended") void c.resume();
  },
  /** Slide changed. dir > 0 = forward, dir < 0 = backward. */
  nav(dir: number) {
    if (dir >= 0) note(523.25, 0.13, 0.9, "sine");
    else note(440.0, 0.13, 0.85, "sine");
  },
  /** Navigation blocked at the first/last slide — a faint low tick. */
  blocked() {
    note(180, 0.08, 0.4, "triangle");
  },
  isEnabled() {
    if (!initialized) {
      enabled = readPref();
      initialized = true;
    }
    return enabled;
  },
  setEnabled(v: boolean) {
    enabled = v;
    initialized = true;
    try {
      window.localStorage.setItem(STORAGE_KEY, v ? "on" : "off");
    } catch {
      /* ignore */
    }
    if (v) this.unlock();
  },
  toggle() {
    this.setEnabled(!this.isEnabled());
    return this.isEnabled();
  },
};
