import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "EnergIA",
  description: "Monitoramento inteligente de consumo de energia para pequenos negocios."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
