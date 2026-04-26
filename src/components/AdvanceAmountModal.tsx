import React, { useState, useEffect } from 'react';
import { X, CreditCard, Banknote, ShieldCheck, ChevronRight, Info } from 'lucide-react';

/* ------------------------------------------------------------------ */
/* Tipos y constantes                                                   */
/* ------------------------------------------------------------------ */
type TarjetaTipo = 'estandar' | 'codensa';

interface TarjetaOpcion {
  id: TarjetaTipo;
  label: string;
  porcentaje: number;
  descripcion: string;
  color: string;
}

const TARJETAS: TarjetaOpcion[] = [
  {
    id: 'estandar',
    label: 'Franquicias, Retail y Bancos',
    porcentaje: 12,
    descripcion: 'Visa, Mastercard, Amex, Éxito, Alkosto, Falabella…',
    color: '#1a5c4a',
  },
  {
    id: 'codensa',
    label: 'Tarjeta Crédito Fácil Codensa',
    porcentaje: 18,
    descripcion: 'Exclusivo por su red procesadora Codensa / Enel.',
    color: '#c0392b',
  },
];

const MONTO_MIN = 50_000;
const WP_BASE = 'https://prendautos.com';
const PRODUCT_ID = '2026';

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */
const cop = (v: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(v);

/* ------------------------------------------------------------------ */
/* Componente Principal                                                 */
/* ------------------------------------------------------------------ */
export default function AdvanceAmountModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [rawAmount, setRawAmount] = useState('1000000');
  const [tarjeta, setTarjeta] = useState<TarjetaTipo>('estandar');
  const [cuotas, setCuotas] = useState(12);
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  /* ------ Listeners para disparar el modal desde cualquier botón CTA ------ */
  useEffect(() => {
    const handler = (e: Event) => { e.preventDefault(); setIsOpen(true); };
    const setup = () => {
      document.querySelectorAll('[data-advance-modal]').forEach(el => {
        el.removeEventListener('click', handler);
        el.addEventListener('click', handler);
      });
    };
    setup();
    document.addEventListener('astro:page-load', setup);
    return () => {
      document.removeEventListener('astro:page-load', setup);
      document.querySelectorAll('[data-advance-modal]').forEach(el =>
        el.removeEventListener('click', handler)
      );
    };
  }, []);

  /* ------ Bloquear scroll del body cuando el modal está abierto ------ */
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  /* ------ Cálculos de costos ------ */
  const montoNum = parseInt(rawAmount || '0', 10);
  const opcionActual = TARJETAS.find(t => t.id === tarjeta)!;
  const comision = Math.round(montoNum * opcionActual.porcentaje / 100);
  const montoNeto = montoNum - comision;
  const montoValido = montoNum >= MONTO_MIN;

  /* ------ Formateador del input para mostrar puntos de miles ------ */
  const displayAmount = montoNum > 0
    ? new Intl.NumberFormat('es-CO').format(montoNum)
    : '';

  /* ------ Submit ------ */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!montoValido) { setError(`El monto mínimo es ${cop(MONTO_MIN)}`); return; }
    if (!aceptaTerminos) { setError('Debes aceptar los términos y condiciones para continuar.'); return; }

    setError('');
    setIsLoading(true);
    // Redirige al checkout de WooCommerce con los parámetros NYP
    window.location.href = `${WP_BASE}/finalizar-compra/?add-to-cart=${PRODUCT_ID}&nyp=${montoNum}`;
  };

  /* ================================================================ */
  /* Render                                                            */
  /* ================================================================ */
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Calculadora de avance de cupo"
      className="advance-modal-overlay"
      onClick={e => { if (e.target === e.currentTarget) setIsOpen(false); }}
    >
      <div className="advance-modal-box">

        {/* ── Encabezado ─────────────────────────────────────────── */}
        <div className="advance-modal-header">
          <div className="advance-modal-header-icon">
            <Banknote size={22} />
          </div>
          <div>
            <h2 className="advance-modal-title">Simulador de Cambio de Cupo</h2>
            <p className="advance-modal-subtitle">Calcula cuánto recibirías en efectivo</p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="advance-modal-close"
            aria-label="Cerrar modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* ── Cuerpo con scroll ──────────────────────────────────── */}
        <div className="advance-modal-body">
          <form onSubmit={handleSubmit} noValidate>

            {/* 1. Monto */}
            <div className="amc-field">
              <label htmlFor="adv-amount" className="amc-label">
                ¿Cuánto quieres cambiar por efectivo?
              </label>
              <div className="amc-input-wrap">
                <span className="amc-prefix">$</span>
                <input
                  id="adv-amount"
                  type="text"
                  inputMode="numeric"
                  value={displayAmount}
                  onChange={e => {
                    const raw = e.target.value.replace(/\D/g, '');
                    setRawAmount(raw);
                    setError('');
                  }}
                  className="amc-input"
                  placeholder="1.000.000"
                  autoComplete="off"
                />
                <span className="amc-suffix">COP</span>
              </div>
              {!montoValido && rawAmount !== '' && (
                <p className="amc-hint-error">Monto mínimo: {cop(MONTO_MIN)}</p>
              )}
            </div>

            {/* 2. Tipo de tarjeta */}
            <div className="amc-field">
              <label className="amc-label">Tipo de tarjeta</label>
              <div className="amc-cards-grid">
                {TARJETAS.map(t => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTarjeta(t.id)}
                    className={`amc-card-btn ${tarjeta === t.id ? 'amc-card-btn--active' : ''}`}
                  >
                    <CreditCard size={16} className="amc-card-icon" />
                    <span className="amc-card-label">{t.label}</span>
                    <span className="amc-card-badge">{t.porcentaje}% comisión</span>
                    <span className="amc-card-desc">{t.descripcion}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Cuotas */}
            <div className="amc-field">
              <label htmlFor="adv-cuotas" className="amc-label">
                ¿A cuántas cuotas deseas{' '}
                <span className="amc-tooltip-wrap">
                  diferir
                  <span className="amc-tooltip">
                    <strong>¿Qué significa diferir?</strong><br />
                    Diferir es dividir el cobro total en varias cuotas mensuales. En lugar de que tu banco te cobre todo de una sola vez, el monto se reparte a lo largo del tiempo que elijas.
                  </span>
                </span>
              {' '}
                <span className="amc-tag">hasta 36</span>
              </label>
              <div className="amc-cuotas-wrap">
                <input
                  id="adv-cuotas"
                  type="range"
                  min={1}
                  max={36}
                  step={1}
                  value={cuotas}
                  onChange={e => setCuotas(parseInt(e.target.value))}
                  className="amc-range"
                />
                <div className="amc-cuotas-display">
                  <span className="amc-cuotas-num">{cuotas}</span>
                  <span className="amc-cuotas-text">{cuotas === 1 ? 'cuota' : 'cuotas'}</span>
                </div>
              </div>
              <p className="amc-hint">
                El número de cuotas lo define tu banco emisor. Indícanoslo al pasar el datáfono.
              </p>
            </div>

            {/* 4. Desglose de costos */}
            {montoValido && (
              <div className="amc-breakdown">
                <div className="amc-breakdown-header">
                  <Info size={14} />
                  <span>Transparencia total de costos</span>
                </div>

                <div className="amc-breakdown-row">
                  <span>Cupo que pasas por el datáfono</span>
                  <strong>{cop(montoNum)}</strong>
                </div>
                <div className="amc-breakdown-row amc-breakdown-row--deduccion">
                  <span>
                    Comisión del servicio
                    <em> (-{opcionActual.porcentaje}%)</em>
                  </span>
                  <strong>- {cop(comision)}</strong>
                </div>
                <div className="amc-breakdown-divider" />
                <div className="amc-breakdown-row amc-breakdown-row--neto">
                  <span>💵 Efectivo que recibes</span>
                  <strong>{cop(montoNeto)}</strong>
                </div>

                <p className="amc-breakdown-nota">
                  Tu banco te cobrar&aacute; <strong>{cop(montoNum)}</strong> dividido en{' '}
                  <strong>{cuotas} {cuotas === 1 ? 'cuota' : 'cuotas'}</strong> según tus condiciones.
                </p>
              </div>
            )}

            {/* 5. Términos y condiciones */}
            <label className="amc-terms">
              <input
                type="checkbox"
                checked={aceptaTerminos}
                onChange={e => { setAceptaTerminos(e.target.checked); setError(''); }}
                className="amc-checkbox"
              />
              <span>
                He leído y acepto los{' '}
                <a href="/terminos-y-condiciones" target="_blank" rel="noopener" className="amc-link">
                  Términos y Condiciones
                </a>{' '}
                y entiendo el desglose de costos mostrado arriba.
              </span>
            </label>

            {/* Error global */}
            {error && <p className="amc-error" role="alert">{error}</p>}

            {/* 6. CTA */}
            <button
              type="submit"
              disabled={!montoValido || isLoading}
              className="amc-cta"
            >
              {isLoading ? (
                <span className="amc-cta-loading">Redirigiendo al checkout…</span>
              ) : (
                <>
                  <ShieldCheck size={20} />
                  <span>Confirmar y solicitar mi cambio</span>
                  <ChevronRight size={18} className="amc-cta-arrow" />
                </>
              )}
            </button>

          </form>
        </div>

      </div>

      {/* ── Estilos encapsulados ────────────────────────────────── */}
      <style>{`
        /* Overlay */
        .advance-modal-overlay {
          position: fixed; inset: 0; z-index: 9999;
          display: flex; align-items: center; justify-content: center;
          padding: 1rem;
          background: rgba(0,0,0,.55);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          animation: amc-fade-in .18s ease;
        }
        @keyframes amc-fade-in { from { opacity:0 } to { opacity:1 } }

        /* Caja del modal */
        .advance-modal-box {
          background: #fff;
          border-radius: 20px;
          box-shadow: 0 24px 80px rgba(0,0,0,.22);
          width: 100%;
          max-width: 480px;
          max-height: 92dvh;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          animation: amc-slide-up .22s cubic-bezier(.34,1.56,.64,1);
        }
        @keyframes amc-slide-up { from { opacity:0; transform:translateY(28px) scale(.97) } to { opacity:1; transform:none } }

        /* Header */
        .advance-modal-header {
          display: flex; align-items: center; gap: .75rem;
          padding: 1.1rem 1.25rem;
          background: linear-gradient(135deg, #0e4535 0%, #1a6b52 100%);
          border-radius: 20px 20px 0 0;
          flex-shrink: 0;
        }
        .advance-modal-header-icon {
          width: 40px; height: 40px;
          background: rgba(255,255,255,.18);
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          color: #fff;
          flex-shrink: 0;
        }
        .advance-modal-title {
          font-size: 1rem; font-weight: 700; color: #fff;
          margin: 0; line-height: 1.2;
        }
        .advance-modal-subtitle {
          font-size: .72rem; color: rgba(255,255,255,.7);
          margin: 0; line-height: 1;
        }
        .advance-modal-close {
          margin-left: auto; flex-shrink: 0;
          background: rgba(255,255,255,.15);
          border: none; border-radius: 8px;
          width: 32px; height: 32px;
          display: flex; align-items: center; justify-content: center;
          color: #fff; cursor: pointer;
          transition: background .15s;
        }
        .advance-modal-close:hover { background: rgba(255,255,255,.28); }

        /* Cuerpo scrollable */
        .advance-modal-body {
          overflow-y: auto;
          padding: 1.25rem;
          display: flex; flex-direction: column; gap: .25rem;
        }

        /* Campos */
        .amc-field { margin-bottom: 1.1rem; }
        .amc-label {
          display: flex; align-items: center; gap: .4rem;
          font-size: .78rem; font-weight: 700;
          color: #1e293b; margin-bottom: .5rem;
          text-transform: uppercase; letter-spacing: .04em;
        }
        .amc-tag {
          font-size: .65rem; font-weight: 600;
          background: #e8f5ee; color: #1a6b52;
          padding: 2px 7px; border-radius: 10px;
          text-transform: none; letter-spacing: 0;
        }

        /* Input monto */
        .amc-input-wrap {
          display: flex; align-items: center;
          border: 2px solid #e2e8f0; border-radius: 12px;
          background: #f8fafc; overflow: hidden;
          transition: border-color .15s;
        }
        .amc-input-wrap:focus-within {
          border-color: #1a6b52;
          background: #fff;
          box-shadow: 0 0 0 4px rgba(26,107,82,.1);
        }
        .amc-prefix {
          padding: 0 .75rem; font-size: 1.1rem;
          font-weight: 700; color: #64748b;
        }
        .amc-input {
          flex: 1; border: none; outline: none;
          background: transparent;
          font-size: 1.5rem; font-weight: 800; color: #0f172a;
          padding: .7rem 0;
        }
        .amc-suffix {
          padding: 0 .75rem; font-size: .72rem;
          font-weight: 600; color: #94a3b8;
        }
        .amc-hint-error {
          margin-top: .35rem; font-size: .72rem;
          color: #dc2626; font-weight: 600;
        }

        /* Tarjetas */
        .amc-cards-grid {
          display: grid; grid-template-columns: 1fr 1fr; gap: .6rem;
        }
        .amc-card-btn {
          display: flex; flex-direction: column; align-items: flex-start; gap: .2rem;
          padding: .7rem .8rem;
          border: 2px solid #e2e8f0;
          border-radius: 12px; background: #f8fafc;
          cursor: pointer; text-align: left;
          transition: all .15s;
        }
        .amc-card-btn:hover { border-color: #94a3b8; background: #fff; }
        .amc-card-btn--active {
          border-color: #1a6b52 !important;
          background: #f0faf4 !important;
          box-shadow: 0 0 0 3px rgba(26,107,82,.12);
        }
        .amc-card-icon { color: #64748b; }
        .amc-card-btn--active .amc-card-icon { color: #1a6b52; }
        .amc-card-label { font-size: .75rem; font-weight: 700; color: #1e293b; line-height: 1.2; }
        .amc-card-badge {
          font-size: .65rem; font-weight: 700;
          background: #fee2e2; color: #dc2626;
          padding: 1px 6px; border-radius: 8px;
        }
        .amc-card-btn--active .amc-card-badge {
          background: #e8f5ee; color: #1a6b52;
        }
        .amc-card-desc { font-size: .64rem; color: #94a3b8; line-height: 1.3; }

        /* Cuotas */
        .amc-cuotas-wrap {
          display: flex; align-items: center; gap: 1rem;
        }
        .amc-range {
          flex: 1; height: 4px; cursor: pointer;
          accent-color: #1a6b52;
        }
        .amc-cuotas-display {
          display: flex; align-items: baseline; gap: .2rem;
          flex-shrink: 0;
          background: #f0faf4;
          border: 2px solid #1a6b52;
          border-radius: 10px; padding: .3rem .65rem;
          min-width: 70px; justify-content: center;
        }
        .amc-cuotas-num { font-size: 1.4rem; font-weight: 800; color: #0e4535; }
        .amc-cuotas-text { font-size: .7rem; font-weight: 600; color: #64748b; }
        .amc-hint { font-size: .68rem; color: #94a3b8; margin-top: .4rem; line-height: 1.4; }

        /* Tooltip sobre "diferir" */
        .amc-tooltip-wrap {
          position: relative; display: inline-flex; align-items: center;
          border-bottom: 1.5px dashed #1a6b52; cursor: help;
          color: #1a6b52; font-weight: 700;
        }
        .amc-tooltip {
          display: none;
          position: absolute; bottom: calc(100% + 8px); left: 50%;
          transform: translateX(-50%);
          width: 230px;
          background: #0e4535;
          color: #fff;
          font-size: .7rem; font-weight: 400; line-height: 1.5;
          padding: .65rem .8rem;
          border-radius: 10px;
          box-shadow: 0 8px 24px rgba(0,0,0,.25);
          pointer-events: none;
          text-align: left;
          z-index: 10;
        }
        .amc-tooltip strong { display: block; margin-bottom: .25rem; font-size: .72rem; color: #6ee7b7; }
        /* Flecha */
        .amc-tooltip::after {
          content: '';
          position: absolute; top: 100%; left: 50%;
          transform: translateX(-50%);
          border: 6px solid transparent;
          border-top-color: #0e4535;
        }
        .amc-tooltip-wrap:hover .amc-tooltip,
        .amc-tooltip-wrap:focus-within .amc-tooltip { display: block; }

        /* Desglose */
        .amc-breakdown {
          background: linear-gradient(135deg, #f0faf4 0%, #f8fcfb 100%);
          border: 1.5px solid #b7e0ce;
          border-radius: 14px;
          padding: 1rem;
          margin-bottom: 1rem;
        }
        .amc-breakdown-header {
          display: flex; align-items: center; gap: .4rem;
          font-size: .7rem; font-weight: 700;
          color: #1a6b52; text-transform: uppercase; letter-spacing: .05em;
          margin-bottom: .75rem;
        }
        .amc-breakdown-row {
          display: flex; justify-content: space-between; align-items: center;
          font-size: .8rem; color: #475569; padding: .3rem 0;
        }
        .amc-breakdown-row em { color: #dc2626; font-style: normal; font-weight: 600; }
        .amc-breakdown-row strong { font-weight: 700; color: #1e293b; }
        .amc-breakdown-row--deduccion strong { color: #dc2626; }
        .amc-breakdown-divider {
          height: 1px; background: #b7e0ce; margin: .4rem 0;
        }
        .amc-breakdown-row--neto {
          font-size: .9rem; font-weight: 700; color: #0e4535;
        }
        .amc-breakdown-row--neto strong {
          font-size: 1.05rem; color: #0e4535;
        }
        .amc-breakdown-nota {
          font-size: .68rem; color: #64748b;
          margin-top: .65rem; line-height: 1.5;
          padding-top: .6rem;
          border-top: 1px dashed #b7e0ce;
        }
        .amc-breakdown-nota strong { color: #0e4535; }

        /* Términos */
        .amc-terms {
          display: flex; align-items: flex-start; gap: .6rem;
          font-size: .75rem; color: #475569;
          line-height: 1.5; cursor: pointer;
          margin-bottom: .85rem;
        }
        .amc-checkbox {
          margin-top: .15rem; flex-shrink: 0;
          width: 16px; height: 16px;
          accent-color: #1a6b52; cursor: pointer;
        }
        .amc-link { color: #1a6b52; font-weight: 700; text-decoration: underline; }

        /* Error */
        .amc-error {
          font-size: .75rem; color: #dc2626; font-weight: 600;
          background: #fef2f2; border: 1px solid #fecaca;
          border-radius: 8px; padding: .5rem .75rem;
          margin-bottom: .75rem;
        }

        /* CTA */
        .amc-cta {
          width: 100%; display: flex; align-items: center; justify-content: center; gap: .6rem;
          padding: .9rem 1.25rem;
          background: linear-gradient(135deg, #0e4535 0%, #1a6b52 100%);
          color: #fff; font-size: .95rem; font-weight: 800;
          border: none; border-radius: 14px; cursor: pointer;
          transition: opacity .15s, transform .12s;
          box-shadow: 0 6px 20px rgba(14,69,53,.3);
        }
        .amc-cta:hover:not(:disabled) { opacity: .92; transform: translateY(-1px); }
        .amc-cta:active:not(:disabled) { transform: translateY(0) scale(.99); }
        .amc-cta:disabled { opacity: .5; cursor: not-allowed; }
        .amc-cta-arrow { transition: transform .15s; }
        .amc-cta:hover:not(:disabled) .amc-cta-arrow { transform: translateX(3px); }
        .amc-cta-loading { color: rgba(255,255,255,.85); font-style: italic; }

        /* Responsive */
        @media (max-width: 480px) {
          .advance-modal-box { border-radius: 16px; max-height: 96dvh; }
          .advance-modal-body { padding: 1rem; }
          .amc-input { font-size: 1.25rem; }
          .amc-cards-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
