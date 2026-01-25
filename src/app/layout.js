import { Comfortaa, Nunito, Ubuntu } from "next/font/google";
import "./globals.css";

const comfortaa = Comfortaa({
  variable: "--font-comfortaa",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900", "1000"],
  style: ["normal", "italic"],
  display: "swap",
});

const ubuntu = Ubuntu({
  variable: "--font-ubuntu",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata = {
  title: "Salon Management System",
  description: "Professional salon management solution",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${comfortaa.variable} ${nunito.variable} ${ubuntu.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
