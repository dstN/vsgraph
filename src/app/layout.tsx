import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VSGraph – Verfassungsschutzbericht interaktiv",
  description:
    "Interaktives Dashboard zur Politisch motivierten Kriminalität (PMK) in Deutschland. Daten aus dem Verfassungsschutzbericht – verständlich aufbereitet.",
  keywords: [
    "Verfassungsschutzbericht",
    "PMK",
    "Politisch motivierte Kriminalität",
    "Extremismus",
    "Deutschland",
    "Dashboard",
  ],
  authors: [{ name: "VSGraph" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" suppressHydrationWarning>
      <head>
        {/* Blocking script: setzt data-theme vor dem ersten Paint */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("vsgraph-theme");if(t==="dark"||t==="light"){document.documentElement.setAttribute("data-theme",t)}else{var d=matchMedia("(prefers-color-scheme:dark)").matches;document.documentElement.setAttribute("data-theme",d?"dark":"light")}}catch(e){document.documentElement.setAttribute("data-theme","light")}})()`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
