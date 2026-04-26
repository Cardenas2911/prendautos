import { useEffect, useState } from "react";

export interface NavLink {
  href: string;
  label: string;
  key: string;
}

export const NAV_LINKS: NavLink[] = [
  { href: `${import.meta.env.BASE_URL}/`, label: "Inicio", key: "inicio" },
  { href: `${import.meta.env.BASE_URL}/prestamos-vehiculos`, label: "Préstamos", key: "prestamos" },
  { href: `${import.meta.env.BASE_URL}/sin-dejar-el-carro`, label: "Sin dejar el carro", key: "sin-dejar-el-carro" },
  { href: `${import.meta.env.BASE_URL}/pignoracion`, label: "Pignoración", key: "pignoracion" },
  { href: `${import.meta.env.BASE_URL}/simulador`, label: "Simulador", key: "simulador" },
  { href: `${import.meta.env.BASE_URL}/nosotros`, label: "Nosotros", key: "nosotros" },
  { href: `${import.meta.env.BASE_URL}/oficinas`, label: "Oficinas", key: "oficinas" },
];

interface Props {
  links?: NavLink[];
  active: string | null;
}

export default function MobileMenu({ active = null }: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") setOpen(false);
      };
      window.addEventListener("keydown", onKey);
      return () => {
        document.body.style.overflow = prev;
        window.removeEventListener("keydown", onKey);
      };
    }
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Abrir menú"
        aria-expanded={open}
        aria-controls="mobile-menu"
        className="lg:hidden inline-flex items-center justify-center w-11 h-11 rounded-xl text-dark hover:bg-light transition-colors cursor-pointer"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <line x1="4" y1="7" x2="20" y2="7" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="4" y1="17" x2="20" y2="17" />
        </svg>
      </button>

      {open && (
        <div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menú de navegación"
          className="fixed inset-0 z-[80] lg:hidden"
        >
          <div
            className="absolute inset-0 bg-dark/55 backdrop-blur-sm animate-[fadeIn_0.2s_ease]"
            onClick={() => setOpen(false)}
          />

          <div
            className="absolute right-0 top-0 bottom-0 w-full sm:max-w-sm bg-base flex flex-col shadow-2xl animate-[slideIn_0.25s_ease]"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <span className="font-mono text-[11px] tracking-widest uppercase text-gray font-semibold">
                Menú
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Cerrar menú"
                className="w-11 h-11 inline-flex items-center justify-center rounded-xl text-dark hover:bg-light transition-colors cursor-pointer"
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <line x1="6" y1="6" x2="18" y2="18" />
                  <line x1="6" y1="18" x2="18" y2="6" />
                </svg>
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-5 py-6">
              <ul className="flex flex-col">
                {NAV_LINKS.map((link) => {
                  const isActive = active === link.key;
                  return (
                    <li key={link.key}>
                      <a
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className={[
                          "block py-4 text-lg font-semibold tracking-tight border-b border-border transition-colors",
                          isActive
                            ? "text-primary"
                            : "text-dark hover:text-primary",
                        ].join(" ")}
                      >
                        <span className="inline-flex items-center gap-2">
                          {link.label}
                          {isActive && (
                            <span
                              aria-hidden
                              className="w-1.5 h-1.5 rounded-full bg-accent"
                            />
                          )}
                        </span>
                      </a>
                    </li>
                  );
                })}
                <li>
                  <a
                    href={`${import.meta.env.BASE_URL}/preguntas-frecuentes`}
                    onClick={() => setOpen(false)}
                    className="block py-4 text-lg font-semibold tracking-tight text-dark hover:text-primary border-b border-border transition-colors"
                  >
                    Ayuda
                  </a>
                </li>
              </ul>
            </nav>

            <div className="p-5 border-t border-border flex flex-col gap-3 bg-light/40">
              <a
                href={`${import.meta.env.BASE_URL}/simulador`}
                onClick={() => setOpen(false)}
                className="inline-flex items-center justify-center gap-2 bg-primary text-white font-semibold text-base px-7 py-4 rounded-xl hover:bg-primary-dark transition-colors"
              >
                Solicitar préstamo →
              </a>
              <a
                href="https://wa.me/573113547995"
                target="_blank"
                rel="noopener"
                onClick={() => setOpen(false)}
                className="inline-flex items-center justify-center gap-2 bg-whatsapp text-white font-semibold text-base px-7 py-4 rounded-xl hover:opacity-90 transition-opacity"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M12 2a10 10 0 00-8.6 14.9L2 22l5.2-1.4A10 10 0 1012 2z" />
                </svg>
                Hablar por WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </>
  );
}
