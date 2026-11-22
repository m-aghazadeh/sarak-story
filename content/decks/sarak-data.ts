/**
 * Sarak (سارک) — audit data for the interview deck.
 * Collected ۱ آذر ۱۴۰۵ (2026-11-22) by زهرا ذوقی from public sources only.
 *
 * Status of every figure:
 * - "verified": seen directly on the site / Instagram / Google Maps on the audit date.
 * - "estimate": third-party estimate (Similarweb) or older search snapshot.
 * - "todo":     still to be collected; do not show as a number.
 *
 * Sources:
 * - sarak-co.com: pages, sitemap.xml, page source, CSS tokens, mobile test (375px).
 * - mag.sarak-co.com: WordPress API.
 * - Instagram @sarak_co: profile screenshot + highlight «آدرس شعب».
 * - Google Maps search «سارک پوشاک تهران» (limited view).
 * - Similarweb sarak-co.com, October 2026.
 *
 * Wording rules for the deck: no filler text; use spoken marketing terms
 * (سشن، سشن رکوردینگ، هیت‌مپ، ریتارگتینگ، فانل، CTA).
 */

export type Status = "verified" | "estimate" | "todo";
export type Severity = "high" | "medium" | "low";

/* ------------------------------------------------------------------ */
/* Brand                                                               */
/* ------------------------------------------------------------------ */

export const brand = {
  name: "سارک",
  nameLatin: "SARAK",
  slogan: "Stylish By Harmony",
  positioning: "زیبایی در سادگی، هارمونی رنگ و سبک",
  experience: "چهار دهه (ادعای خود سایت)",
  segments: ["زنانه", "مردانه", "دخترانه", "پسرانه"],
  website: "https://sarak-co.com",
  magazine: "https://mag.sarak-co.com",
  instagram: "https://instagram.com/sarak_co",
  supportPhone: "021-37504000 (هر روز ۸ تا ۲۰)",
  auditDate: "۱ آذر ۱۴۰۵",
  auditor: "زهرا ذوقی — کارشناس ارشد مارکتینگ",
  logo: "/brand/sarak/logo-red.svg", // from sarak-co.com/images/logo-red.svg, fill #72000E
};

/* ------------------------------------------------------------------ */
/* Headline numbers                                                    */
/* ------------------------------------------------------------------ */

export interface Kpi {
  label: string;
  value: string;
  status: Status;
  source: string;
  note?: string;
}

export const kpis: Kpi[] = [
  { label: "فالوور اینستاگرام", value: "184K", status: "verified", source: "پروفایل @sarak_co" },
  { label: "پست اینستاگرام", value: "1,422", status: "verified", source: "پروفایل @sarak_co" },
  { label: "تعداد شعب", value: "18", status: "verified", source: "هایلایت «آدرس شعب»", note: "۹ تهران + ۹ شهرستان" },
  { label: "شعب نمایش‌داده‌شده در سایت", value: "9", status: "verified", source: "sarak-co.com/representations", note: "فقط تهران" },
  { label: "صفحه محصول در sitemap", value: "1,227", status: "verified", source: "sitemap.xml" },
  { label: "محصولات دارای نظر کاربر", value: "12%", status: "verified", source: "۲۵ محصول با نمونه‌گیری یکنواخت از sitemap", note: "۳ از ۲۵ محصول، مجموعاً ۱۲ نظر" },
  { label: "نظرات گوگل‌مپ شعب", value: "~27", status: "verified", source: "Google Maps", note: "روی ۶ لیستینگ پیدا‌شده" },
  { label: "بازدید ماهانه سایت", value: "12.3K", status: "estimate", source: "Similarweb، اکتبر ۲۰۲۶", note: "Similarweb ترافیک ایران را کم برآورد می‌کند؛ عدد واقعی از GA4" },
  { label: "تغییر بازدید نسبت به ماه قبل", value: "−44.85%", status: "estimate", source: "Similarweb" },
  { label: "مقالات مجله", value: "1,067", status: "verified", source: "mag.sarak-co.com WordPress API" },
  { label: "نرخ تعامل اینستاگرام", value: "", status: "todo", source: "میانگین لایک+کامنت ۱۲ پست آخر ÷ فالوور × ۱۰۰" },
];

/* ------------------------------------------------------------------ */
/* Instagram                                                           */
/* ------------------------------------------------------------------ */

export const instagram = {
  handle: "sarak_co",
  displayName: "SARAK",
  followers: 184_000,
  posts: 1_422,
  following: 5,
  category: "Clothing (Brand)",
  bio: "Stylish By Harmony",
  bioLanguage: "انگلیسی",
  link: { url: "sarak-co.com", hasUtm: true, note: "لینک بیو UTM دارد (utm_source=ig)" },
  threads: true,
  highlights: [
    { title: "آدرس شعب", coverText: "STORES", coverStyle: "زمینه کرم ‎#F7F6DA‎ + پرنده‌های زرشکی (تصویرسازی)" },
    { title: "SALE", coverText: "SALE", coverStyle: "زمینه زرشکی ‎#711516‎ + چرخش خطی" },
  ],
  latestPost: "Fashion Friday SALE 2026 (متن انگلیسی)",
  engagementRate: null as number | null, // todo
  relatedAccounts: [
    { handle: "sarak.comode", title: "مجله کُمُد سارک", followers: 39_000, posts: 1_308, status: "estimate" as Status },
  ],
  findings: [
    { severity: "medium" as Severity, text: "بیو، کاور هایلایت‌ها و پست اخیر انگلیسی‌اند؛ مخاطب و سایت فارسی" },
    { severity: "medium" as Severity, text: "فقط ۲ هایلایت؛ راهنمای سایز، نظر مشتری، کالکشن‌ها و نحوه خرید آنلاین هایلایت ندارند" },
    { severity: "low" as Severity, text: "عنوان یک هایلایت فارسی (آدرس شعب) و دیگری انگلیسی (SALE)" },
    { severity: "low" as Severity, text: "سبک کاور هایلایت‌ها یکی نیست: یکی تصویرسازی روی کرم، یکی گرافیک روی زرشکی" },
  ],
};

/* ------------------------------------------------------------------ */
/* Branches                                                            */
/* ------------------------------------------------------------------ */

export interface Branch {
  id: string;
  city: string;
  name: string;
  phoneInstagram: string | null;
  phoneSite?: string | null;
  phoneMatch?: boolean;
  address?: string;
  hours?: string;
  onSite: boolean;
  maps?: { listing: string; rating: number; reviews: number; issue?: string } | null;
  issues?: string[];
}

export const branches: Branch[] = [
  // ---- Tehran (on site + Instagram) ----
  {
    id: "bamland", city: "تهران", name: "مرکز خرید بام لند",
    phoneInstagram: "02140443047", phoneSite: "021-40443049", phoneMatch: false,
    address: "اتوبان خرازی، ضلع شرقی دریاچه خلیج فارس، مرکز خرید بام لند، پلاک GA9",
    hours: "شنبه تا چهارشنبه ۱۰–۲۳ · پنجشنبه و جمعه ۱۰–۲۴",
    onSite: true,
    maps: { listing: "سارک Sarak - بام لند", rating: 3.7, reviews: 14, issue: "تلفن گوگل‌مپ ‎021-47672301‎ (شماره ایران‌مال)" },
    issues: ["تلفن سایت و اینستاگرام متفاوت (۰۴۹ / ۰۴۷)", "تلفن گوگل‌مپ مال شعبه دیگری است"],
  },
  {
    id: "iranmall", city: "تهران", name: "مجتمع ایران مال",
    phoneInstagram: "02147672301", phoneSite: "021-47672301 | 021-47672302", phoneMatch: true,
    address: "انتهای بزرگراه همت غرب، مجتمع ایران مال، طبقه G3، واحد RD335",
    hours: "شنبه تا جمعه ۱۰–۲۲",
    onSite: true,
    maps: { listing: "Sarak - سارک ایرانمال", rating: 4.0, reviews: 1 },
  },
  {
    id: "niayesh", city: "تهران", name: "مجتمع تجاری نیایش",
    phoneInstagram: "02148814261", phoneSite: "021-48814261", phoneMatch: true,
    address: "جنت‌آباد مرکزی، مجتمع تجاری نیایش، طبقه اول، واحد ۴۶",
    hours: "شنبه تا جمعه ۱۰:۳۰–۲۳",
    onSite: true,
    maps: { listing: "سارک Sarak - مجتمع تجاری نیایش", rating: 2.0, reviews: 3 },
    issues: ["پایین‌ترین امتیاز گوگل‌مپ بین شعب"],
  },
  {
    id: "golestan", city: "تهران", name: "مرکز تجاری گلستان (شهرک غرب)",
    phoneInstagram: "02188579635", phoneSite: "021-88579635", phoneMatch: true,
    address: "شهرک غرب، بلوار ایران زمین، مرکز تجاری گلستان، طبقه اول، واحد ۲۴۵",
    hours: "شنبه تا جمعه ۱۰–۲۲",
    onSite: true, maps: null,
    issues: ["در جست‌وجوی گوگل‌مپ پیدا نشد"],
  },
  {
    id: "duman", city: "تهران", name: "مجتمع تجاری دومان",
    phoneInstagram: "02191342169", phoneSite: "09198999051", phoneMatch: false,
    address: "شهرک غرب، بلوار خوردین، کوچه مسعود، مجتمع تجاری دومان، طبقه GB",
    hours: "شنبه تا جمعه ۱۰–۲۲",
    onSite: true, maps: null,
    issues: ["سایت موبایل، اینستاگرام ثابت", "در جست‌وجوی گوگل‌مپ پیدا نشد"],
  },
  {
    id: "rosha", city: "تهران", name: "دپارتمان استور روشا (نیاوران)",
    phoneInstagram: "02125714000", phoneSite: "۰۲۱-۲۵۷۱۴۰۰۰", phoneMatch: true,
    address: "نیاوران، تقاطع خیابان عمار و فرمانیه، دپارتمان استور روشا",
    hours: "شنبه تا چهارشنبه ۱۰:۳۰–۲۱:۳۰ · پنجشنبه و جمعه ۱۰:۳۰–۲۲:۳۰",
    onSite: true,
    maps: { listing: "سارک Sarak - روشا", rating: 4.0, reviews: 2, issue: "ساعت بسته شدن در گوگل‌مپ ۲۳ (سایت: ۲۱:۳۰)" },
    issues: ["تنها شماره با ارقام فارسی در سایت", "ساعت کاری گوگل‌مپ با سایت نمی‌خواند"],
  },
  {
    id: "kolahdooz", city: "تهران", name: "خیابان کلاهدوز (دولت)",
    phoneInstagram: "02122584148", phoneSite: "021-22584148", phoneMatch: true,
    address: "خیابان شریعتی، خیابان کلاهدوز (دولت)، بین بلوار کاوه و چهارراه قنات",
    hours: "شنبه تا جمعه ۱۰–۲۲",
    onSite: true, maps: null,
    issues: ["در جست‌وجوی گوگل‌مپ پیدا نشد"],
  },
  {
    id: "ravagh", city: "تهران", name: "مجموعه رواق، واحد ۳۹",
    phoneInstagram: "09198999351", phoneSite: "09198999351", phoneMatch: true,
    address: "خیابان آفریقا، خیابان بوستان نوروز، مجموعه رواق، واحد ۳۹",
    hours: "شنبه تا چهارشنبه ۱۱–۲۳ · پنجشنبه و جمعه ۱۱–۲۴",
    onSite: true, maps: null,
    issues: ["شماره تماس موبایل", "در جست‌وجوی گوگل‌مپ پیدا نشد"],
  },
  {
    id: "labaza-tehran", city: "تهران", name: "دپارتمان استور لبازا (پاسداران)",
    phoneInstagram: "02121008194", phoneSite: "021-21008194", phoneMatch: true,
    address: "پاسداران، نبش بوستان چهارم، مجموعه دپارتمان استور لبازا",
    hours: "شنبه تا جمعه ۱۰–۲۲",
    onSite: true, maps: null,
    issues: ["غلط تایپی در هایلایت: «پاسدارن»", "در جست‌وجوی گوگل‌مپ پیدا نشد"],
  },

  // ---- Other cities (Instagram only) ----
  { id: "mashhad-armitage", city: "مشهد", name: "برج تجاری آرمیتاژ گلشن", phoneInstagram: "05138946304", onSite: false },
  { id: "mashhad-labaza", city: "مشهد", name: "مجموعه دپارتمان استور لبازا", phoneInstagram: null, onSite: false, issues: ["بدون شماره تماس"] },
  { id: "tabriz", city: "تبریز", name: "مجتمع تجاری لاله پارک", phoneInstagram: "04136600170", onSite: false },
  { id: "shiraz", city: "شیراز", name: "مجتمع تجاری اداری پین پلازا", phoneInstagram: "09932272639", onSite: false, issues: ["شماره تماس موبایل"] },
  { id: "chalus-panorama", city: "چالوس · کلارآباد", name: "مرکز خرید پانوراما", phoneInstagram: "01154601738", onSite: false },
  { id: "royan-lico", city: "نور · رویان", name: "فروشگاه لایکو سنتر", phoneInstagram: "01144546284", onSite: false },
  { id: "kelarabad-lico", city: "کلارآباد", name: "فروشگاه لایکو سنتر", phoneInstagram: "01154603104", onSite: false },
  { id: "ahvaz", city: "اهواز", name: "مجتمع تجاری رویال پارس", phoneInstagram: "06133901211", onSite: false },
  { id: "semnan", city: "سمنان", name: "بلوار ۱۷ شهریور", phoneInstagram: "02333361493", onSite: false },
];

/** Google Maps listings that match no branch on the site or Instagram. */
export const mapsOrphans = [
  { listing: "سارک Sarak- تیدا", rating: 5.0, reviews: 1, phone: "021-26375267", note: "نه در سایت، نه در اینستاگرام" },
  { listing: "Sarak", rating: 4.8, reviews: 6, phone: null, note: "بدون نام شعبه؛ Plus code PCX8+8V9" },
  { listing: "سارک | Sarak (تولیدی)", rating: 5.0, reviews: 3, phone: "021-92001140", note: "دسته Manufacturer" },
];

export const branchFindings = [
  { severity: "high" as Severity, text: "سایت ۹ شعبه (فقط تهران) نشان می‌دهد، اینستاگرام ۱۸ شعبه؛ ۹ شعبه شهرستان در سایت نیستند" },
  { severity: "high" as Severity, text: "تلفن ۲ شعبه بین سایت و اینستاگرام متفاوت است (بام لند، دومان)" },
  { severity: "high" as Severity, text: "تلفن بام لند در گوگل‌مپ شماره ایران‌مال است" },
  { severity: "medium" as Severity, text: "۵ شعبه تهران در جست‌وجوی گوگل‌مپ پیدا نشدند؛ یک لیستینگ (تیدا) در هیچ منبع رسمی نیست" },
  { severity: "medium" as Severity, text: "نام لیستینگ‌ها در گوگل‌مپ سه فرمت دارد: «سارک Sarak - …»، «Sarak - سارک …»، «Sarak»" },
  { severity: "medium" as Severity, text: "صفحه نمایندگی‌ها: بدون نقشه و لینک مسیریابی (گوگل‌مپ، نشان، بلد)؛ فیلتر شهر فقط «تهران»" },
  { severity: "medium" as Severity, text: "باگ صفحه نمایندگی‌ها: با باز کردن چند کارت، همه کارت‌های باز آدرس آخرین شعبه را نشان می‌دهند" },
  { severity: "low" as Severity, text: "۳ شعبه شماره موبایل دارند (رواق، شیراز، دومان در سایت)؛ مشهد لبازا بدون شماره" },
  { severity: "low" as Severity, text: "هایلایت شعب: کشیدگی حروف (تهـــران) یکدست نیست، یک رقم لاتین بین ارقام فارسی (بام لند)، غلط «پاسدارن»" },
];

/* ------------------------------------------------------------------ */
/* Colour & visual identity ("Stylish By Harmony")                      */
/* ------------------------------------------------------------------ */

export interface Swatch {
  hex: string;
  where: string;
  hsl?: string;
  status: Status;
  note?: string;
}

/** Brand tokens defined in the site's CSS (Tailwind theme). */
export const siteTokens: Swatch[] = [
  { hex: "#72000E", where: "--color-brand / brand-500 (دکمه، تاپ‌بار، متن برند)", hsl: "353° 100% 22%", status: "verified" },
  { hex: "#AA666E", where: "--color-brand-300", status: "verified" },
  { hex: "#8E333E", where: "--color-brand-400 (بج تخفیف)", hsl: "350° 49% 37%", status: "verified" },
  { hex: "#5B000B", where: "--color-brand-600", status: "verified" },
  { hex: "#DDDAD9", where: "--color-brandGray (فوتر)", status: "verified" },
  { hex: "#9A2424", where: "--color-error", hsl: "0° 62% 37%", status: "verified", note: "خیلی نزدیک به قرمز برند؛ پیام خطا شبیه المان برند دیده می‌شود" },
  { hex: "#24579A", where: "--color-info", status: "verified" },
  { hex: "#18772D", where: "--color-success", status: "verified" },
  { hex: "#00AB0B", where: "--color-green-c", status: "verified" },
];

/** Reds actually used across channels — same "brand red" in 6 shades. */
export const brandRedsInUse: Swatch[] = [
  { hex: "#72000E", where: "سایت: توکن برند", hsl: "353° 100% 22%", status: "verified" },
  { hex: "#550102", where: "سایت: پس‌زمینه لودینگ کارت محصول", status: "verified" },
  { hex: "#5C0002", where: "سایت: اسکلتون لودینگ", status: "verified" },
  { hex: "#7B1717", where: "اینستاگرام: پروفایل", hsl: "0° 68% 29%", status: "verified", note: "گرم‌تر و کم‌اشباع‌تر از توکن سایت" },
  { hex: "#711516", where: "اینستاگرام: کاور هایلایت SALE", hsl: "359° 69% 26%", status: "verified" },
  { hex: "#730D18", where: "اینستاگرام: پست Fashion Friday", hsl: "354° 80% 25%", status: "verified" },
  { hex: "#730011", where: "اینستاگرام: پس‌زمینه لیست شعب", hsl: "351° 100% 23%", status: "verified" },
];

/** Colours outside the brand palette, seen in the purchase flow. */
export const offBrandColors: Swatch[] = [
  { hex: "#008FFF", where: "بلوک اسنپ‌پی زیر CTA «افزودن به سبد» (لوگو + متن آبی)", status: "verified", note: "آبی اشباع، درست کنار دکمه زرشکی؛ قوی‌ترین رنگ صفحه محصول" },
  { hex: "#5A9CE3", where: "آیکن‌های صفحه سوالات متداول", status: "verified", note: "رنگ از اسکرین‌شات (تقریبی)" },
  { hex: "#5DBE5F", where: "تست «محصول به سبد خرید اضافه شد» (Toastify)", status: "verified", note: "استایل پیش‌فرض کتابخانه" },
  { hex: "#07BC0C", where: "--toastify-color-success", status: "verified" },
  { hex: "#3498DB", where: "--toastify-color-info", status: "verified" },
  { hex: "gradient", where: "--toastify-color-progress-light: سبز→آبی→بنفش→صورتی", status: "verified", note: "پیش‌فرض Toastify، شخصی‌سازی نشده" },
  { hex: "#F7F6DA", where: "اینستاگرام: کاور هایلایت STORES", status: "verified", note: "کرم مایل به زرد؛ در سایت استفاده نشده" },
];

export const typography = {
  site: ["Modam (فارسی)", "Quattrocento Sans (لاتین)"],
  findings: [
    "متن‌های انگلیسی در سایت فارسی: «Shop the look / Complete your outfit»، بنر «UP TO 70% OFF FASHION FRIDAY»",
    "ارقام: اکثر شماره‌ها لاتین، روشا فارسی؛ در هایلایت اینستاگرام ارقام فارسی با یک رقم لاتین",
  ],
};

export const harmonyFindings = [
  { severity: "high" as Severity, text: "قرمز برند در ۷ شید مختلف بین سایت و اینستاگرام (‎#72000E‎ تا ‎#7B1717‎)؛ اینستاگرام گرم‌تر (هیو ۰°)، سایت سردتر (هیو ۳۵۳°)" },
  { severity: "high" as Severity, text: "صفحه محصول: بلوک آبی اسنپ‌پی (‎#008FFF‎) درست زیر CTA زرشکی؛ پررنگ‌ترین المان صفحه رنگ برند نیست" },
  { severity: "medium" as Severity, text: "رنگ‌های پیش‌فرض کتابخانه‌ها (Toastify سبز و گرادیان رنگین‌کمانی، آیکن‌های آبی FAQ) شخصی‌سازی نشده‌اند" },
  { severity: "medium" as Severity, text: "رنگ خطای سایت (‎#9A2424‎) تقریباً هم‌رنگ برند است؛ خطا و برند از هم تشخیص داده نمی‌شوند" },
  { severity: "medium" as Severity, text: "کاور هایلایت‌ها دو زبان تصویری مختلف دارند (کرم + تصویرسازی / زرشکی + گرافیک)" },
  { severity: "low" as Severity, text: "دکمه شناور پشتیبانی (گفتینو) در موبایل روی «مبلغ نهایی» سبد کشویی می‌افتد" },
];

/* ------------------------------------------------------------------ */
/* Website: purchase flow (mobile 375px)                                */
/* ------------------------------------------------------------------ */

export interface FlowStep {
  step: string;
  ok: boolean;
  finding?: string;
}

export const purchaseFlow: FlowStep[] = [
  { step: "صفحه اصلی", ok: true, finding: "بنر اصلی انگلیسی (Fashion Friday)" },
  { step: "دسته‌بندی", ok: true, finding: "۱ محصول در هر ردیف موبایل؛ متن سئو بلند پایین صفحه" },
  { step: "صفحه محصول", ok: false, finding: "نام کدی («شلوار ساده زنانه مدل ۵۴۴۶»)؛ سایز ۴۲ از قبل انتخاب شده؛ بدون نظر" },
  { step: "افزودن به سبد", ok: false, finding: "بدون انتخاب سایز توسط کاربر، سایز ۴۲ اضافه شد؛ پاپ‌آپ «تکمیل استایل» خوب است" },
  { step: "سبد کشویی", ok: false, finding: "دکمه شناور پشتیبانی روی مبلغ نهایی؛ هزینه ارسال نمایش داده نمی‌شود" },
  { step: "ورود با موبایل (OTP)", ok: false, finding: "خرید مهمان ندارد؛ ورود اجباری قبل از پرداخت؛ تیک قوانین از قبل زده شده" },
  { step: "پرداخت", ok: true, finding: "تست تا صفحه ورود؛ پرداخت انجام نشد" },
];

export const flowStrengths = [
  "اقساط ۴ ماهه اسنپ‌پی بدون سود",
  "راهنمای سایز، سایز و قد مانکن، جنس و راهنمای شست‌وشو",
  "Shop the look بعد از افزودن به سبد (کراس‌سل)",
  "ارسال رایگان بالای ۵ میلیون تومان",
  "نماد اعتماد و ساماندهی",
  "ورود با موبایل: شماره هر کاربری که تا پرداخت رفته ثبت می‌شود (پایه SMS سبد رهاشده)",
];

/* ------------------------------------------------------------------ */
/* Website: technical & SEO                                             */
/* ------------------------------------------------------------------ */

export const techSeo = [
  { topic: "سرعت", finding: "TTFB ۱.۱ ثانیه، لود کامل ۶.۴ ثانیه، ۷۸ درخواست، ~۷۹۰KB (یک تست دسکتاپ)", severity: "medium" as Severity },
  { topic: "alt تصاویر", finding: "۲۵ از ۳۷ در صفحه اصلی، ۱۴ از ۲۸ در صفحه محصول بدون alt", severity: "medium" as Severity },
  { topic: "متا دیسکریپشن محصول", finding: "همه صفحات محصول = متن صفحه اصلی (تکراری)", severity: "high" as Severity },
  { topic: "اسکیمای محصول", finding: "aggregateRating خالی ([])؛ ستاره در نتایج گوگل نمایش داده نمی‌شود", severity: "medium" as Severity },
  { topic: "تایتل محصول", finding: "پسوند «| sarak» با حروف کوچک لاتین", severity: "low" as Severity },
  { topic: "نام محصول", finding: "کدی و تکراری به جای نام توصیفی", severity: "high" as Severity },
  { topic: "رندر محتوا", finding: "محتوای FAQ، قوانین و جزئیات شعب سمت کلاینت لود می‌شود", severity: "low" as Severity },
  { topic: "کلمات ورودی", finding: "Similarweb: بیشتر ورودی ارگانیک از کلمه برند (سارک، sarak)", severity: "medium" as Severity },
  { topic: "مجله", finding: "روی ساب‌دامین؛ وقفه انتشار از ۲۸ خرداد تا ۹ آبان ۱۴۰۵؛ صفحه اول مجله محتوای ۲۰۲۴", severity: "medium" as Severity },
  { topic: "دسته‌بندی", finding: "محتوای سئو کامل + FAQ + تگ‌های مرتبط (نقطه قوت)", severity: "low" as Severity },
];

export const siteToInstagram = {
  siteLinksToInstagram: false,
  instagramLinksToSite: true,
  note: "سایت فقط لینکدین دارد؛ اینستاگرام ۱۸۴ هزارنفری از سایت لینک نشده",
};

/* ------------------------------------------------------------------ */
/* Traffic (third-party estimate)                                       */
/* ------------------------------------------------------------------ */

export const traffic = {
  source: "Similarweb",
  period: "اکتبر ۲۰۲۶",
  status: "estimate" as Status,
  visits: 12_300,
  momChange: -44.85,
  bounceRate: 40.14,
  pagesPerVisit: 3.45,
  avgVisitDuration: "01:40",
  organicSearchShareDesktop: 31.09,
  paidKeywordShare: 0,
  similarSites: ["tandorost.com", "pooshaak.com", "tulikamode.com"],
  caveat: "Similarweb ترافیک ایران را کم برآورد می‌کند؛ عدد قطعی از GA4 سارک",
};

/* ------------------------------------------------------------------ */
/* Martech stack (scripts loaded on sarak-co.com)                       */
/* ------------------------------------------------------------------ */

export const stack = [
  { tool: "Google Tag Manager", use: "مدیریت تگ‌ها" },
  { tool: "Google Analytics 4", use: "آنالیتیکس" },
  { tool: "Microsoft Clarity", use: "هیت‌مپ و سشن رکوردینگ" },
  { tool: "Yektanet", use: "تبلیغات نیتیو + ریتارگتینگ (audience)" },
  { tool: "Mediaad", use: "شبکه تبلیغاتی" },
  { tool: "Goftino", use: "چت آنلاین پشتیبانی" },
  { tool: "Snapp Pay", use: "خرید اقساطی" },
  { tool: "Toastify", use: "نوتیفیکیشن‌های سایت (استایل پیش‌فرض)" },
];

export const sms = {
  siteCapture: "فقط فرم خبرنامه ایمیلی در فوتر",
  phoneCapture: "ورود/ثبت‌نام فقط با موبایل (OTP)",
  storeCapture: "todo — گرفتن شماره در شعب بررسی نشده",
  observedCampaigns: "todo",
};

export const ads = {
  pixels: ["Yektanet", "Mediaad"],
  googlePaidKeywords: "۰٪ طبق Similarweb",
  brandSearch: "todo — بررسی تبلیغ رقبا روی کلمه «سارک»",
};

/* ------------------------------------------------------------------ */
/* Findings mapped to the job duties                                    */
/* ------------------------------------------------------------------ */

export const duties = [
  { id: "awareness", title: "استراتژی آگاهی از برند", findings: ["ورودی ارگانیک وابسته به کلمه برند", "مجله ۱,۰۶۷ مقاله ولی متصل به محصول نیست و ۴.۵ ماه وقفه داشته", "پیج جدای مجله (@sarak.comode) با ~۳۹K فالوور"] },
  { id: "identity", title: "یکپارچه‌سازی هویت بصری (سوشال، سایت، شعب)", findings: ["۷ شید قرمز برند", "آبی اسنپ‌پی و رنگ‌های پیش‌فرض Toastify", "زبان دوگانه فارسی/انگلیسی", "اطلاعات شعب ناهمسان بین سایت، اینستاگرام و گوگل‌مپ"] },
  { id: "inbound", title: "افزایش ورودی", findings: ["سایت به اینستاگرام لینک نمی‌دهد", "۹ شعبه شهرستان در سایت نیستند", "متا و نام محصولات سئو نشده"] },
  { id: "analytics", title: "آنالیز داده", findings: ["GA4، GTM و Clarity فعال‌اند", "داشبورد فانل و استفاده از سشن رکوردینگ: todo (سؤال از تیم)"] },
  { id: "growth", title: "صف رشد", findings: ["۱۲٪ محصولات نظر دارند", "سایز پیش‌فرض", "خرید مهمان ندارد"] },
  { id: "sms", title: "بهبود SMS مارکتینگ", findings: ["شماره موبایل در ورود جمع می‌شود", "سناریوی سبد رهاشده / درخواست نظر / موجود شدن سایز: todo (سؤال از تیم)"] },
  { id: "ppc", title: "تبلیغات کلیکی", findings: ["پیکسل یکتانت و مدیااد فعال", "کلمات پولی گوگل ۰٪ (Similarweb)"] },
];

/* ------------------------------------------------------------------ */
/* Still to collect                                                     */
/* ------------------------------------------------------------------ */

export const todo = [
  "نرخ تعامل اینستاگرام: لایک و کامنت ۱۲ پست آخر",
  "تعداد استوری روزانه و زمان پاسخ دایرکت",
  "۲–۳ رقیب و همان اعداد (فالوور، نرخ تعامل، سرعت سایت)",
  "گرفتن شماره موبایل در صندوق شعب (بازدید یا تماس)",
  "تبلیغ رقبا روی جست‌وجوی «سارک»",
  "دستاوردهای عددی ناریان برای اسلاید تجربه",
];

/* ------------------------------------------------------------------ */
/* Screenshots (public/screenshots/sarak/)                              */
/* ------------------------------------------------------------------ */

export const screenshots = [
  { src: "/screenshots/sarak/product-cta-snapppay.jpg", caption: "CTA زرشکی + بلوک آبی اسنپ‌پی + Shop the look انگلیسی + سایز ۴۲ پیش‌فرض" },
  { src: "/screenshots/sarak/product-top.jpg", caption: "نام کدی محصول، سایز ۴۲ از قبل انتخاب‌شده" },
  { src: "/screenshots/sarak/faq-blue-icons.jpg", caption: "آیکن‌های آبی صفحه سوالات متداول", lowRes: true },
  { src: "/screenshots/sarak/add-to-cart-toast.jpg", caption: "تست سبز Toastify + پاپ‌آپ تکمیل استایل", lowRes: true },
  { src: "/screenshots/sarak/mini-cart-overlap.jpg", caption: "دکمه پشتیبانی روی مبلغ نهایی", lowRes: true },
  { src: "/screenshots/sarak/login-otp.jpg", caption: "ورود اجباری با موبایل قبل از پرداخت", lowRes: true },
  { src: "/screenshots/sarak/home-hero.jpg", caption: "بنر انگلیسی Fashion Friday", lowRes: true },
  { src: "/screenshots/sarak/instagram-profile.png", caption: "پروفایل اینستاگرام: بیو انگلیسی، ۲ هایلایت" },
  { src: "/screenshots/sarak/branches-tehran.png", caption: "هایلایت شعب تهران" },
  { src: "/screenshots/sarak/branches-other-cities.png", caption: "هایلایت شعب شهرستان" },
];
