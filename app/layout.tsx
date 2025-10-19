/* eslint-disable react-refresh/only-export-components */
import type { Metadata } from "next";
import "modern-normalize/modern-normalize.css";
import "./globals.css";
import styles from "./layout.module.css";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import TanStackProvider from "@/components/TanStackProvider/TanStackProvider";

export const metadata: Metadata = {
  title: "NoteHub",
  description: "A simple note management app",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <TanStackProvider>
          <div className={styles.wrapper}>
            <Header />
            {children}
            <Footer />
          </div>
          <div id="modal-root" />
        </TanStackProvider>
      </body>
    </html>
  );
}
