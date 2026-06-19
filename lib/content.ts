/**
 * Site content. Placeholder data — edit the values marked `TODO` with your
 * real details. Everything the sections render comes from here.
 */

/**
 * A labelled external link shown inside a detail overlay.
 */
export type DetailLink = { label: string; url: string };

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
  images?: string[]; // array length = number of placeholder tiles; "" = empty tile
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
    images: ["", "", ""],
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
  images?: string[];
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
    images: ["", "", ""],
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
    images: ["", ""],
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
  images?: string[];
  links?: DetailLink[];
};

// TODO: edit projects
export const projects: Project[] = [
  {
    title: "Project Nebula",
    description:
      "A real-time visualization tool that turns dense datasets into something explorable and calm.",
    repo: "https://github.com/Amir-Nafissi",
    live: "#",
    longDescription:
      "Placeholder description. Explain what this project does, the problem it solves, the stack you used, and anything you're proud of. Add real screenshots to the gallery above and extra links below.",
    images: ["", "", ""],
    links: [{ label: "Documentation", url: "#" }],
  },
  {
    title: "Wormhole CLI",
    description:
      "A small, fast command-line utility for moving files between machines with zero config.",
    repo: "https://github.com/Amir-Nafissi",
    longDescription:
      "Placeholder description. Describe the design goals, the commands it exposes, and how it works under the hood. Drop in terminal recordings or screenshots above.",
    images: ["", ""],
    links: [{ label: "Install guide", url: "#" }],
  },
  {
    title: "Meadow",
    description:
      "An ambient focus app that pairs generative soundscapes with a minimal, distraction-free timer.",
    repo: "https://github.com/Amir-Nafissi",
    live: "#",
    longDescription:
      "Placeholder description. Walk through the experience, the audio engine, and the design decisions behind the minimal UI. Showcase the interface in the gallery above.",
    images: ["", "", ""],
    links: [{ label: "Case study", url: "#" }],
  },
  {
    title: "Event Horizon",
    description:
      "An experiment in scroll-driven storytelling — the technique powering this very site.",
    repo: "https://github.com/Amir-Nafissi",
    longDescription:
      "Placeholder description. Explain the scroll-driven technique, the performance work behind smooth scrubbing, and what you learned. Add stills from the sequence above.",
    images: ["", "", ""],
    links: [{ label: "Write-up", url: "#" }],
  },
];
