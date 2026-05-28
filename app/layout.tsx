import "./globals.css";

export const metadata = {
  title: "Princess Mae Sanchez",
  description: "Computer Engineering Student · Full-Stack Developer",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}