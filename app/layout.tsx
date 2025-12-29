import "./globals.css";

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
      <body>{children}</body>
    </html>
  );
}
