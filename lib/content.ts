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
    degree: "Bachelor of Software Engineering (BSE)",
    detail: "Coursework in systems, algorithms, and human–computer interaction.",
    dates: "2025 — 2030",
    // TODO: replace placeholder overlay content
    longDescription:
      "I am currently pursuing a Bachelor's degree in Software Engineering at the University of Waterloo. While the program is rigorous, I am deeply engaged in my coursework and thoroughly enjoying the technical challenges it presents.",
    images: [
      {src: "/gallery/education/Dana_Porter_Library_2.jpg", caption: "The iconic Dana Porter Library at the University of Waterloo. It is my go-to study spot on campus, and I've grown to really appreciate its unique brutalist architecture. Source: https://commons.wikimedia.org/wiki/File:Dana_Porter_Library_2.jpg"},
      {src: "/gallery/education/orientation.jpg", caption: "This is a photo of me taken at the end of orientation after receiving my pink tie. Since Software Engineering at Waterloo is jointly offered by the Faculties of Engineering and Mathematics, students receive both the traditional engineering hard hat and the math faculty's pink tie."},
      {src: "/gallery/education/University_of_Waterloo_logo.png", caption: "The official emblem of the University of Waterloo."}
  ],
    links: [
      { label: "Program page", url: "https://uwaterloo.ca/future-students/programs/software-engineering" },
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
    role: "TechOps Developer",
    company: "Instant Risk Coverage",
    dates: "Spring 2026",
    description:
      "Maintaining and shipping features across the stack",
    // TODO: replace placeholder overlay content
    longDescription:
      "I am currently working as a Technology Operations Intern at Instant Risk Coverage (IRC) for my Spring 2026 co-op term. It has been a highly rewarding experience where I am expanding my technical skill set and contributing to impactful projects.",
    images: [{src: "/gallery/experience/work_1/IRC-Logo-Maple-Leaf-home-feat.png", caption: "Company Logo"}],
    links: [{ label: "Company site", url: "https://instantriskcoverage.com/" }],
  },
  {
    role: "Founding Member and Software Developer",
    company: "WatQ",
    dates: "2025 — Present",
    description:
      "A founding member of the first undergard quantum design team at UWaterloo",
    // TODO: replace placeholder overlay content
    longDescription:
      "WatQ is a student-run Quantum Design Team at the University of Waterloo focused on bridging the gap between quantum research and practical application. As a multidisciplinary team, we design, model, and prototype quantum technology across our software and hardware subteams. As a member of the software subteam, I use IBM's Qiskit to simulate quantum phenomena and quantum computing algorithms.",
    images: [
      {src: "/gallery/experience/work_2/WatQ-group-photo.webp", caption: "The WatQ team inside the Mike & Ophelia Lazaridis Quantum-Nano Centre at the University of Waterloo."},
      {src: "/gallery/experience/work_2/hawking_page_curve.png", caption: "Results from our Hawking Radiation Simulation project using Qiskit (available in our repository). This graph displays the Page Curve for a simulated 12-qubit black hole, plotting radiation entropy against the number of emitted qubits. It compares our computer simulation (blue line) to the theoretical prediction (red dashed line). Both curves peak at the \"Page time\" before decreasing, illustrating the preservation of information during black hole evaporation."},
      {src: "/gallery/experience/work_2/WATQ_logo_Q_ket_Color_pink_red.png", caption: "The official WatQ design team logo."}
    ],
    links: [
      { label: "Design Team site", url: "https://watq.vercel.app/" },
      { label: "Repository", url: "https://github.com/UW-WatQ" },
    ],
  },
  {
    role: "Machine Learning Internship",
    company: "University of Waterloo",
    dates: "Spring 2023",
    description: "Helping with data collection for a machine learning model",
    longDescription:
      "During high school, I completed a data collection internship at the University of Waterloo, working with a research group to compile a sensitive security dataset used for training robust machine learning models. The most valuable takeaway was gaining hands-on experience building machine learning models using various Python libraries such as pandas, Matplotlib, and scikit-learn which laid the groundwork for my personal projects. I also learned a few useful machine learning concepts. \n Note: Due to the confidential nature of this project, no images are available.",
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
    title: "Botto",
    description:
      "An autonomous quadruped robot (in the making)",
    repo: "https://github.com/Amir-Nafissi/Botto",
    // live: "#",
    longDescription:
      "Botto is a work-in-progress project aimed at teaching me autonomous robotics. The goal is to build a fully autonomous, pet-like quadruped robot. To maximize my focus on the software and AI aspects, I am utilizing Dorian Todd's open-source mechanical design for the robot's physical body, allowing me to concentrate on developing its autonomous behaviors and control systems.",
    images: [{src: "/gallery/projects/Botty/screenshot.png", caption: "A screenshot from Dorian Todd's video showing his open-source robot. Youtube link: https://youtu.be/1UDsWkcQZhc?si=YT1TDwSpA3XguifE"}],
    // links: [{ label: "Repository", url: "" }],
  },
  {
    title: "CueMate",
    description:
      "An Android app that voices facial expressions and gestures for blind users",
    repo: "https://github.com/Amir-Nafissi/CueMate",
    // live: "#",
    longDescription:
      "CueMate is an Android assistive app that helps blind and visually impaired users read the non-verbal cues happening around them. Using the phone's camera, it detects facial expressions and hand gestures in real time with Google's MediaPipe, then relays them through spoken announcements and vibration patterns. Everything runs fully on-device with zero cloud dependency, and the Jetpack Compose interface is TalkBack-compliant. I built it in Kotlin to turn invisible social cues into confident, independent interactions.",
    images: [
      {src: "/gallery/projects/CueMate/cuemate_logo.jpg", caption: "CueMate's Logo"},
      {src: "/gallery/projects/CueMate/cuemate_screenshot.jpg", caption: "A screenshot of the Android application running."},
      {src: "/gallery/projects/CueMate/echosense_screenshot.jpg", caption: "A picture of CueMate's ancestor, EvoSense, showing the underlying MediaPipe model."}
    ],
    links: [{ label: "Devpost", url: "https://devpost.com/software/cuemate" }],
  },
  {
    title: "EchoSense",
    description:
      "A smart cane that warns blind users of head- and foot-level obstacles",
    repo: "https://github.com/Amir-Nafissi/EchoSense-Pi",
    //live: "#",
    longDescription:
      "EchoSense is a smart cane built to cover the blind spots of a traditional white cane, which often misses obstacles above knee level and leaves users exposed to head and upper-body collisions. Running on a Raspberry Pi 4 with dual ultrasonic sensors, it detects obstacles at both head and foot level in real time and gives audio alerts as they approach. This was a hands-on lesson in hardware integration and building accessibility tech with potential social impact.",
    images: [
      {src: "/gallery/projects/EchoSense/echosense_logo.png", caption: "EchoSense's Logo"},
      {src: "/gallery/projects/EchoSense/echosense_full.jpg", caption: "The full white cane from above (keep in mind this was built during a hackathon, hence why it's a rough prototype)"},
      {src: "/gallery/projects/EchoSense/echosense_inside.jpg", caption: "A picture showing the internal wiring of EchoSense"}
    ],
    links: [{ label: "Devpost", url: "https://devpost.com/software/echosense-elti96" }],
  },
  {
    title: "Multiplayer Checkers",
    description:
      "A real-time, server-authoritative multiplayer checkers desktop app",
    repo: "https://github.com/Amir-Nafissi/multiplayer-checkers",
    // live: "#",
    longDescription:
      "Multiplayer Checkers is a real-time, cross-platform checkers game for Windows and Linux. The desktop client is built with Flutter, and a FastAPI (Python) backend serves matches over WebSockets. The server is authoritative — it validates every move and strictly enforces standard 8x8 checkers rules — and a FIFO auto-pairing queue matches players instantly with no lobby. I focused on correctness, clarity, and cross-platform reliability, shipping native Windows executables and a Linux Flatpak.",
    images: [
      {src: "/gallery/projects/multiplayer_checkers/multiplayer_checkers_screenshot.png", caption: "A screenshot of the game running and the underlying user interface"}
    ],
    // links: [{ label: "Repository", url: "#" }],
  },
  {
    title: "ScholarCompare",
    description:
      "An AI grading tool that semantically compares student answers to a model answer",
    repo: "https://github.com/Amir-Nafissi/Scholarly-Compare",
    // live: "#",
    longDescription:
      "Scholarly-Compare is an AI-powered grading platform that helps educators evaluate student answers in seconds. Instead of keyword matching, it uses Google's Gemini API to semantically compare each response against a model answer, surfacing conceptual gaps and knowledge strengths with personalized feedback. Educators can batch-process a whole class via CSV upload and revisit or export past evaluations to track progress. I built the front end with React, TypeScript, and Tailwind CSS, backed by a Python/Flask REST API and MongoDB.",
    images: [{src: "/gallery/projects/ScholarCompare/scholar_compare_screenshot.jpg", caption: "A screenshot of the webapp running and the underlying user interface"}],
    links: [{ label: "Repository", url: "https://devpost.com/software/scholar-compare" }],
  },
];
