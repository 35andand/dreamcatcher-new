import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-dark-main text-dark-text-primary">
        {children}
      </body>
    </html>
  );
}
