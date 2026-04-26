import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { 
  Home, 
  BadgeDollarSign, 
  CarFront, 
  RefreshCcw, 
  Calculator, 
  Users, 
  MapPin,
  HelpCircle,
  X,
  Menu
} from "lucide-react";

export interface NavLink {
  href: string;
  label: string;
  key: string;
  icon: any;
}

export const NAV_LINKS: NavLink[] = [
  { href: `${import.meta.env.BASE_URL}/`, label: "Inicio", key: "inicio", icon: Home },
  { href: `${import.meta.env.BASE_URL}/prestamos-vehiculos`, label: "Préstamos", key: "prestamos", icon: BadgeDollarSign },
  { href: `${import.meta.env.BASE_URL}/sin-dejar-el-carro`, label: "Sin dejar el carro", key: "sin-dejar-el-carro", icon: CarFront },
  { href: `${import.meta.env.BASE_URL}/pignoracion`, label: "Pignoración", key: "pignoracion", icon: RefreshCcw },
  { href: `${import.meta.env.BASE_URL}/simulador`, label: "Simulador", key: "simulador", icon: Calculator },
  { href: `${import.meta.env.BASE_URL}/nosotros`, label: "Nosotros", key: "nosotros", icon: Users },
  { href: `${import.meta.env.BASE_URL}/oficinas`, label: "Oficinas", key: "oficinas", icon: MapPin },
];

interface Props {
  links?: NavLink[];
  active: string | null;
}

export default function MobileMenu({ active = null }: Props) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
        <Menu className="w-6 h-6" strokeWidth={2.5} />
      </button>

      {open && mounted && createPortal(
        <div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menú de navegación"
          className="fixed inset-0 z-[100] lg:hidden"
        >
          {/* Backdrop Blur Overlay */}
          <div
            className="absolute inset-0 bg-dark/60 backdrop-blur-sm animate-[fadeIn_0.3s_ease]"
            onClick={() => setOpen(false)}
          />

          {/* Glassmorphism Panel - Gradient Verde Oscuro */}
          <div className="absolute right-0 sm:right-4 top-0 sm:top-4 bottom-0 sm:bottom-4 w-full sm:max-w-[340px] bg-gradient-to-b from-[#081714]/95 to-[#0B4032]/95 backdrop-blur-xl sm:rounded-[32px] sm:border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden animate-[slideIn_0.4s_cubic-bezier(0.16,1,0.3,1)]">
            
            {/* Header: Logo */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-white/10 relative">
              <a href={`${import.meta.env.BASE_URL}/`} className="flex items-center gap-2" onClick={() => setOpen(false)}>
                <svg width="28" height="28" viewBox="0 0 200 200" aria-hidden="true">
                  <path
                    d="M 50 160 L 50 60 A 30 30 0 0 1 80 30 L 110 30 A 40 40 0 0 1 150 70 A 40 40 0 0 1 110 110 L 80 110"
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="20"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="155" cy="160" r="11" fill="#E8714A" />
                </svg>
                <span className="font-extrabold text-2xl tracking-tight text-white">
                  prend<span className="text-accent">autos</span>
                </span>
              </a>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Cerrar menú"
                className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-white/5 text-white/70 hover:bg-white/20 hover:text-white transition-all cursor-pointer backdrop-blur-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Links */}
            <nav className="flex-1 overflow-y-auto px-4 py-4 hide-scrollbar">
              <ul className="flex flex-col gap-1.5">
                {NAV_LINKS.map((link) => {
                  const isActive = active === link.key;
                  const Icon = link.icon;
                  return (
                    <li key={link.key}>
                      <a
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className={`group relative flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 ${
                          isActive 
                            ? "bg-white/10 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]" 
                            : "text-white/80 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        <div className={`p-2 rounded-xl transition-colors ${isActive ? "bg-accent/80 text-white" : "bg-white/5 group-hover:bg-white/10"}`}>
                           <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
                        </div>
                        <span className="font-medium text-[16px] tracking-tight">{link.label}</span>
                        {isActive && (
                          <div className="absolute right-4 w-2 h-2 rounded-full bg-accent shadow-[0_0_10px_#E8714A]" />
                        )}
                      </a>
                    </li>
                  );
                })}

                <li className="mt-2 pt-2 border-t border-white/10">
                  <a
                    href={`${import.meta.env.BASE_URL}/preguntas-frecuentes`}
                    onClick={() => setOpen(false)}
                    className="group flex items-center gap-4 px-4 py-3.5 rounded-2xl text-white/80 hover:bg-white/5 hover:text-white transition-all duration-300"
                  >
                    <div className="p-2 rounded-xl bg-white/5 group-hover:bg-white/10 transition-colors">
                      <HelpCircle className="w-5 h-5" strokeWidth={2} />
                    </div>
                    <span className="font-medium text-[16px] tracking-tight">Ayuda</span>
                  </a>
                </li>
              </ul>
            </nav>

            {/* Bottom Actions & Social */}
            <div className="p-6 border-t border-white/10 bg-black/10 flex flex-col gap-4">
              <a
                href={`${import.meta.env.BASE_URL}/simulador`}
                onClick={() => setOpen(false)}
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-accent to-[#d35f37] text-white shadow-[0_4px_20px_rgba(232,113,74,0.4)] font-bold text-base px-6 py-4 rounded-2xl hover:opacity-90 transition-opacity"
              >
                Solicitar préstamo →
              </a>
              
              <div className="flex items-center justify-center gap-6 pt-3">
                <a href="#" className="text-white/60 hover:text-white hover:scale-110 transition-all rounded-full p-2 bg-white/5 hover:bg-white/10">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                  </svg>
                </a>
                <a href="#" className="text-white/60 hover:text-white hover:scale-110 transition-all rounded-full p-2 bg-white/5 hover:bg-white/10">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                  </svg>
                </a>
                <a href="https://wa.me/573113547995" target="_blank" rel="noopener" className="text-white/60 hover:text-[#25D366] hover:scale-110 transition-all rounded-full p-2 bg-white/5 hover:bg-white/10">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 2a10 10 0 00-8.6 14.9L2 22l5.2-1.4A10 10 0 1012 2z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes fadeIn {
          from { opacity: 0; backdrop-filter: blur(0px); }
          to { opacity: 1; backdrop-filter: blur(8px); }
        }
        @keyframes slideIn {
          from { transform: translateX(100%) scale(0.95); opacity: 0; }
          to { transform: translateX(0) scale(1); opacity: 1; }
        }
      `}</style>
    </>
  );
}
