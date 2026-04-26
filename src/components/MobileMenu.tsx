import { useEffect, useState } from "react";
import { 
  Home, 
  BadgeDollarSign, 
  CarFront, 
  RefreshCcw, 
  Calculator, 
  Users, 
  MapPin,
  HelpCircle,
  MessageCircle,
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

      {open && (
        <div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menú de navegación"
          className="fixed inset-0 z-[80] lg:hidden"
        >
          {/* Backdrop Blur Overlay */}
          <div
            className="absolute inset-0 bg-dark/40 backdrop-blur-md animate-[fadeIn_0.3s_ease]"
            onClick={() => setOpen(false)}
          />

          {/* Glassmorphism Panel */}
          <div className="absolute right-0 sm:right-4 top-0 sm:top-4 bottom-0 sm:bottom-4 w-full sm:max-w-[320px] bg-white/10 backdrop-blur-3xl sm:rounded-[32px] sm:border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.25)] flex flex-col overflow-hidden animate-[slideIn_0.4s_cubic-bezier(0.16,1,0.3,1)]">
            
            {/* Header */}
            <div className="flex items-center justify-between px-6 mx-2 pt-6 pb-4 border-b border-white/10 relative">
              <span className="font-mono text-xs tracking-[0.2em] font-semibold text-white/50 uppercase">
                Menú Principal
              </span>
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
                            ? "bg-white/20 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]" 
                            : "text-white/70 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        <div className={`p-2 rounded-xl transition-colors ${isActive ? "bg-primary text-white" : "bg-white/5 group-hover:bg-white/10"}`}>
                           <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
                        </div>
                        <span className="font-semibold text-[15px] tracking-tight">{link.label}</span>
                        {isActive && (
                          <div className="absolute right-4 w-2 h-2 rounded-full bg-[#E8714A] shadow-[0_0_10px_#E8714A]" />
                        )}
                      </a>
                    </li>
                  );
                })}

                <li>
                  <a
                    href={`${import.meta.env.BASE_URL}/preguntas-frecuentes`}
                    onClick={() => setOpen(false)}
                    className="group flex items-center gap-4 px-4 py-3.5 rounded-2xl text-white/70 hover:bg-white/10 hover:text-white transition-all duration-300 mt-2"
                  >
                    <div className="p-2 rounded-xl bg-white/5 group-hover:bg-white/10 transition-colors">
                      <HelpCircle className="w-5 h-5" strokeWidth={2} />
                    </div>
                    <span className="font-semibold text-[15px] tracking-tight">Ayuda</span>
                  </a>
                </li>
              </ul>
            </nav>

            {/* Bottom Actions */}
            <div className="p-6 border-t border-white/10 bg-black/20 flex flex-col gap-3">
              <a
                href={`${import.meta.env.BASE_URL}/simulador`}
                onClick={() => setOpen(false)}
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-[#0e8f7a] text-white shadow-[0_0_20px_rgba(11,107,92,0.4)] font-semibold text-base px-6 py-4 rounded-2xl hover:opacity-90 transition-opacity"
              >
                Solicitar préstamo →
              </a>
              <a
                href="https://wa.me/573113547995"
                target="_blank"
                rel="noopener"
                onClick={() => setOpen(false)}
                className="inline-flex items-center justify-center gap-2 bg-[#25D366]/20 border border-[#25D366]/40 text-white font-semibold text-[15px] px-6 py-3.5 rounded-2xl hover:bg-[#25D366]/30 transition-all backdrop-blur-md"
              >
                <div className="bg-[#25D366] text-white p-1 rounded-full">
                   <MessageCircle className="w-4 h-4" />
                </div>
                Contactar asesor
              </a>
            </div>
          </div>
        </div>
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
          to { opacity: 1; backdrop-filter: blur(12px); }
        }
        @keyframes slideIn {
          from { transform: translateX(100%) scale(0.95); opacity: 0; }
          to { transform: translateX(0) scale(1); opacity: 1; }
        }
      `}</style>
    </>
  );
}
