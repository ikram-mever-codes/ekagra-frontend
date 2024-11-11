import { Inter } from "next/font/google";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import Script from "next/script";

import ThemesProviders from "./ThemesProviders";
import LayoutProvider from "./LayoutProvider";
import { ToastContainer } from "react-toastify";
import { ContextProvider } from "./ContextProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Ekagra Admissions App",
  description:
    "Register now and enroll into one of the best courses across India.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head />
      <body className={inter.className}>
        <ThemesProviders>
          <ContextProvider>
            <LayoutProvider>{children}</LayoutProvider>
          </ContextProvider>
        </ThemesProviders>
        <ToastContainer />
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
