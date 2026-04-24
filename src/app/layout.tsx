import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

import LoginModal from "../components/auth/LoginModal/LoginModal";
import ToastProvider from "../components/shared/Toast/ToastProvider";
import { siteConfig } from "../config/siteConfig";
import GoogleAuthClientProvider from "../lib/google-auth/GoogleAuthClientProvider";
import QueryProvider from "../lib/react-query/QueryProvider";
import StoreProvider from "../lib/redux/provider/StoreProvider";
import { UserFetcher } from "./UserFetcher";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={poppins.variable} suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        <StoreProvider>
          <QueryProvider>
            <GoogleAuthClientProvider>
              <ToastProvider>
                <UserFetcher />
                <main>{children}</main>
                <LoginModal />
              </ToastProvider>
            </GoogleAuthClientProvider>
          </QueryProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
