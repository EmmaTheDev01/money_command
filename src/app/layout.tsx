import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Money Command — Personal AI CFO & Founder Financial OS",
  description: "Accounting isn't guessing. Financial truth has a ledger. Deterministic double-entry financial operating system with WhatsApp conversational capture and Canada-first tax intelligence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=null;try{t=localStorage.getItem("theme")}catch(e){}var d=t==="dark"||(t!=="light"&&matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.dataset.theme=d?"dark":"light"})()`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans selection:bg-amber-500 selection:text-black">
        {children}
      </body>
    </html>
  );
}
