"use client";
import { SessionProvider } from "next-auth/react";
import "../styles/globals.css";
import { GlobalStateProvider } from "./GlobalStateContext";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <GlobalStateProvider>
          <SessionProvider>
            {children}
          </SessionProvider>
        </GlobalStateProvider>
      </body>
    </html>
  );
}