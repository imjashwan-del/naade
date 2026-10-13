export type SiteContentField = {
  key: string;
  label: string;
  type: "text" | "textarea" | "image";
  defaultValue: string;
};

export const SITE_CONTENT_PAGES = [
  {
    id: "global",
    title: "Header & Footer",
    fields: [
      {
        key: "brand",
        label: "Brand name",
        type: "text",
        defaultValue: "NAADE",
      },
      {
        key: "announcementEnabled",
        label: "Show announcement bar (true/false)",
        type: "text",
        defaultValue: "true",
      },
      {
        key: "announcementText",
        label: "Announcement text",
        type: "text",
        defaultValue:
          "Handwoven Pochampally Ikat • Complimentary Shipping in India • Bespoke Sizing Available",
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
        key: "navMadeToMeasure",
        label: "Made to Measure navigation",
        type: "text",
        defaultValue: "Made to Measure",
      },
      {
        key: "navStory",
        label: "Our Story navigation",
        type: "text",
        defaultValue: "Our Story",
      },
      {
        key: "navFaq",
        label: "FAQ navigation",
        type: "text",
        defaultValue: "FAQ",
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
        key: "contactPhone",
        label: "Contact phone",
        type: "text",
        defaultValue: "+91 8555909550",
      },
      {
        key: "contactEmail",
        label: "Contact email",
        type: "text",
        defaultValue: "hello@naade.in",
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
        defaultValue: "POCHAMPALLY IKAT • TELANGANA",
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
        key: "trustTitle",
        label: "Trust section title",
        type: "text",
        defaultValue: "Crafted With Intention",
      },
      {
        key: "trust1Title",
        label: "Trust item 1 title",
        type: "text",
        defaultValue: "Pochampally GI Cluster",
      },
      {
        key: "trust1Copy",
        label: "Trust item 1 copy",
        type: "text",
        defaultValue: "Handwoven in Telangana with authentic resist-dyed yarns.",
      },
      {
        key: "trust2Title",
        label: "Trust item 2 title",
        type: "text",
        defaultValue: "Bespoke Measurements",
      },
      {
        key: "trust2Copy",
        label: "Trust item 2 copy",
        type: "text",
        defaultValue: "Custom tailored from individual cloth lengths at no extra cost.",
      },
      {
        key: "trust3Title",
        label: "Trust item 3 title",
        type: "text",
        defaultValue: "100% Handloom Cottons",
      },
      {
        key: "trust3Copy",
        label: "Trust item 3 copy",
        type: "text",
        defaultValue: "Breathable natural fibers woven on traditional pit looms.",
      },
      {
        key: "trust4Title",
        label: "Trust item 4 title",
        type: "text",
        defaultValue: "Direct Studio Model",
      },
      {
        key: "trust4Copy",
        label: "Trust item 4 copy",
        type: "text",
        defaultValue: "Connected directly to master artisans and weaving families.",
      },
      {
        key: "featuredEyebrow",
        label: "Collection eyebrow",
        type: "text",
        defaultValue: "The Edit",
      },
      {
        key: "featuredTitle",
        label: "Collection title",
        type: "text",
        defaultValue: "Featured Pieces",
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
        defaultValue: "Craft & Geometry",
      },
      {
        key: "weaveTitle",
        label: "Weave title",
        type: "text",
        defaultValue: "The Architecture of Ikat",
      },
      {
        key: "weaveCopy",
        label: "Weave description",
        type: "textarea",
        defaultValue:
          "Pochampally Ikat is created by resist-dyeing yarns before weaving, allowing the pattern to emerge through the structure of the cloth itself. The calculated geometry requires weeks of mathematical tying and precision handloom weaving.",
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
        defaultValue: "Personal Fit",
      },
      {
        key: "measureTitle",
        label: "Made-to-measure title",
        type: "textarea",
        defaultValue: "Your Fit.\nYour NAADE.",
      },
      {
        key: "measureCopy",
        label: "Made-to-measure description",
        type: "textarea",
        defaultValue:
          "Selected NAADE pieces can be cut to your individual measurements. We believe handwoven clothing should fit with quiet confidence.",
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
    id: "story",
    title: "Our Story",
    fields: [
      {
        key: "eyebrow",
        label: "Eyebrow",
        type: "text",
        defaultValue: "Heritage & Craft",
      },
      {
        key: "title",
        label: "Title",
        type: "text",
        defaultValue: "Rooted in Pochampally",
      },
      {
        key: "subtitle",
        label: "Subtitle",
        type: "textarea",
        defaultValue:
          "The intersection of ancient mathematical resist-dyeing and contemporary Indian menswear.",
      },
      {
        key: "image",
        label: "Story image",
        type: "image",
        defaultValue: "/images/weave-texture.jpg",
      },
      {
        key: "imageAlt",
        label: "Story image description",
        type: "text",
        defaultValue: "Handloom pit loom yarns in Pochampally",
      },
      {
        key: "p1",
        label: "Story paragraph 1",
        type: "textarea",
        defaultValue:
          "In Pochampally, Telangana, cloth is not simply woven; it is calculated, tie-dyed in bundles, and aligned down to the millimeter before a single shuttle moves across the loom. This intricate process gives Ikat its signature softened edges and distinctive structural depth.",
      },
      {
        key: "p2",
        label: "Story paragraph 2",
        type: "textarea",
        defaultValue:
          "NAADE was founded to translate this extraordinary GI-tagged handloom craft into modern, wearable silhouettes. Rather than treating Ikat as costume fabric or occasion-only attire, we build structured jackets, relaxed shirts, and tailored layers that belong in the modern wardrobe.",
      },
      {
        key: "p3",
        label: "Story paragraph 3",
        type: "textarea",
        defaultValue:
          "Every garment begins in family-owned pit loom studios across Telangana. By working directly with master dyers and weavers, NAADE honors the craftsmanship, ensures honest livelihoods, and keeps the tactile spirit of Indian handlooms alive.",
      },
      {
        key: "quote",
        label: "Featured quote",
        type: "textarea",
        defaultValue:
          "The beauty of handwoven Ikat lies in its slight human irregularities — proof that every thread was placed by deliberate human touch.",
      },
    ],
  },
  {
    id: "faq",
    title: "FAQ",
    fields: [
      {
        key: "eyebrow",
        label: "Eyebrow",
        type: "text",
        defaultValue: "Customer Care",
      },
      {
        key: "title",
        label: "Title",
        type: "text",
        defaultValue: "Frequently Asked Questions",
      },
      {
        key: "subtitle",
        label: "Subtitle",
        type: "textarea",
        defaultValue:
          "Clear answers regarding our handloom craft, bespoke sizing, ordering process, and shipping.",
      },
      {
        key: "q1",
        label: "Question 1",
        type: "text",
        defaultValue: "What makes Pochampally Ikat handloom unique?",
      },
      {
        key: "a1",
        label: "Answer 1",
        type: "textarea",
        defaultValue:
          "Pochampally Ikat is an authentic Geographical Indication (GI) textile from Telangana. Unlike machine-printed patterns, the designs are created by resist-dyeing warp and weft yarn bundles with mathematical precision prior to weaving. When woven on traditional pit looms, the pattern manifests directly from the weave itself.",
      },
      {
        key: "q2",
        label: "Question 2",
        type: "text",
        defaultValue: "How does the Made-to-Measure service work?",
      },
      {
        key: "a2",
        label: "Answer 2",
        type: "textarea",
        defaultValue:
          "Selected pieces can be tailored to your exact measurements at no extra fee. On eligible product pages, select 'Make It To My Measurements' and submit your chest, waist, shoulder, sleeve length, garment length, and neck in inches. Our Pochampally atelier cuts and finishes your garment individually.",
      },
      {
        key: "q3",
        label: "Question 3",
        type: "text",
        defaultValue: "What are your shipping timelines across India?",
      },
      {
        key: "a3",
        label: "Answer 3",
        type: "textarea",
        defaultValue:
          "Standard-size garments are dispatched within 3–5 business days. Made-to-measure pieces are tailored from scratch and dispatch within 2–3 weeks. We offer complimentary shipping across India on all orders.",
      },
      {
        key: "q4",
        label: "Question 4",
        type: "text",
        defaultValue: "How do I place an order via WhatsApp & UPI?",
      },
      {
        key: "a4",
        label: "Answer 4",
        type: "textarea",
        defaultValue:
          "At checkout, complete your shipping address and select 'WhatsApp UPI Order'. You will be redirected to WhatsApp with your official NAADE Order ID prefilled. Our team will verify your items and share the payment QR code. Once paid, share the transaction screenshot to confirm your order.",
      },
      {
        key: "q5",
        label: "Question 5",
        type: "text",
        defaultValue: "How do I care for my NAADE Ikat pieces?",
      },
      {
        key: "a5",
        label: "Answer 5",
        type: "textarea",
        defaultValue:
          "We recommend professional dry cleaning for structured jackets and silk-blend pieces to maintain the weave's integrity. Pure cotton shirts can be hand-washed separately in cold water with mild detergent, dried in the shade, and pressed on the reverse side with a warm iron.",
      },
      {
        key: "q6",
        label: "Question 6",
        type: "text",
        defaultValue: "What is your return and exchange policy?",
      },
      {
        key: "a6",
        label: "Answer 6",
        type: "textarea",
        defaultValue:
          "Standard size pieces in unworn condition with original tags can be returned within 7 days of delivery. Because made-to-measure pieces are cut specifically to your personal proportions, they are final sale unless damaged during transit or defective.",
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
] as const;

export type SiteContentPageId = (typeof SITE_CONTENT_PAGES)[number]["id"];
export type SiteContentValues = Record<string, string>;

export const SITE_CONTENT_PAGE_IDS = SITE_CONTENT_PAGES.map(
  (page) => page.id,
) as [SiteContentPageId, ...SiteContentPageId[]];
