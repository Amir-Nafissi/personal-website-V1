/**
 * Site content. Placeholder data — edit the values marked `TODO` with your
 * real details. Everything the sections render comes from here.
 */

export const profile = {
  name: "Amirhossein Nafissi",
  title: "Software Engineering Student at UWaterloo",
  // TODO: edit social URLs
  github: "https://github.com/Amir-Nafissi",
  linkedin: "https://www.linkedin.com/in/amirhossein-nafissi", // TODO: confirm URL
  email: "amirnafissi700@gmail.com",
};

export type Education = {
  institution: string;
  degree: string;
  detail: string;
  dates: string;
};

// TODO: edit education details
export const education: Education[] = [
  {
    institution: "University of Waterloo",
    degree: "BASc, Software Engineering",
    detail: "Coursework in systems, algorithms, and human–computer interaction.",
    dates: "2024 — 2029",
  },
];

export type Work = {
  role: string;
  company: string;
  dates: string;
  description: string;
};

// TODO: edit work experience
export const work: Work[] = [
  {
    role: "Software Engineering Intern",
    company: "Company One",
    dates: "Summer 2025",
    description:
      "Built and shipped features across the stack, focusing on performance and clean, maintainable interfaces.",
  },
  {
    role: "Developer",
    company: "Student Project / Club",
    dates: "2024 — Present",
    description:
      "Collaborated with a small team to design and deliver tools used by fellow students.",
  },
];

export type Project = {
  title: string;
  description: string;
  repo?: string;
  live?: string;
};

// TODO: edit projects
export const projects: Project[] = [
  {
    title: "Project Nebula",
    description:
      "A real-time visualization tool that turns dense datasets into something explorable and calm.",
    repo: "https://github.com/Amir-Nafissi",
    live: "#",
  },
  {
    title: "Wormhole CLI",
    description:
      "A small, fast command-line utility for moving files between machines with zero config.",
    repo: "https://github.com/Amir-Nafissi",
  },
  {
    title: "Meadow",
    description:
      "An ambient focus app that pairs generative soundscapes with a minimal, distraction-free timer.",
    repo: "https://github.com/Amir-Nafissi",
    live: "#",
  },
  {
    title: "Event Horizon",
    description:
      "An experiment in scroll-driven storytelling — the technique powering this very site.",
    repo: "https://github.com/Amir-Nafissi",
  },
];
