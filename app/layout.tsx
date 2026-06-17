import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import FontSizeControl from "@/components/FontSizeControl";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://amirnafissi.com"), // TODO: set to your deployed domain
  title: "Amirhossein Nafissi — Software Engineering",
  description:
    "Software Engineering student at the University of Waterloo. A journey from cosmic chaos to serene rebirth.",
  openGraph: {
    title: "Amirhossein Nafissi — Software Engineering",
    description:
      "Software Engineering student at the University of Waterloo. A journey from cosmic chaos to serene rebirth.",
    images: ["/poster.jpg"],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} antialiased`}
    >
      <body className="bg-black text-haze">
        {children}
        <FontSizeControl />
      </body>
    </html>
  );
}
