"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Dashboard" },
  { href: "/readings", label: "Leituras" },
  { href: "/settings", label: "Limites" }
];

export function Topbar() {
  const pathname = usePathname();

  return (
    <header className="topbar glass-card">
      <div>
        <span className="brand-kicker">EnergIA Control Center</span>
        <h1 className="page-title">Monitoramento energetico com resposta rapida.</h1>
        <p className="page-subtitle">
          Acompanhe consumo, detecte picos, ajuste limites e mantenha sua operacao de pequeno negocio sob controle.
        </p>
      </div>

      <nav className="nav-tabs">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`nav-chip ${pathname === link.href ? "active" : ""}`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
