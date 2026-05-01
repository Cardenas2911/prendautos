import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  Home,
  Users,
  CarFront,
  Bike,
  CreditCard,
  HelpCircle,
  MessageSquare,
  X,
  Menu,
} from "lucide-react";

export interface NavLink {
  href: string;
  label: string;
  key: string;
  icon?: any;
}

const ICONS: Record<string, any> = {
  inicio: Home,
  nosotros: Users,
  prestamos: CarFront,
  motos: Bike,
  tarjetas: CreditCard,
  faq: HelpCircle,
  contacto: MessageSquare,
};

interface Props {
  links?: NavLink[];
  active: string | null;
}

export default function MobileMenu({ links = [], active = null }: Props) {
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
          <div
            className="absolute inset-0 bg-dark/60 backdrop-blur-sm animate-[fadeIn_0.3s_ease]"
            onClick={() => setOpen(false)}
          />

          <div className="absolute left-0 top-0 bottom-0 w-[85%] max-w-[340px] bg-gradient-to-b from-[#081714]/95 to-[#0B4032]/95 backdrop-blur-xl rounded-r-[32px] sm:rounded-[32px] border-r sm:border border-white/20 shadow-[8px_0_32px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden animate-[slideInLeft_0.4s_cubic-bezier(0.16,1,0.3,1)]">

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

            <nav className="flex-1 overflow-y-auto px-4 py-6 hide-scrollbar">
              <ul className="flex flex-col gap-3">
                {links.map((link) => {
                  const isActive = active === link.key;
                  const Icon = link.icon ?? ICONS[link.key] ?? Home;
                  return (
                    <li key={link.key}>
                      <a
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className={`group relative flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 ${
                          isActive
                            ? "bg-white/10 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]"
                            : "text-white/80 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        <div className={`p-2.5 rounded-xl transition-colors ${isActive ? "bg-accent/80 text-white" : "bg-white/5 group-hover:bg-white/10"}`}>
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
              </ul>
            </nav>

            <div className="p-6 border-t border-white/10 bg-black/10 flex flex-col gap-4">
              <a
                href="https://wa.me/573113547995"
                target="_blank"
                rel="noopener"
                onClick={() => setOpen(false)}
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-accent to-[#d35f37] text-white shadow-[0_4px_20px_rgba(232,113,74,0.4)] font-bold text-base px-6 py-4 rounded-2xl hover:opacity-90 transition-opacity"
              >
                Solicitar por WhatsApp →
              </a>

              <div className="flex items-center justify-center gap-6 pt-3">
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
        @keyframes slideInLeft {
          from { transform: translateX(-100%); opacity: 0.8; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </>
  );
}
