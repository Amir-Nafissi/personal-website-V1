/**
 * Site content. Placeholder data — edit the values marked `TODO` with your
 * real details. Everything the sections render comes from here.
 */

/**
 * A labelled external link shown inside a detail overlay.
 */
export type DetailLink = { label: string; url: string };

/**
 * A gallery image. Either a bare path string, or an object that also carries a
 * short caption shown in the fullscreen lightbox. `""` renders an empty tile.
 */
export type GalleryImage = string | { src: string; caption?: string };

export const profile = {
  name: "Amirhossein Nafissi",
  title: "Software Engineering Student at UWaterloo",
  // TODO: edit social URLs
  github: "https://github.com/Amir-Nafissi",
  linkedin: "https://www.linkedin.com/in/amirhossein-nafissi", // TODO: confirm URL
  email: "amirnafissi700@gmail.com",
  // PDF served from public/.
  resume: "/amirhossein_nafissi_resume_2026.pdf",
};

export type Education = {
  institution: string;
  degree: string;
  detail: string;
  dates: string;
  // Optional rich detail shown in the click-to-open overlay.
  longDescription?: string;
  images?: GalleryImage[]; // array length = number of placeholder tiles; "" = empty tile
  links?: DetailLink[];
};

// TODO: edit education details
export const education: Education[] = [
  {
    institution: "University of Waterloo",
    degree: "BASc, Software Engineering",
    detail: "Coursework in systems, algorithms, and human–computer interaction.",
    dates: "2024 — 2029",
    // TODO: replace placeholder overlay content
    longDescription:
      "Placeholder description. Add details about your program here — relevant coursework, design teams, research, awards, or anything that tells the story behind this entry. This text appears in the overlay when the card is clicked.",
    images: [
      "/gallery/education/Dana_Porter_Library_2.jpg",
      "/gallery/education/orientation.jpg",
      "/gallery/education/University_of_Waterloo_logo.png",
    ],
    links: [
      { label: "Program page", url: "#" },
      { label: "Transcript", url: "#" },
    ],
  },
];

export type Work = {
  role: string;
  company: string;
  dates: string;
  description: string;
  // Optional rich detail shown in the click-to-open overlay.
  longDescription?: string;
  images?: GalleryImage[];
  links?: DetailLink[];
};

// TODO: edit work experience
export const work: Work[] = [
  {
    role: "Software Engineering Intern",
    company: "Company One",
    dates: "Summer 2025",
    description:
      "Built and shipped features across the stack, focusing on performance and clean, maintainable interfaces.",
    // TODO: replace placeholder overlay content
    longDescription:
      "Placeholder description. Describe your impact here — what you built, the technologies you used, the scale, and the outcomes. Add screenshots or diagrams to the gallery above. This appears in the overlay when the card is clicked.",
    images: ["/gallery/experience/work_1/IRC-Logo-Maple-Leaf-home-feat.png"],
    links: [{ label: "Company site", url: "#" }],
  },
  {
    role: "Developer",
    company: "Student Project / Club",
    dates: "2024 — Present",
    description:
      "Collaborated with a small team to design and deliver tools used by fellow students.",
    // TODO: replace placeholder overlay content
    longDescription:
      "Placeholder description. Talk about the team, your role, and what you shipped. Link out to the live tool or repo below, and drop in some screenshots above.",
    images: [
      "/gallery/experience/work_2/WatQ-group-photo.webp",
      "/gallery/experience/work_2/hawking_page_curve.png",
      "/gallery/experience/work_2/WATQ_logo_Q_ket_Color_pink_red.png",
    ],
    links: [
      { label: "Project site", url: "#" },
      { label: "Repository", url: "#" },
    ],
  },
];

export type Project = {
  title: string;
  description: string;
  repo?: string;
  live?: string;
  // Optional rich detail shown in the click-to-open overlay.
  longDescription?: string;
  images?: GalleryImage[];
  links?: DetailLink[];
};

// TODO: edit project descriptions and links — titles and images are wired up.
export const projects: Project[] = [
  {
    title: "Botty",
    description:
      "TODO: short one-line description shown on the project card.",
    repo: "https://github.com/Amir-Nafissi",
    live: "#",
    longDescription:
      "TODO: full description shown in the overlay — what it does, the problem it solves, the stack, and what you're proud of.",
    images: ["/gallery/projects/Botty/screenshot.png"],
    links: [{ label: "Repository", url: "#" }],
  },
  {
    title: "CueMate",
    description:
      "TODO: short one-line description shown on the project card.",
    repo: "https://github.com/Amir-Nafissi",
    live: "#",
    longDescription:
      "TODO: full description shown in the overlay — what it does, the problem it solves, the stack, and what you're proud of.",
    images: [
      "/gallery/projects/CueMate/cuemate_logo.jpg",
      "/gallery/projects/CueMate/cuemate_screenshot.jpg",
      "/gallery/projects/CueMate/echosense_screenshot.jpg",
    ],
    links: [{ label: "Repository", url: "#" }],
  },
  {
    title: "EchoSense",
    description:
      "TODO: short one-line description shown on the project card.",
    repo: "https://github.com/Amir-Nafissi",
    live: "#",
    longDescription:
      "TODO: full description shown in the overlay — what it does, the problem it solves, the stack, and what you're proud of.",
    images: [
      "/gallery/projects/EchoSense/echosense_logo.png",
      "/gallery/projects/EchoSense/echosense_full.jpg",
      "/gallery/projects/EchoSense/echosense_inside.jpg",
    ],
    links: [{ label: "Repository", url: "#" }],
  },
  {
    title: "Multiplayer Checkers",
    description:
      "TODO: short one-line description shown on the project card.",
    repo: "https://github.com/Amir-Nafissi",
    live: "#",
    longDescription:
      "TODO: full description shown in the overlay — what it does, the problem it solves, the stack, and what you're proud of.",
    images: [
      "/gallery/projects/multiplayer_checkers/multiplayer_checkers_screenshot.png",
    ],
    links: [{ label: "Repository", url: "#" }],
  },
  {
    title: "ScholarCompare",
    description:
      "TODO: short one-line description shown on the project card.",
    repo: "https://github.com/Amir-Nafissi",
    live: "#",
    longDescription:
      "TODO: full description shown in the overlay — what it does, the problem it solves, the stack, and what you're proud of.",
    images: ["/gallery/projects/ScholarCompare/scholar_compare_screenshot.jpg"],
    links: [{ label: "Repository", url: "#" }],
  },
];
