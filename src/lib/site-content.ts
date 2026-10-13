export type SiteContentField = {
  key: string;
  label: string;
  type: "text" | "textarea" | "image";
  defaultValue: string;
};

export const SITE_CONTENT_PAGES = [
  {
    id: "global",
    title: "Header & footer",
    fields: [
      {
        key: "brand",
        label: "Brand name",
        type: "text",
        defaultValue: "NAADE",
      },
      {
        key: "navShop",
        label: "Shop navigation",
        type: "text",
        defaultValue: "Shop",
      },
      {
        key: "navJackets",
        label: "Jackets navigation",
        type: "text",
        defaultValue: "Jackets",
      },
      {
        key: "navShirts",
        label: "Shirts navigation",
        type: "text",
        defaultValue: "Shirts",
      },
      {
        key: "navNew",
        label: "New arrivals navigation",
        type: "text",
        defaultValue: "New Arrivals",
      },
      {
        key: "searchLabel",
        label: "Search label",
        type: "text",
        defaultValue: "Search",
      },
      {
        key: "bagLabel",
        label: "Shopping bag label",
        type: "text",
        defaultValue: "Bag",
      },
      {
        key: "footerTagline",
        label: "Footer tagline",
        type: "text",
        defaultValue: "Contemporary Ikat / Pochampally",
      },
      {
        key: "footerShop",
        label: "Shop column heading",
        type: "text",
        defaultValue: "Shop",
      },
      {
        key: "footerAbout",
        label: "About column heading",
        type: "text",
        defaultValue: "About",
      },
      {
        key: "footerHelp",
        label: "Help column heading",
        type: "text",
        defaultValue: "Help",
      },
      {
        key: "footerSocial",
        label: "Social column heading",
        type: "text",
        defaultValue: "Social",
      },
      {
        key: "footerStory",
        label: "Our story link",
        type: "text",
        defaultValue: "Our Story",
      },
      {
        key: "footerWeave",
        label: "The weave link",
        type: "text",
        defaultValue: "The Weave",
      },
      {
        key: "footerContact",
        label: "Contact link",
        type: "text",
        defaultValue: "Contact",
      },
      {
        key: "footerShipping",
        label: "Shipping link",
        type: "text",
        defaultValue: "Shipping",
      },
      {
        key: "footerReturns",
        label: "Returns link",
        type: "text",
        defaultValue: "Returns",
      },
      {
        key: "footerSizeGuide",
        label: "Size guide link",
        type: "text",
        defaultValue: "Size Guide",
      },
      {
        key: "footerInstagram",
        label: "Instagram link",
        type: "text",
        defaultValue: "Instagram",
      },
      {
        key: "footerLocation",
        label: "Footer location",
        type: "text",
        defaultValue: "Pochampally · Telangana · India",
      },
    ],
  },
  {
    id: "home",
    title: "Homepage",
    fields: [
      {
        key: "heroImage",
        label: "Hero image",
        type: "image",
        defaultValue: "/images/hero%20copy.jpg",
      },
      {
        key: "heroImageAlt",
        label: "Hero image description",
        type: "text",
        defaultValue: "Handwoven Pochampally Ikat cloth on a traditional loom",
      },
      {
        key: "heroEyebrow",
        label: "Hero eyebrow",
        type: "text",
        defaultValue: "NAADE",
      },
      {
        key: "heroTitle",
        label: "Hero title",
        type: "textarea",
        defaultValue: "Contemporary Ikat\nfrom Pochampally",
      },
      {
        key: "heroDescription",
        label: "Hero description",
        type: "textarea",
        defaultValue: "Modern menswear crafted from Pochampally Ikat.",
      },
      {
        key: "heroJacketsButton",
        label: "Hero jackets button",
        type: "text",
        defaultValue: "Shop Jackets",
      },
      {
        key: "heroShirtsButton",
        label: "Hero shirts button",
        type: "text",
        defaultValue: "Shop Shirts",
      },
      {
        key: "featuredEyebrow",
        label: "Collection eyebrow",
        type: "text",
        defaultValue: "Featured",
      },
      {
        key: "featuredTitle",
        label: "Collection title",
        type: "text",
        defaultValue: "The Collection",
      },
      {
        key: "featuredCopy",
        label: "Collection description",
        type: "textarea",
        defaultValue:
          "Contemporary silhouettes. Traditional weave. Made in Pochampally.",
      },
      {
        key: "viewAllButton",
        label: "View all products button",
        type: "text",
        defaultValue: "View All Products",
      },
      {
        key: "jacketsImage",
        label: "Jackets image",
        type: "image",
        defaultValue: "/images/category-jackets.jpg",
      },
      {
        key: "jacketsTitle",
        label: "Jackets heading",
        type: "text",
        defaultValue: "Jackets",
      },
      {
        key: "jacketsCopy",
        label: "Jackets description",
        type: "textarea",
        defaultValue: "Contemporary jackets crafted from Pochampally Ikat.",
      },
      {
        key: "shirtsImage",
        label: "Shirts image",
        type: "image",
        defaultValue: "/images/category-shirts.jpg",
      },
      {
        key: "shirtsTitle",
        label: "Shirts heading",
        type: "text",
        defaultValue: "Shirts",
      },
      {
        key: "shirtsCopy",
        label: "Shirts description",
        type: "textarea",
        defaultValue: "Modern silhouettes woven in Ikat.",
      },
      {
        key: "weaveImage",
        label: "Weave image",
        type: "image",
        defaultValue: "/images/weave-texture.jpg",
      },
      {
        key: "weaveImageAlt",
        label: "Weave image description",
        type: "text",
        defaultValue: "Close-up of handwoven Pochampally Ikat textile",
      },
      {
        key: "weaveEyebrow",
        label: "Weave eyebrow",
        type: "text",
        defaultValue: "Craft",
      },
      {
        key: "weaveTitle",
        label: "Weave title",
        type: "text",
        defaultValue: "The Weave",
      },
      {
        key: "weaveCopy",
        label: "Weave description",
        type: "textarea",
        defaultValue:
          "Pochampally Ikat is created by resist-dyeing yarns before weaving, allowing the pattern to emerge through the structure of the cloth itself.",
      },
      {
        key: "measureImage",
        label: "Made-to-measure image",
        type: "image",
        defaultValue: "/images/made-to-measure.jpg",
      },
      {
        key: "measureImageAlt",
        label: "Made-to-measure image description",
        type: "text",
        defaultValue:
          "Tailor taking measurements for a made-to-measure NAADE garment",
      },
      {
        key: "measureEyebrow",
        label: "Made-to-measure eyebrow",
        type: "text",
        defaultValue: "Made to Measure",
      },
      {
        key: "measureTitle",
        label: "Made-to-measure title",
        type: "textarea",
        defaultValue: "Your fit.\nYour NAADE.",
      },
      {
        key: "measureCopy",
        label: "Made-to-measure description",
        type: "textarea",
        defaultValue:
          "Selected NAADE pieces can be made using your measurements for a more personal fit.",
      },
      {
        key: "measureButton",
        label: "Made-to-measure button",
        type: "text",
        defaultValue: "Explore Made to Measure",
      },
    ],
  },
  {
    id: "shop",
    title: "Shop",
    fields: [
      { key: "eyebrow", label: "Eyebrow", type: "text", defaultValue: "Shop" },
      {
        key: "title",
        label: "Title",
        type: "text",
        defaultValue: "Shop NAADE",
      },
      {
        key: "copy",
        label: "Description",
        type: "textarea",
        defaultValue: "Contemporary menswear woven from Pochampally Ikat.",
      },
      {
        key: "tabAll",
        label: "All products filter",
        type: "text",
        defaultValue: "All",
      },
      {
        key: "tabJackets",
        label: "Jackets filter",
        type: "text",
        defaultValue: "Jackets",
      },
      {
        key: "tabShirts",
        label: "Shirts filter",
        type: "text",
        defaultValue: "Shirts",
      },
      {
        key: "tabNew",
        label: "New arrivals filter",
        type: "text",
        defaultValue: "New Arrivals",
      },
    ],
  },
  {
    id: "made-to-measure",
    title: "Made to Measure",
    fields: [
      {
        key: "eyebrow",
        label: "Eyebrow",
        type: "text",
        defaultValue: "Made to Measure",
      },
      {
        key: "title",
        label: "Title",
        type: "text",
        defaultValue: "Your Fit. Your NAADE.",
      },
      {
        key: "copy",
        label: "Introduction",
        type: "textarea",
        defaultValue:
          "Selected NAADE pieces can be made using your measurements for a more personal fit. Simply choose “Make It To My Measurements” on any eligible product page and provide your chest, waist, shoulder, sleeve, garment length and neck measurements in inches.",
      },
      {
        key: "detailOne",
        label: "Details paragraph one",
        type: "textarea",
        defaultValue:
          "Each made-to-measure garment is cut and finished individually, so please allow additional production time compared to standard sizes.",
      },
      {
        key: "detailTwo",
        label: "Details paragraph two",
        type: "textarea",
        defaultValue:
          "Measurements are stored securely with your order and shared directly with our tailoring team in Pochampally.",
      },
      {
        key: "button",
        label: "Shop button",
        type: "text",
        defaultValue: "Shop Made to Measure Pieces",
      },
      {
        key: "image",
        label: "Page image",
        type: "image",
        defaultValue: "/images/made-to-measure.jpg",
      },
      {
        key: "imageAlt",
        label: "Image description",
        type: "text",
        defaultValue:
          "Tailor measuring a client for a made-to-measure NAADE garment",
      },
    ],
  },
  {
    id: "contact",
    title: "Contact",
    fields: [
      { key: "eyebrow", label: "Eyebrow", type: "text", defaultValue: "Help" },
      {
        key: "title",
        label: "Title",
        type: "text",
        defaultValue: "Contact Us",
      },
      {
        key: "intro",
        label: "Introduction",
        type: "textarea",
        defaultValue:
          "For order queries, made-to-measure guidance, or press enquiries, write to us:",
      },
      {
        key: "email",
        label: "Email address",
        type: "text",
        defaultValue: "hello@naade.in",
      },
      {
        key: "phone",
        label: "Phone number",
        type: "text",
        defaultValue: "+91 8555909550",
      },
      {
        key: "studio",
        label: "Studio address",
        type: "text",
        defaultValue: "Pochampally, Telangana, India",
      },
      {
        key: "response",
        label: "Response time",
        type: "text",
        defaultValue: "Our team responds within one business day.",
      },
    ],
  },
  {
    id: "shipping",
    title: "Shipping",
    fields: [
      { key: "eyebrow", label: "Eyebrow", type: "text", defaultValue: "Help" },
      { key: "title", label: "Title", type: "text", defaultValue: "Shipping" },
      {
        key: "standard",
        label: "Standard orders",
        type: "textarea",
        defaultValue:
          "Standard size orders are dispatched within 3–5 business days across India.",
      },
      {
        key: "madeToMeasure",
        label: "Made-to-measure orders",
        type: "textarea",
        defaultValue:
          "Made-to-measure pieces are cut and tailored individually and typically ship within 2–3 weeks.",
      },
      {
        key: "complimentary",
        label: "Complimentary shipping",
        type: "textarea",
        defaultValue:
          "Complimentary shipping is available on all orders above ₹5,000.",
      },
    ],
  },
  {
    id: "returns",
    title: "Returns",
    fields: [
      { key: "eyebrow", label: "Eyebrow", type: "text", defaultValue: "Help" },
      { key: "title", label: "Title", type: "text", defaultValue: "Returns" },
      {
        key: "standard",
        label: "Standard size returns",
        type: "textarea",
        defaultValue:
          "Standard size pieces may be returned unworn, with tags attached, within 7 days of delivery.",
      },
      {
        key: "madeToMeasure",
        label: "Made-to-measure returns",
        type: "textarea",
        defaultValue:
          "Made-to-measure pieces are created specifically for you and are final sale, unless the garment arrives damaged or with a manufacturing defect.",
      },
      {
        key: "instructions",
        label: "Return instructions",
        type: "textarea",
        defaultValue:
          "To initiate a return, please contact our team with your order number.",
      },
    ],
  },
  {
    id: "size-guide",
    title: "Size Guide",
    fields: [
      { key: "eyebrow", label: "Eyebrow", type: "text", defaultValue: "Help" },
      {
        key: "title",
        label: "Title",
        type: "text",
        defaultValue: "Size Guide",
      },
      {
        key: "copy",
        label: "Description",
        type: "textarea",
        defaultValue:
          "All measurements are in inches. If you fall between sizes, or would prefer a personal fit, choose Made to Measure at checkout.",
      },
      {
        key: "sizeLabel",
        label: "Size column",
        type: "text",
        defaultValue: "Size",
      },
      {
        key: "chestLabel",
        label: "Chest column",
        type: "text",
        defaultValue: "Chest",
      },
      {
        key: "waistLabel",
        label: "Waist column",
        type: "text",
        defaultValue: "Waist",
      },
      {
        key: "shoulderLabel",
        label: "Shoulder column",
        type: "text",
        defaultValue: "Shoulder",
      },
      { key: "sChest", label: "S chest", type: "text", defaultValue: "38" },
      { key: "sWaist", label: "S waist", type: "text", defaultValue: "32" },
      {
        key: "sShoulder",
        label: "S shoulder",
        type: "text",
        defaultValue: "17.5",
      },
      { key: "mChest", label: "M chest", type: "text", defaultValue: "40" },
      { key: "mWaist", label: "M waist", type: "text", defaultValue: "34" },
      {
        key: "mShoulder",
        label: "M shoulder",
        type: "text",
        defaultValue: "18",
      },
      { key: "lChest", label: "L chest", type: "text", defaultValue: "42" },
      { key: "lWaist", label: "L waist", type: "text", defaultValue: "36" },
      {
        key: "lShoulder",
        label: "L shoulder",
        type: "text",
        defaultValue: "18.5",
      },
      { key: "xlChest", label: "XL chest", type: "text", defaultValue: "44" },
      { key: "xlWaist", label: "XL waist", type: "text", defaultValue: "38" },
      {
        key: "xlShoulder",
        label: "XL shoulder",
        type: "text",
        defaultValue: "19",
      },
      { key: "xxlChest", label: "XXL chest", type: "text", defaultValue: "46" },
      { key: "xxlWaist", label: "XXL waist", type: "text", defaultValue: "40" },
      {
        key: "xxlShoulder",
        label: "XXL shoulder",
        type: "text",
        defaultValue: "19.5",
      },
    ],
  },
] as const satisfies readonly {
  id: string;
  title: string;
  fields: readonly SiteContentField[];
}[];

export type SiteContentPageId = (typeof SITE_CONTENT_PAGES)[number]["id"];
export type SiteContentValues = Record<string, string>;

export const SITE_CONTENT_PAGE_IDS = SITE_CONTENT_PAGES.map(
  (page) => page.id,
) as [SiteContentPageId, ...SiteContentPageId[]];
