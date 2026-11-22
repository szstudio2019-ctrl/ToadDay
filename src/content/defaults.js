// Default site content. Every section here can be overridden from the admin
// panel (/admin): the saved copy in Supabase (table site_sections, one row per
// key) is merged over these values, so the site still works if the database
// is empty or unreachable.

export const DEFAULT_CONTENT = {
  hero: {
    hidden: false,
    badge: "Observed annually · May 15",
    title: "International Toad Day",
    subtitle: "A global day dedicated to toads, their ecological importance and the protection of their habitats.",
    video: "/toad_hiro.mp4",
    primaryBtn: "Discover International Toad Day",
    instagramBtn: "Follow us on Instagram",
    instagramUrl: "https://www.instagram.com/internationaltoadday/",
  },

  story: {
    hidden: false,
    tag: "Our Story",
    title: "From an Israeli initiative to a growing international day",
    p1: "International Toad Day was founded in Israel in 2026 by Avi Zobel and Reptiles of Israel. It was created to challenge old myths, give toads the recognition they deserve, and encourage education, research, and habitat conservation around the world.",
    p2: "The first International Toad Day was observed on May 15, 2026. During its inaugural year, it gained recognition from educational and natural-history institutions in Israel and was marked by nature, wildlife, and educational communities in several countries — laying the foundation for a new annual global tradition.",
    image: "https://i.imgur.com/CBCh5f7.jpeg",
    video: "/toad-development-clip.mp4",
    quote: "\"The initiative for International Toad Day was born to shatter old myths and give toads everywhere the respect they deserve as a critical link in the food chain — both in the wild and in our home gardens.\"",
    quoteAuthor: "— Avi Zobel, Founder",
    linkText: "Check out the project ↗",
    linkUrl: "https://www.israelreptiles.co.il/",
  },

  whyDay: {
    hidden: false,
    title: "Why does the toad need its own day?",
    p1: "For years, toads have lived in the shadow of their better-known relatives. Toads belong to the order Anura — the same diverse group that includes all frogs — but many true toads, members of the family Bufonidae, have evolved distinctive adaptations to life on land.",
    p2: "Many toads have relatively thick skin, prominent toxin-producing glands and adaptations that allow them to spend much of their adult lives away from water, returning to aquatic habitats mainly to breed. These traits have enabled toads to thrive in a remarkable variety of terrestrial environments.",
    p3: "Toads deserve to be recognized in their own right. They are fascinating, resilient animals and important members of their ecosystems. They consume large numbers of insects and other invertebrates and, in turn, form part of the food web. Yet toad species around the world face growing pressures from habitat loss, climate change, disease and pollution.",
    video: "/magnific_a-green-spotted-toad-jump_4R3pqGy9Aa.mp4",
  },

  surprisingFact: {
    hidden: false,
    tag: "A Surprising Fact",
    title: "Israel has only one true toad species",
    p1: "Israel has only one true toad species: the Green Toad (*Bufotes viridis*). Although it is sometimes confused with other amphibians, it is the country's only representative of the true toad family, Bufonidae.",
    p2: "Protecting Israel's toads therefore means protecting an entire, unique species and an irreplaceable part of the local ecosystem.",
  },

  facts: {
    hidden: false,
    tag: "Must-Know Facts",
    title: "Facts You Need to Know About the Toad",
    subtitle: "Turns out they're so much more than we thought. Meet the superhero of the garden.",
    video: "/cycle-video.mp4",
    items: [
      { title: "They Still Need Protection", text: "Wetland loss, pesticide use, pollution, roads, disease and climate change threaten amphibian populations worldwide." },
      { title: "They Do Not Cause Warts", text: "The bumpy texture of a toad's skin is part of its natural anatomy. The old claim that touching a toad causes human warts is a myth." },
      { title: "Natural Pest Controllers", text: "Toads feed on insects and other invertebrates and can be valuable neighbors in gardens and agricultural landscapes." },
      { title: "Remarkable Resilience", text: "Many toads can use terrestrial habitats and tolerate drier conditions better than many other amphibians." },
      { title: "Night Hunter", text: "A single toad can eat hundreds of insects in one night — mosquitoes, cockroaches and harmful larvae." },
      { title: "Loyal to Its Home", text: "Toads tend to return to the same hiding spots night after night, year after year." },
    ],
  },

  toadOrFrog: {
    hidden: false,
    tag: "Know the Difference",
    title: "Toad or Frog?",
    video: "/Frog_Toad2.mp4",
    pairs: [
      { label: "Skin", toad: "Drier-looking, thicker\nand bumpier skin", frog: "Smoother,\nmoist-looking skin" },
      { label: "Habitat", toad: "Often spends more time on land\nand returns to water to breed", frog: "Often remains close\nto water" },
      { label: "Movement", toad: "Walking and shorter,\nsturdy hops", frog: "Longer\nleaps" },
      { label: "Legs", toad: "Often shorter,\nstronger legs", frog: "Often longer\nhind legs" },
      { label: "Defense", toad: "Deterrent secretions from skin\nand parotoid glands", frog: "Rapid escape, frequently\ntoward water" },
    ],
    note: "These are useful general tendencies, not strict scientific rules. \"Frog\" and \"toad\" are common names within the same order.",
    linkText: "Explore the complete Israel amphibian guide",
    linkUrl: "https://www.israelreptiles.co.il/%d7%9e%d7%92%d7%93%d7%99%d7%a8-%d7%93%d7%95-%d7%97%d7%99%d7%99%d7%9d/",
  },

  vote: {
    hidden: false,
    title: "Together We'll Make History!",
    label: "voters",
    button: "I'm Voting for the Toad",
    thanks: "Thanks for voting! 👍",
    video: "/magnific_a-green-spotted-toad-jump_4R3pqGy9Aa.mp4",
  },

  partners: {
    hidden: false,
    title: "2027 Participating & Supporting Organizations",
    text: "Organizations around the world supporting and participating in International Toad Day – 15 May 2027.",
    items: [
      { name: "Anura Africa", href: "https://www.anuraafrica.org/", logo: "/partners/anuraafrica.png" },
      { name: "San Francisco Zoo & Gardens", href: "https://www.sfzoo.org/", logo: "/partners/sfzoo-logo.jpeg" },
      { name: "Amphibian Foundation", href: "https://amphibianfoundation.org/", logo: "/partners/amphibianfoundation-logo.jpeg" },
      // Josh's Frogs: leaf icon + separate black wordmark.
      { name: "Josh's Frogs", href: "https://joshsfrogs.com/", logo: "", icon: "/partners/joshsfrogs-icon.jpg", wordmark: "/partners/joshsfrogs-name.svg" },
      { name: "Midbarium", href: "https://midbarium.co.il/", logo: "/partners/midbarium-logo.png" },
    ],
  },

  recognition: {
    hidden: false,
    tag: "Recognition",
    title: "Recognition & Participation",
    cards: [
      {
        title: "Institutional\nRecognition",
        text: "",
        items: [
          { text: "Israel Ministry of Education – Green Dates Calendar", href: "https://pop.education.gov.il/sustainability-education/green-calendar/may/#pos_533770" },
          { text: "The National Natural History Collections, The Hebrew University of Jerusalem", href: "https://nnhc.huji.ac.il/news/%D7%99%D7%95%D7%9D-%D7%94%D7%A7%D7%A8%D7%A4%D7%93%D7%94-%D7%94%D7%91%D7%99%D7%A0%D7%9C%D7%90%D7%95%D7%9E%D7%99-15-%D7%91%D7%9E%D7%90%D7%99" },
        ],
      },
      {
        title: "Organizations That Marked International Toad Day in 2026",
        text: "",
        items: [
          { text: "DGHT – German Society for Herpetology and Herpetoculture, Germany", href: "" },
          { text: "Fota Wildlife Park, Ireland", href: "" },
          { text: "Kamloops Naturalist Club, Canada", href: "" },
          { text: "The Steinhardt Museum of Natural History, Israel", href: "" },
        ],
      },
      {
        title: "Did Your Organization Take Part in 2026?",
        text: "If your organization marked International Toad Day in 2026, we would be happy to hear from you.",
        items: [{ text: "Contact us to be included in the official list of participating organizations.", href: "" }],
      },
      {
        title: "International\nListings",
        text: "International Toad Day is also included in environmental and international awareness-day listings:",
        items: [
          { text: "Wikipedia – List of Environmental Dates", href: "https://en.wikipedia.org/wiki/List_of_environmental_dates" },
          { text: "Hebrew Wikipedia – List of Environmental Dates", href: "https://he.wikipedia.org/wiki/%D7%9E%D7%95%D7%A2%D7%93%D7%99%D7%9D_%D7%91%D7%99%D7%9F-%D7%9C%D7%90%D7%95%D7%9E%D7%99%D7%99%D7%9D" },
        ],
      },
    ],
  },

  media: {
    hidden: false,
    title: "In the Media",
    articles: [
      {
        title: "International Toad Day featured in AmphiBios",
        text: "The story behind International Toad Day has been published in AmphiBios, the magazine of the Amphibian Survival Alliance. Founder Avi Zobel shares how the initiative began in Israel, what was achieved in its first year, the challenges along the way, and lessons for growing the campaign internationally.",
        subtitle: "Building International Toad Day from Nothing",
        image: "/hero-1200.webp",
        linkText: "Read the article on AmphiBios →",
        url: "https://amphibios.app/articles/building-international-toad-day",
      },
    ],
  },

  socialVideos: {
    hidden: false,
    tag: "Share the Toad",
    title: "Videos for Social Media",
    text: "Watch our story videos and follow us on Instagram to help spread the word about International Toad Day.",
    videos: [
      { title: "Meet the Toad — Story", note: "9:16 · 32 seconds · with music", src: "/social/toad-story.mp4", poster: "/social/toad-story-poster.jpg", url: "", linkText: "View on Instagram" },
    ],
  },

  kids: {
    hidden: false,
    tag: "For Children and Educators",
    title: "Kids' Creative Activities",
    text: "Download, print and use these activities to introduce children to toads and their habitats.",
    slides: [
      { img: "https://i.imgur.com/GNDyrR4.png", alt: "Original Hebrew toad coloring activity page", file: "/toad-day-coloring-page-hebrew.pdf", title: "Original Activity Page", text: "The original printable creative activity prepared for the first International Toad Day.", zoom: 2.1 },
      { img: "/coloring-page-en.png", alt: "English toad coloring page", file: "/international-toad-day-coloring-page.pdf", title: "English Coloring Page", text: "A new English printable featuring a toad\nin its natural habitat.", zoom: 1.4 },
    ],
  },

  footer: {
    siteName: "International Toad Day",
    instagramUrl: "https://www.instagram.com/internationaltoadday/",
    email: "zisraelreptiles@gmail.com",
    websiteUrl: "https://www.israelreptiles.co.il",
    websiteLabel: "www.israelreptiles.co.il",
    facebookUrl: "https://www.facebook.com/reptilesofisrael",
    copyright: "© israelreptiles. All rights reserved.",
    background: "/bg_FOOTER2.jpg",
  },
};

export const SECTION_KEYS = Object.keys(DEFAULT_CONTENT);

// Saved data is merged one level deep over the defaults, so a field added to
// the defaults later still shows up for sections that were saved before it.
export function mergeContent(rows) {
  const out = {};
  for (const key of SECTION_KEYS) out[key] = { ...DEFAULT_CONTENT[key], ...(rows?.[key] || {}) };
  return out;
}
