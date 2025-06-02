import "~/styles/globals.css";

import { type Metadata } from "next";

import AuthGate from "./components/AuthGate";

export const metadata: Metadata = {
  title: "Funny Cartoon Cat EX",
  description: "Funny Cartoon Cat EX",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        style={{
          fontFamily: "'Shadows Into Light Two', cursive",
          margin: 0,
          padding: 0,
          minHeight: "100vh",
        }}
      >
        <AuthGate>{children}</AuthGate>
      </body>
    </html>
  );
}
