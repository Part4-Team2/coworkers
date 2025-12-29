import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Coworkers",
  description: "팀 협업 관리 서비스",
};

export const metadata = {
  title: "Coworkers | 함께 만드는 투두리스트",
  description: "함께 만드는 투두리스트",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
