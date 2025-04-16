import type { Metadata } from "next";
import "@/app/globals.css";
import { Sidebar } from "@/app/_components/Admin_Sidebar";



export const metadata: Metadata = {
  title: "test-app",
  description: "Chapter8 nest.jsアプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
      className=""
      >
        <div className="mx-auto flex h-screen">
          <Sidebar />
          {children}
        </div>

      </body>
    </html>
  );
}
