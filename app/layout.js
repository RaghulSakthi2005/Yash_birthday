import "./globals.css";
import DevicePopup from "@/components/DevicePopup";

export const metadata = {
  title: "✦ For your eyes only",
  description: "Something made just for you.",
};

import LenisProvider from "@/components/LenisProvider";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,600&family=Instrument+Serif:ital@0;1&family=Barlow:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <LenisProvider>
          <DevicePopup />
          {children}
        </LenisProvider>
      </body>
    </html>
  );
}
