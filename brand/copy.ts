/**
 * copy.ts — every reader-facing string that is specific to THIS shop.
 *
 * The boundary: a string lives here when a different storefront would have to
 * change it. Generic commerce chrome that every shop shares — 小計, 數量,
 * 加入購物車, 結帳 — stays in the component that renders it. Moving those here
 * would turn `brand/` into a second copy of the markup without making anything
 * more portable.
 *
 * The home page ships as two PRESETS — `homeMultipage` and `homeLanding` —
 * and `home` selects one. See the block above them for which is which.
 */
import { identity } from './identity';

export type NavItem = { label: string; href: string };
/**
 * A nav entry that also carries a glyph. `icon` is a public asset URL and is
 * OPTIONAL: a shop that has not drawn its own gets a neutral one from the
 * component, rather than an empty box where a picture should be.
 */
export type IconLink = NavItem & { icon?: string };
export type FooterGroup = { title: string; links: NavItem[] };
/**
 * `icon` is OPTIONAL, and its absence is the normal case.
 *
 * It was required, so the template had to ship a glyph for every list that
 * wanted one — and a shop with no marks of its own pointed every entry at the
 * same file. That file drew a numeral, so three assurances rendered “1 1 1” and
 * five steps rendered “1” beside the numbers 1 to 5. A stand-in that MAKES A
 * CLAIM is worse than a missing one: nothing looks broken, it just lies.
 *
 * So no icon is the default, and every render site checks before drawing.
 */
export type IconItem = { title: string; text: string; icon?: string };
export type ImageItem = { title: string; text: string; image: string };

/**
 * Header + mobile-drawer navigation, in render order.
 *
 * EMPTY THIS for a one-page shop. There is nothing to navigate to when the
 * catalogue, the FAQ and the contact details are all further down the same
 * document, so the header drops its centre column and its drawer with it and
 * keeps only the cart / member / call-to-action cluster.
 */
export const navigation: NavItem[] = [];

/**
 * The header controls that sit opposite the wordmark, in every shape of shop.
 *
 * `ctaLabel: ''` removes the button — a shop whose header should carry nothing
 * but the cart and the member link says so here rather than in the component.
 * `ctaHref` runs through the same route filter as every other link, so a CTA
 * pointing at a page this build did not produce disappears instead of 404ing.
 */
export const header = {
  cart: '購物車',
  member: '會員',
  ctaLabel: '立即選購',
  ctaHref: '/#catalogue',
  /**
   * SHOWCASE ONLY (`flags.commerce: false`). The single button that replaces
   * the whole cart / member / call-to-action cluster.
   *
   * It is here rather than in the component for the same reason `ctaLabel` is:
   * a shop that would rather say 私訊詢價 than 加 LINE 詢問 is making a copy
   * decision, and copy decisions live in brand/. A transacting shop never
   * renders it and can leave it as shipped.
   */
  inquiryLabel: '立即詢問'
};

/** Footer link columns. The company block is appended by the component. */
/*
 * The comp draws 選購指南, 客戶服務 and 關於我們 columns. Their entries —
 * 所有商品, 配送說明, 品牌故事, 門市資訊 … — would point at pages this one-page showcase
 * never builds, so they are not here: the first column walks the home page
 * instead, and the second carries the three documents that DO exist. With the
 * brand column and the derived 聯絡資訊 block that keeps the template's four
 * columns, and every link in them resolves.
 */
export const footerGroups: FooterGroup[] = [
  {
    title: '快速連結',
    links: [
      { label: '精選商品', href: '/#catalogue' },
      { label: '書寫時刻', href: '/#scenes' },
      { label: '常見問題', href: '/#faq' },
      { label: '聯絡我們', href: '/#contact' }
    ]
  },
  {
    title: '購物資訊',
    links: [
      { label: '使用條款', href: '/terms' },
      { label: '隱私權政策', href: '/privacy' },
      { label: '退換貨政策', href: '/returns-policy' }
    ]
  }
];

/** The row beside the copyright, in the bar under the footer columns. */
export const footerLegalLinks: NavItem[] = [
  { label: '隱私權政策', href: '/privacy' },
  { label: '使用條款', href: '/terms' },
  { label: '退換貨政策', href: '/returns-policy' }
];


/**
 * Home page presets.
 *
 * A home page is the one page whose SHAPE is a business decision, not a layout
 * decision: a shop that uses it as a front door to other pages and a shop that
 * sells straight off it do not want the same blocks in a different order, they
 * want different blocks. So the template ships two, and `home` below picks one.
 *
 *   multipage  hero → features → featured products → highlights → band → steps
 *              Every block ends in a link somewhere else. Nothing is bought.
 *
 *   landing    hero → catalogue → story → trust → FAQ teaser → CTA
 *              The catalogue block adds to the cart in place, so this preset is
 *              a whole shop on one URL.
 *
 * `preset` is the discriminator src/pages/index.astro switches on, and it is
 * what makes the two type-safe to hold in one file: filling in `homeLanding`
 * cannot accidentally satisfy the multipage renderer. Fill in the one you use
 * and leave the other as shipped — it costs nothing until it is selected.
 */
export type CtaLink = { label: string; href: string };

export type HeroCopy = {
  /**
   * Which way the hero IMAGE runs, so the copy on top of it can be legible.
   *
   * 'light' — a pale image; the copy is ink and a scrim keeps it readable.
   * 'dark'  — a dark, side-lit photograph; the copy is white and NO scrim is
   *           applied, because a picture chosen for its dark side does not need
   *           rescuing and a wash would only flatten it.
   *
   * This is a fact about the artwork, not a style preference, which is why it
   * sits beside the image path rather than in a stylesheet.
   */
  tone: 'light' | 'dark';
  /**
   * What goes BETWEEN the copy and the photograph — if anything.
   *
   * `tone` says which way the picture runs and therefore what colour the copy
   * is. This says what, if anything, is put underneath it, and the two are
   * genuinely separate questions: a pale photograph can be pale in a way that
   * carries dark copy perfectly well.
   *
   *   'scrim' — the gradient wash. Cheap, keeps the picture, and is enough when
   *             the copy area is merely marginal.
   *   'panel' — a block of --cta-dark behind the copy, light copy on top. Costs
   *             a quarter of the image and buys the only guarantee available:
   *             a DECLARED pair (--color-on-dark on --cta-dark) that
   *             `npm run audit:color` already checks, so legibility stops
   *             depending on which picture is behind it.
   *   'none'  — the photograph, plain. Only honest once the copy area has been
   *             MEASURED, because contrast over a photograph is a distribution,
   *             not a number: an image can average beautifully and still leave a
   *             few per cent of the copy area under AA — and that few per cent
   *             lands on the thin strokes of a display face, where the
   *             percentage understates badly what an eye actually sees.
   *
   * Default when unset: 'scrim' for a light image, 'none' for a dark one, which
   * is what the two tones have always meant on their own.
   *
   * MEASURE BEFORE CHOOSING. docs/PITFALLS.md #7 gives the method, including
   * the part people get wrong — working out where the copy actually lands
   * before sampling a single pixel.
   *
   * The multipage hero has never carried a scrim and still does not; it honours
   * 'panel' and otherwise leaves the photograph alone.
   */
  copyGround?: 'scrim' | 'panel' | 'none';
  /**
   * The same question again, for the phone — because it is a different picture.
   *
   * `<picture>` swaps in `mobileImage` on a narrow screen, and a portrait crop
   * of the same scene is a different photograph as far as the copy is
   * concerned: it lands on different pixels. Measured on the shops in this
   * family, the landscape crop cleared AA over its whole copy area while the
   * portrait crop of the SAME hero left 22% and 41% of it under AA. A single
   * field would have made those shops choose between a phone that reads and a
   * desktop hero carrying a panel it does not need.
   *
   * Applies at 760px and below; `copyGround` applies above it.
   *
   * UNSET INHERITS `copyGround`. It does not mean 'none' — a shop that chose a
   * scrim chose it for the hero, and quietly dropping it on phones would be the
   * opposite of what it asked for. Set this only when the phone has been
   * MEASURED and disagrees with the desktop.
   */
  mobileCopyGround?: 'scrim' | 'panel' | 'none';
  /**
   * Which side of the hero the copy sits on. Absent is 'left', which is where
   * every hero sat before this field existed.
   *
   * It pairs with `scrim.from`, and pairing them is the point: the wash exists
   * to make the copy legible, so copy on the right over a wash entering from
   * the left is a hero with a pale quarter nobody is standing in. Nothing
   * enforces the pairing — a photograph may well carry one side on its own —
   * but they are the two halves of one decision.
   */
  align?: 'left' | 'right';
  /**
   * The legibility wash, as three independent choices. Absent — or any field
   * of it absent — is the gradient this template always drew: entering from
   * the left, built from the page's own pale ground, solid for its first
   * quarter.
   *
   * WHETHER there is a wash at all is still `copyGround`. This only describes
   * the one that gets drawn.
   */
  scrim?: {
    /** Which side the opaque end sits on. Default 'left'. */
    from?: 'left' | 'right';
    /** 'surface' is the pale page ground; 'dark' is the panel's near-black. */
    tint?: 'surface' | 'dark';
    /** How far it carries. 'standard' is the shipped gradient exactly. */
    depth?: 'light' | 'standard' | 'heavy';
  };
  title: string;
  /**
   * A handwritten line set on the far side of the hero from the copy, in
   * `--font-script` and the accent colour. OPTIONAL — absent or empty renders
   * nothing. Only HomeLanding reads it.
   *
   * ⚠️ The script face is loaded with Google Fonts' `text=` subset, so it
   * carries ONLY the glyphs of the lines written in this file. Change the
   * words and change `text=` in `identity.fontStylesheets` in the same edit.
   */
  script?: string;
  /**
   * The small letterspaced line at the foot of the hero, after a short rule.
   * OPTIONAL — absent or empty renders nothing. Only HomeLanding reads it.
   */
  tagline?: string;
  /**
   * The small line above the headline. Empty string renders nothing — a comp
   * with no eyebrow is a choice, not an omission, and the hero drops the
   * element rather than leaving a blank line where it would have been. The KEY
   * still has to be present, so "chose not to" stays distinguishable from
   * "forgot".
   */
  eyebrow: string;
  /** `\n` renders as a line break — the block is `white-space: pre-line`. */
  description: string;
  ctaLabel: string;
  ctaHref: string;
  image: string;
  mobileImage: string;
  imageAlt: string;
};

export type HomeMultipageCopy = {
  preset: 'multipage';
  metaTitle: string;
  metaDescription: string;
  hero: HeroCopy;
  /** Icon strip directly under the hero. Six entries fill the desktop row. */
  features: IconItem[];
  /** The featured-products band. Products come from the commerce API. */
  featured: { title: string; linkLabel: string; linkHref: string };
  /** Copy column plus a four-up image grid. */
  highlights: {
    eyebrow: string;
    title: string;
    lead: string;
    ctaLabel: string;
    ctaHref: string;
    items: ImageItem[];
  };
  /** Full-bleed image band with the copy floated over it. */
  band: {
    eyebrow: string;
    title: string;
    lead: string;
    ctaLabel: string;
    ctaHref: string;
    image: string;
    imageAlt: string;
  };
  /** Numbered steps. Five entries fill the desktop row. */
  steps: {
    eyebrow: string;
    title: string;
    items: { step: string; title: string; text: string; icon?: string }[];
  };
};

export type HomeLandingCopy = {
  preset: 'landing';
  metaTitle: string;
  metaDescription: string;
  hero: HeroCopy;
  /**
   * The assurance strip under the hero — the "why buy here" row. Five entries
   * fill the desktop row; emptying the array removes the strip.
   */
  trust: { items: IconItem[] };
  /**
   * The product block. Products themselves come from the commerce API.
   *
   * `linkLabel` / `linkHref` are the "view all" beside the heading, and they
   * are OPTIONAL: a one-page shop's catalogue block already shows everything
   * there is, so it has nowhere to send anyone. Omitting the label removes the
   * link rather than rendering an empty anchor.
   */
  catalogue: {
    eyebrow: string;
    title: string;
    lead: string;
    linkLabel?: string;
    linkHref?: string;
  };
  /**
   * Occasion cards — the "what is this for" band. Emptying the array removes it.
   *
   * FOUR, in this shop. The template's grid is three columns; this shop's
   * HomeLanding runs four at desktop, two from 1024px down and one from 560px
   * down, so four entries fill one desktop row and two tablet rows exactly.
   * A fifth would drop to a row on its own and read as a mistake.
   */
  scenes: {
    /** `\n` renders as a line break. */
    title: string;
    /**
     * The small letterspaced label opposite the title. `\n` renders as a line
     * break. OPTIONAL; absent renders the title alone.
     */
    eyebrow?: string;
    items: (ImageItem & { imageAlt?: string })[];
  };

  /**
   * The FAQ disclosure block. The questions are NOT authored here — the page
   * reads `faq.items` further down and resolves the payment and shipping
   * answers from merchant config, exactly as the standalone /faq page does.
   * One source, one answer.
   *
   * `eyebrow` and `lead` empty render nothing. `aside` is the small label in
   * the right margin and `script` the handwritten line under it; both are
   * decoration on a wide screen only, and both are OPTIONAL. `script` shares
   * the hero's `text=` font subset — see `HeroCopy.script`.
   */
  faq: { eyebrow: string; title: string; lead: string; aside?: string; script?: string };
  /**
   * The contact strip above the footer. The phone, e-mail and service hours it
   * shows are NOT authored here: they derive from the merchant record, same as
   * the footer and the legal pages, so the three cannot disagree.
   */
  lineCta: {
    /** The letterspaced line above the title. OPTIONAL; empty renders nothing. */
    eyebrow?: string;
    /** `{channel}` is replaced with `identity.line.id`. */
    title: string;
    /** Two short lines under the title. More render; they just get long. */
    lines: string[];
    buttonLabel: string;
    /** Under the QR code. Only rendered when identity.assets.lineQr is set. */
    qrCaption: string;
  };
};

export type HomeCopy = HomeMultipageCopy | HomeLandingCopy;

/**
 * The multipage preset: a fixed sequence of six blocks, each entry below
 * filling one of them. This is not a section registry — emptying an entry's
 * `items` array collapses that block rather than rendering a heading with
 * nothing under it.
 */
export const homeMultipage: HomeMultipageCopy = {
  preset: 'multipage',
  metaTitle: '首頁',
  metaDescription: `${identity.name} 線上商店`,

  hero: {
    tone: 'light',
    eyebrow: 'EXAMPLE STORE',
    title: '這裡是首頁主標題',
    /** `\n` renders as a line break — the block is `white-space: pre-line`. */
    description: '這段副標來自 brand/copy.ts。\n替換成你要對客人說的第一句話。',
    ctaLabel: '立即選購',
    ctaHref: '/products',
    image: '/assets/home/hero.svg',
    mobileImage: '/assets/home/hero-mobile.svg',
    imageAlt: '首頁主視覺'
  },

  /** Icon strip directly under the hero. Six entries fill the desktop row. */
  features: [
    { title: '重點一', text: '一句話說明\n這項優勢' },
    { title: '重點二', text: '一句話說明\n這項優勢' },
    { title: '重點三', text: '一句話說明\n這項優勢' },
    { title: '重點四', text: '一句話說明\n這項優勢' },
    { title: '重點五', text: '一句話說明\n這項優勢' },
    { title: '重點六', text: '一句話說明\n這項優勢' }
  ] as IconItem[],

  /** The featured-products band. Products come from the commerce API. */
  featured: {
    title: '精選商品',
    linkLabel: '查看全部商品 →',
    linkHref: '/products'
  },

  /** Copy column plus a four-up image grid. */
  highlights: {
    eyebrow: 'HIGHLIGHTS',
    title: '產品特色',
    lead: '這段文字說明你的產品為什麼值得被選擇。',
    ctaLabel: '了解更多',
    ctaHref: '/about',
    items: [
      { title: '特色一', text: '簡短說明', image: '/assets/home/highlight.svg' },
      { title: '特色二', text: '簡短說明', image: '/assets/home/highlight.svg' },
      { title: '特色三', text: '簡短說明', image: '/assets/home/highlight.svg' },
      { title: '特色四', text: '簡短說明', image: '/assets/home/highlight.svg' }
    ] as ImageItem[]
  },

  /** Full-bleed image band with the copy floated over it. */
  band: {
    eyebrow: 'ABOUT',
    title: `關於 ${identity.name}`,
    lead: '兩到四行品牌敘述，說明你是誰、為誰而做。',
    ctaLabel: '了解更多品牌故事 →',
    ctaHref: '/about',
    image: '/assets/home/band.svg',
    imageAlt: '品牌形象'
  },

  /** Numbered steps. Five entries fill the desktop row. */
  steps: {
    eyebrow: 'HOW IT WORKS',
    title: '使用步驟',
    items: [
      { step: 'STEP 1', title: '步驟一', text: '一句話說明' },
      { step: 'STEP 2', title: '步驟二', text: '一句話說明' },
      { step: 'STEP 3', title: '步驟三', text: '一句話說明' },
      { step: 'STEP 4', title: '步驟四', text: '一句話說明' },
      { step: 'STEP 5', title: '步驟五', text: '一句話說明' }
    ]
  }
};

/**
 * The one-page preset, shipped as neutral placeholder copy. Selecting it is one
 * edit at the bottom of this block; filling it in is the same job as filling in
 * `homeMultipage`.
 *
 * The sequence it renders is fixed:
 *   hero → trust strip → catalogue → occasion cards → contact strip
 * Emptying `trust.items` or `scenes.items` removes that band rather than
 * leaving a heading with nothing under it.
 */
export const homeLanding: HomeLandingCopy = {
  preset: 'landing',
  metaTitle: '書寫，讓日常更美好',
  metaDescription:
    '精選全球質感文具：鋼筆、筆記本、手帳與文具禮盒，陪伴你書寫生活的每一個重要時刻。',

  /*
   * A LIGHT photograph under dark copy, as drawn: a window-lit writing desk,
   * the copy on its calm left side, a pale wash from the left.
   *
   * FULL-BLEED since 2026-09-29: min(88svh, 760px) tall on a desktop,
   * min(78svh, 620px) on a phone, natural height on a landscape phone.
   *
   * MEASURED per glyph, per docs/PITFALLS.md #7: each character's own rect,
   * with `.hero-copy > *` hidden (the script: its ink made transparent, so
   * its wash stays), against the colour that character is set in. 2026-09-29,
   * hero-v2 (1920x1200) / hero-mobile-v2 (900x1400):
   *
   *   1440x900   0 glyphs under 4.5. Minimums: eyebrow 8.11, title 11.76,
   *              lead 7.72, tagline 7.31, script 7.18 (upper right, over the
   *              blurred wall and its page-ground wash).
   *   1280x800   0. eyebrow 8.11, title 12.94, lead 7.98, tagline 7.91,
   *              script 8.04.
   *   1100x800   0. eyebrow 8.11, title 13.29, lead 7.74, tagline 7.44,
   *              script 7.20.
   *   820x1180   0 (no script at this width). eyebrow 7.39, title 13.51,
   *              lead 6.86, tagline 6.44.
   *   390x844    0 (phone wash solid to 55%). eyebrow 7.90, title 13.63,
   *              lead 6.63, tagline 6.50.
   *   844x500    landscape, 0. eyebrow 7.44, title 12.25, lead 6.20,
   *              tagline 6.28.
   *   Button: its fill against the photograph around it 5.45, the label on
   *   the fill 5.79.
   *
   * A conclusion about THESE words on THESE crops. Change either, measure again.
   */
  hero: {
    tone: 'light',
    copyGround: 'scrim',
    mobileCopyGround: 'scrim',
    align: 'left',
    scrim: { from: 'left', tint: 'surface', depth: 'standard' },
    eyebrow: 'STATIONERY FOR A BETTER LIFE',
    title: '書寫，\n讓日常更美好。',
    /** `\n` renders as a line break — the block is `white-space: pre-line`. */
    description: '精選全球質感文具，陪伴你記錄靈感、\n規劃生活、書寫屬於自己的節奏。',
    script: 'More Than Stationery',
    tagline: 'WRITE / PLAN / CREATE / LIVE',
    ctaLabel: '立即探索 →',
    ctaHref: '#catalogue',
    image: '/assets/home/hero-v2.jpg',
    mobileImage: '/assets/home/hero-mobile-v2.jpg',
    imageAlt: '書桌上的皮革手帳與眼鏡，旁邊亮著一盞暖色桌燈'
  },

  /* Five, as drawn. HomeLanding derives the column count from the entries. */
  trust: {
    items: [
      { icon: '/assets/home/trust/quality.svg', title: '嚴選品質', text: '來自世界各地的質感品牌' },
      { icon: '/assets/home/trust/style.svg', title: '風格多元', text: '從日常書寫到專業文創' },
      { icon: '/assets/home/trust/gift.svg', title: '送禮首選', text: '精緻包裝，傳遞心意' },
      { icon: '/assets/home/trust/shipping.svg', title: '快速出貨', text: '現貨供應・安心配送' },
      { icon: '/assets/home/trust/care.svg', title: '貼心服務', text: '專業諮詢・售後保障' }
    ] as IconItem[]
  },

  /* Title only, set left, as drawn. The comp's "More Products →" is not
     here: this block already IS the whole catalogue. */
  catalogue: {
    eyebrow: '',
    title: '精選商品',
    lead: ''
  },

  /*
   * Four, as drawn — work notes, the planner, sketching and a gift, one
   * scene per way the catalogue gets used.
   *
   * The captions sit ON the photographs, over a dark wash. MEASURED per glyph
   * on each card, caption ink made transparent so the wash stays, at 1440,
   * 820 and 390 wide, 2026-09-22: 0 glyphs with any pixel under 4.5 on all
   * four; weakest minimum 7.98 (card 1's title at 1440). Cards 2 and 3 are
   * pale at the lower left and still clear 8.0 — the wash carries them.
   */
  scenes: {
    title: '生活中的書寫時刻',
    eyebrow: 'A MORE MEANINGFUL EVERYDAY',
    items: [
      {
        title: '工作紀錄',
        text: '讓想法更清晰',
        image: '/assets/home/scene-01-v1.jpg',
        imageAlt: '在木書桌上以鋼筆寫筆記的手'
      },
      {
        title: '日常手帳',
        text: '收藏生活的小確幸',
        image: '/assets/home/scene-02-v1.jpg',
        imageAlt: '編織毯上的週計畫手帳與一支黃色筆'
      },
      {
        title: '靈感創作',
        text: '記錄每一個靈光',
        image: '/assets/home/scene-03-v1.jpg',
        imageAlt: '用鉛筆在素描本上畫紋樣的手'
      },
      {
        title: '送禮心意',
        text: '傳遞溫暖的祝福',
        image: '/assets/home/scene-04-v1.jpg',
        imageAlt: '以牛皮紙與淺藍緞帶包裝的禮物'
      }
    ]
  },

  faq: {
    eyebrow: '',
    title: '常見問題',
    lead: '',
    aside: 'FREQUENTLY ASKED QUESTIONS'
  },

  lineCta: {
    eyebrow: "LET'S WRITE A BETTER TOMORROW",
    title: '從一支喜歡的筆，開始更好的生活。',
    lines: [],
    /* The arrow is drawn by HomeLanding's own SVG, so it is not typed here. */
    buttonLabel: '立即詢問',
    qrCaption: '掃描加入 LINE 好友'
  }
};

/**
 * The preset this shop uses. Swap to `homeLanding` for a one-page shop; nothing
 * else changes — src/pages/index.astro renders whichever `preset` says.
 */
export const home: HomeCopy = homeLanding;

/**
 * Every preset the template ships, selected or not.
 *
 * Exported so src/pages/index.astro can VALIDATE all of them on every build,
 * not just the one it renders. A defect in the preset a shop has not selected
 * is invisible until somebody swaps a single line and ships it, and that is not
 * hypothetical: `homeLanding.hero` was missing its required `tone` and built
 * green for exactly as long as nobody selected it.
 *
 * Add a preset above, add it here. A preset absent from this list is a preset
 * nothing checks.
 */
export const homePresets: HomeCopy[] = [homeMultipage, homeLanding];

/**
 * The assurances, as a band any page can stand on.
 *
 * `homeMultipage.trust` is the home page's own strip and stays where it is: it
 * belongs to a preset, is ordered against the blocks around it, and a shop that
 * swaps presets swaps it too. This one is page-level — the same promises under
 * a product list, at the foot of the FAQ, below a contact form — so it is
 * declared once at the top level rather than copied into each page's block.
 *
 * `body` rather than the `text` that `IconItem` carries, and that is not an
 * inconsistency worth tidying away: they are read by different components, and
 * folding them onto one type would mean the home strip and this band could
 * never take different fields without a migration through every storefront.
 *
 * `icon` is a NAME, not a path. `TrustBand.astro` draws single-path line marks
 * inline, because a mark on a dark band has to take its colour from the ground
 * it lands on — `stroke: currentColor` — and an <img> cannot inherit ink. The
 * component ships shield / delivery / payment / support. `icon` may be left out
 * entirely, and then the band draws no mark rather than a stand-in that means
 * something else: a placeholder that MAKES A CLAIM is worse than a missing one,
 * as the numeral glyph in `IconItem` above records.
 *
 * Empty the array to remove the band from wherever it is used.
 */
export type TrustItem = { title: string; body: string; icon?: string };

export const trust: { items: TrustItem[] } = {
  items: [
    { icon: 'shield', title: '嚴選品質', body: '來自世界各地的質感品牌，逐一挑選。' },
    { icon: 'delivery', title: '快速出貨', body: '現貨供應・安心配送。' },
    { icon: 'support', title: '貼心服務', body: '專業諮詢・售後保障。' }
  ]
};

export const about = {
  metaTitle: `關於 ${identity.name}`,
  hero: {
    eyebrow: 'ABOUT',
    title: `關於 ${identity.name}`,
    description: '一段品牌介紹，說明你的來歷、堅持與想解決的問題。',
    ctaLabel: '前往商品',
    ctaHref: '/products',
    image: '/assets/about/hero.svg',
    imageAlt: '品牌形象'
  },
  story: {
    eyebrow: 'ORIGIN',
    title: '品牌故事',
    paragraphs: [
      '第一段故事文字。說明品牌怎麼開始的。',
      '第二段故事文字。說明你想帶給客人什麼。'
    ],
    image: '/assets/about/story.svg',
    imageAlt: '品牌故事'
  },
  values: {
    title: '我們在乎的事',
    lead: '一段說明，鋪陳下面這幾個價值主張。',
    items: [
      { title: '價值一', text: '簡短說明', image: '/assets/about/value.svg' },
      { title: '價值二', text: '簡短說明', image: '/assets/about/value.svg' },
      { title: '價值三', text: '簡短說明', image: '/assets/about/value.svg' },
      { title: '價值四', text: '簡短說明', image: '/assets/about/value.svg' },
      { title: '價值五', text: '簡短說明', image: '/assets/about/value.svg' }
    ] as ImageItem[]
  },
  cta: {
    title: '一句話收尾，邀請客人往下一步走',
    text: '補一句說明，降低點擊的猶豫。',
    image: '/assets/about/cta.svg',
    primary: { label: '前往商品', href: '/products' },
    secondary: { label: '閱讀專欄', href: '/blog' }
  }
};

export const products = {
  metaTitle: '全部商品',
  metaDescription: `${identity.name} 全系列商品`,
  hero: {
    eyebrow: 'ALL PRODUCTS',
    title: '全部商品',
    lead: '一句話說明這個系列涵蓋什麼。'
  },
  /** Names the ItemList JSON-LD emits for the grid. */
  itemListName: '全部商品'
};

/**
 * Product detail page copy.
 *
 * The assurance items and the two policy tabs are SHOP-level facts, not
 * per-product ones, so they live here rather than in the catalogue: a merchant
 * that changes its 鑑賞期 changes it once. The 商品說明 tab is the product's own
 * description from the commerce API and is NOT templated — renaming the tab
 * here does not change where its content comes from.
 */
export const productDetail = {
  /**
   * SHOWCASE ONLY (`flags.commerce: false`). The one button that replaces
   * 加入購物車 and 立即購買, and what it types into LINE on the customer's
   * behalf.
   *
   * `{product}` is substituted with the product's name — and with the chosen
   * spec appended, when the customer has picked one — so the merchant receives
   * "我想詢問：天絲萊賽爾四件組 雙人加大" rather than a bare 你好. The customer
   * can still edit it before sending; LINE opens the chat with the text in the
   * composer, it does not send anything.
   */
  inquiryLabel: '立即詢問',
  /*
   * EMPTY on purpose, so every enquiry opens the plain add-friend link
   * (`line.me/R/ti/p/…`) with nothing pre-typed — src/lib/line.ts falls back to
   * it when the message is empty.
   *
   * The pre-filled form (`oaMessage`) was measured on 2026-09-21 and fails hard
   * on desktop: line.me redirects a desktop browser straight to LINE's own
   * homepage (www.line.me/en/), with no account and no message. `ti/p` serves
   * the "Add LINE friend" page with the QR on desktop. Phones handed
   * `oaMessage` over to the app with the text intact, but a helper cannot tell
   * the two apart per device, so the one link that works everywhere wins.
   * The cost: 客服 can no longer tell from the first message which product,
   * or which shop, a chat came from.
   */
  inquiryMessage: '',

  assurances: [
    { title: '嚴選品質', text: '來自世界各地的質感品牌' },
    { title: '七日鑑賞期', text: '商品到貨日起算 7 天' },
    { title: 'LINE 諮詢', text: '筆尖、墨色與規格一對一回覆' }
  ] as IconItem[],

  /** Tab labels, in render order. The first tab is the API description. */
  tabs: {
    description: '商品說明',
    ingredients: '使用與保養',
    ordering: '詢問須知'
  },

  /** Shown when a product carries no description of its own. */
  descriptionFallback: '本商品尚未提供詳細說明，如需了解更多請聯繫客服。',

  /** Second tab. Replace with the facts your category actually needs. */
  ingredients: [
    '鋼筆請定期以清水清洗筆尖與吸墨器，更換墨水顏色前務必洗淨，避免墨水混色。',
    '紙製品與皮革製品請避免潮濕與陽光直射；皮革可定期以保養油擦拭。',
    '本頁內容為範例文案，實際規格以商品包裝標示為準。'
  ],

  /** Third tab. Ordering / shipping expectations, not the checkout's own rules. */
  ordering: [
    '本站為展示範例站，不提供線上結帳；點選「立即詢問」即可透過 LINE 與我們聯繫。',
    '詢問時請告知商品與規格，我們會回覆供貨與出貨時程。',
    '本頁內容為範例文案，商品與價格僅供版面示意。'
  ],

  relatedTitle: '您可能也喜歡'
};

export const contact = {
  metaTitle: '聯絡我們',
  metaDescription: `${identity.name} 聯絡資訊與服務`,
  hero: {
    eyebrow: 'CONTACT',
    title: '聯絡我們',
    lead: '感謝您的關注與支持，我們很樂意為您提供協助。'
  },
  methodsHeading: {
    title: '我們很樂意為您服務',
    lead: '無論您有任何疑問或需求，我們都會盡快回覆。'
  },
  methods: [
    {
      title: '客服支援',
      text: '商品、配送或售後相關疑問，我們會提供清楚的協助。',
      action: '聯絡客服支援',
      href: '#',
      image: '/assets/contact/card.svg'
    },
    {
      title: '合作諮詢',
      text: '若您有通路或異業合作需求，歡迎與我們聯繫。',
      action: '聯絡合作窗口',
      href: '#',
      image: '/assets/contact/card.svg'
    },
    {
      title: '訂單協助',
      text: '訂單查詢、修改或購買流程說明，我們會即時協助。',
      action: '取得訂單協助',
      href: '#',
      image: '/assets/contact/card.svg'
    }
  ]
};

/**
 * FAQ entries. `derive: 'payment' | 'shipping'` replaces the answer with one
 * projected from merchant config at build time — leave those answers empty so
 * no second, drifting list exists.
 */
export type FaqItem = {
  category: string;
  question: string;
  answer: string;
  derive?: 'payment' | 'shipping';
};

export const faq = {
  metaTitle: '常見問題',
  metaDescription: '購物、配送、付款與商品使用的常見問題整理。',
  hero: {
    eyebrow: 'FAQ',
    title: '常見問題',
    lead: '整理最常被問到的問題；若仍有疑問，歡迎直接與我們聯絡。'
  },
  ctaCopy: '找不到您的問題？',
  ctaLabel: '聯絡我們',
  ctaHref: '/#contact',
  /*
   * Five questions, all authored, in the comp's order. The payment and shipping DERIVED answers are
   * not asked here: this merchant sells nothing online and declares no payment
   * or shipping methods, so both derives return null and would drop their
   * question anyway (HomeLanding's DERIVE_ANSWER). 訂單多久會出貨 is a lead-time
   * question, not the list of carriers the shipping derive projects.
   */
  items: [
    {
      category: '訂購與出貨',
      question: '商品有現貨嗎？多久會出貨？',
      answer: '本站不提供線上結帳。透過 LINE 詢問確認品項與規格後，現貨商品一般於 1–2 個工作天內出貨；缺貨或預購品項會另行告知時程。'
    },
    {
      category: '訂購與出貨',
      question: '可以開立統一發票嗎？',
      answer: '本站為展示範例站，頁面所列公司資訊與統一編號為測試值。實際營運時，可於詢問時提供抬頭與統一編號，開立電子發票。'
    },
    {
      category: '商品問題',
      question: '是否提供禮品包裝服務？',
      answer: '可以。詢問時告知需要包裝的品項，我們會以簡約的紙盒與棉繩包裝；也可以直接選擇已附禮盒的文具禮盒。'
    },
    {
      category: '售後服務',
      question: '如果收到商品有問題怎麼辦？',
      answer: '請保留商品、包裝與照片，並於收貨後 24 小時內透過 LINE 官方帳號與我們聯繫。瑕疵與運送損壞會依退換貨政策處理。'
    },
    {
      category: '售後服務',
      question: '有實體門市可以參觀嗎？',
      answer: '本站為展示範例站，目前沒有實體門市。商品規格、筆尖粗細或墨色的問題，歡迎點選「立即詢問」透過 LINE 與我們聯繫。'
    }
  ] as FaqItem[]
};

export const notFound = {
  metaDescription: `${identity.name} 找不到頁面`,
  eyebrow: '404',
  title: '找不到頁面',
  /** Renders `white-space: pre-line`, so a line break here is a line break. */
  lead: `你開啟的頁面不存在或已被移動。
下面是幾個還在的入口。`,
  /** The hero runs dark over this image, so pick one that can carry white type. */
  heroImage: '/assets/home/hero-v1.jpg',
  heroImageAlt: '找不到頁面',
  ctaLabel: '回到首頁',
  secondaryCtaLabel: '瀏覽商品',
  secondaryCtaHref: '/#catalogue',
  /** The recommendation row. Products come from the commerce API. */
  recommendTitle: '為你推薦',
  quickLinksTitle: '快速連結',
  /**
   * Every entry runs through `visibleLinks`, so an entry whose route this build
   * did not produce removes itself. `icon` is optional — see IconLink.
   */
  quickLinks: [
    { label: '回到首頁', href: '/' },
    { label: '精選商品', href: '/#catalogue' },
    { label: '常見問題', href: '/#faq' },
    { label: '聯絡我們', href: '/#contact' }
  ] as IconLink[]
};

export const blog = {
  metaTitle: '專欄',
  metaDescription: `${identity.name} 專欄文章`,
  /** Small letterspaced line above the list and each article header. */
  eyebrow: `${identity.name} Journal`,
  /** Byline when the API returns no author. */
  authorFallback: `${identity.name} 編輯室`,
  /** Category chip when an article carries no tag. */
  categoryFallback: `${identity.name} Journal`,
  /** Names the ItemList JSON-LD emits, and the breadcrumb's second crumb. */
  itemListName: '專欄'
};

export const member = {
  loginMetaDescription: `${identity.name} 會員中心`,
  /** The last crumb on the login page. */
  breadcrumbLabel: '登入／註冊',
  loginTitle: '會員登入 / 註冊',
  loginLead: '使用 LINE 一鍵登入，首次登入將自動為您建立會員',
  loginButton: '使用 LINE 登入',
  /** What the shop does NOT take. Reassurance belongs beside the button. */
  loginPrivacy: '我們不會取得您的好友名單，也不會在 LINE 上公開任何資訊',
  /** Shown under the divider. The policy links are added by the page. */
  loginConsent: '繼續即表示您同意',
  /**
   * The panel beside the button. A login screen with nothing but a button on
   * it looks like an auth provider's page rather than this shop's, so the
   * second column carries the imagery and one line of the brand's own voice.
   */
  loginAside: {
    /* The login page's OWN image, not a borrowed home-page scene. It used to
       point at /assets/home/scene-01.svg, so a shop that replaced its home
       scenes shipped a placeholder on the one page every returning customer
       sees — and nothing said so, because the file it named still existed. */
    image: '/assets/login/aside.svg',
    imageAlt: '品牌情境圖',
    tagline: '這句 tagline 來自 brand/copy.ts，替換成你的品牌主張。'
  },
  accountMetaDescription: `${identity.name} 會員中心`,
  /** The dark band at the top of the member area. */
  accountHero: {
    title: '會員專區',
    lead: '這句話來自 brand/copy.ts，替換成你要對會員說的一句話。'
  },
  /** `{name}` is replaced with the member's display name. */
  accountWelcome: {
    greeting: '親愛的 {name}，歡迎回來！',
    lead: '感謝您一直以來的支持。'
  },
  /** `{url}` is replaced with the member's referral link. */
  referralShareText: `我在 ${identity.name} 挑了好東西，用我的邀請連結首購我們都能拿點數 👉 {url}`
};

export const cart = {
  metaDescription: `${identity.name} 購物車`,
  emptyEyebrow: 'Empty Cart',
  emptyTitle: '購物車是空的',
  emptyLead: '先去逛逛喜歡的商品，把它們加入購物車吧。',
  emptyCtaLabel: '繼續購物'
};

/**
 * Checkout and the order result.
 *
 * Field labels — 商品小計, 運費, 數量, 收件人資訊 — are NOT here: they are the
 * generic chrome every shop shares, and moving them would make brand/ a second
 * copy of the markup. What IS here is everything said in the shop's own voice:
 * the reassurance beside the pay button, and the three things it can tell a
 * customer once the order exists.
 */
export const checkout = {
  metaDescription: `${identity.name} 結帳`,
  completeMetaDescription: `${identity.name} 訂單完成`,
  gateTitle: '請先登入會員以完成結帳',
  memberGateLead: `${identity.name} 結帳採會員制，登入後即可填寫收件與付款資訊，並查詢訂單。`,
  /** Beside the pay button. Says what the shop does with a card number. */
  secureNote: {
    title: '交易安全加密處理',
    text: '您的付款資訊將受到最高等級的安全保護'
  },
  /**
   * The three outcomes /checkout/complete can be in. Which one shows is decided
   * by the ORDER (checkout.ts → deriveOrderState), never by this file — these
   * are only the words each outcome is announced in.
   */
  result: {
    paidTitle: '付款成功 / 訂單已成立',
    paidLead: '感謝您的訂購！我們已收到您的訂單，並將盡快為您處理。',
    pendingTitle: '付款待確認',
    pendingLead: '已為您保留訂單，完成繳費後系統會自動為您入帳。',
    failedTitle: '付款失敗',
    failedLead: '這筆訂單尚未完成付款。您可以重新下單，或與我們聯繫協助處理。',
    /** Shown on a placed COD order, where nothing was paid online. */
    codNote: '本筆為貨到付款，出貨後請於收件時將款項交給配送人員。'
  }
};

export const referral = {
  metaTitle: `歡迎來到 ${identity.name}`,
  metaDescription: '好友邀請連結',
  landingLine: `正在為您開啟 ${identity.name}…`
};

export const copy = {
  navigation,
  footerGroups,
  home,
  trust,
  about,
  products,
  contact,
  faq,
  notFound,
  blog,
  member,
  cart,
  checkout,
  referral
};
