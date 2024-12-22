
import "./globals.css";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>Post mate</title>
        <link rel="icon" href="/web.ico"/>
      </head>
      <body
     
      >
        {children}
      </body>
    </html>
  );
}
