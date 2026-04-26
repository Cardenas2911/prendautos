import { useMemo, useState, type FormEvent } from "react";

const formatCOP = (value: number) =>
  "$" +
  Math.round(value).toLocaleString("es-CO", {
    maximumFractionDigits: 0,
  });

const VEHICLE_TYPES = [
  { id: "carro", label: "🚗 Carro" },
  { id: "moto", label: "🏍️ Moto" },
  { id: "taxi", label: "🚕 Taxi" },
] as const;

type VehicleType = (typeof VEHICLE_TYPES)[number]["id"];

const VALOR_MIN = 5_000_000;
const VALOR_MAX = 200_000_000;
const PLAZO_MIN = 6;
const PLAZO_MAX = 60;
const PORC_MIN = 20;
const PORC_MAX = 50;
const TASA_MES = 0.02;

interface FormState {
  nombre: string;
  telefono: string;
  email: string;
}

export default function Simulator() {
  const [tipo, setTipo] = useState<VehicleType>("carro");
  const [valor, setValor] = useState(45_000_000);
  const [plazo, setPlazo] = useState(24);
  const [porc, setPorc] = useState(50);

  const [form, setForm] = useState<FormState>({
    nombre: "",
    telefono: "",
    email: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const { monto, cuota } = useMemo(() => {
    const m = Math.round((valor * porc) / 100);
    const c = Math.round(
      (m * (TASA_MES * Math.pow(1 + TASA_MES, plazo))) /
        (Math.pow(1 + TASA_MES, plazo) - 1),
    );
    return { monto: m, cuota: c };
  }, [valor, plazo, porc]);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8 items-start">
      {/* FORM */}
      <div className="bg-white border border-border rounded-3xl p-9">
        <Field label="Tipo de vehículo">
          <div className="grid grid-cols-3 gap-2">
            {VEHICLE_TYPES.map((t) => {
              const active = tipo === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTipo(t.id)}
                  className={[
                    "rounded-xl py-3 px-3 font-sans text-sm font-semibold cursor-pointer transition-all border-[1.5px]",
                    active
                      ? "bg-primary/10 border-primary text-primary"
                      : "bg-light border-transparent text-dark hover:border-border",
                  ].join(" ")}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </Field>

        <Slider
          label="Valor comercial del vehículo"
          valueLabel={formatCOP(valor)}
          min={VALOR_MIN}
          max={VALOR_MAX}
          step={1_000_000}
          value={valor}
          onChange={setValor}
          minLabel="$5M"
          maxLabel="$200M"
        />

        <Slider
          label="Plazo (meses)"
          valueLabel={`${plazo} meses`}
          min={PLAZO_MIN}
          max={PLAZO_MAX}
          step={6}
          value={plazo}
          onChange={setPlazo}
          minLabel="6 m"
          maxLabel="60 m"
        />

        <Slider
          label="% del valor que necesitas"
          valueLabel={`${porc}%`}
          min={PORC_MIN}
          max={PORC_MAX}
          step={5}
          value={porc}
          onChange={setPorc}
          minLabel="20%"
          maxLabel="50%"
          isLast
        />
      </div>

      {/* RESULT */}
      <div className="bg-dark text-white rounded-3xl p-9 lg:sticky lg:top-[100px]">
        <span className="inline-block bg-accent/15 text-accent font-mono text-[11px] px-2.5 py-1 rounded-full tracking-wider uppercase font-semibold mb-5">
          Pre-aprobación estimada
        </span>

        <div className="text-[13px] text-white/55 font-mono tracking-wider uppercase">
          Recibes hasta
        </div>
        <div className="text-5xl font-extrabold tracking-[-0.04em] mt-1 mb-6 text-accent">
          {formatCOP(monto)}
        </div>

        <div className="flex flex-col gap-3">
          <Stat label="Cuota mensual aprox." value={formatCOP(cuota)} />
          <Stat label="Tasa nominal mes" value="2.0%" />
          <Stat label="Plazo" value={`${plazo} meses`} />
        </div>

        <div className="h-px bg-white/10 my-6"></div>

        {submitted ? (
          <div className="bg-accent/10 border border-accent/30 rounded-xl p-5 text-center">
            <p className="text-accent font-semibold mb-1">¡Recibido!</p>
            <p className="text-sm text-white/70">
              Un asesor te contactará en menos de 15 minutos.
            </p>
          </div>
        ) : (
          <form className="flex flex-col gap-2.5" onSubmit={onSubmit}>
            <ContactInput
              type="text"
              placeholder="Tu nombre completo"
              value={form.nombre}
              onChange={(v) => setForm({ ...form, nombre: v })}
            />
            <ContactInput
              type="tel"
              placeholder="WhatsApp · +57 ___ ___ ____"
              value={form.telefono}
              onChange={(v) => setForm({ ...form, telefono: v })}
            />
            <ContactInput
              type="email"
              placeholder="Correo electrónico"
              value={form.email}
              onChange={(v) => setForm({ ...form, email: v })}
            />
            <button
              type="submit"
              className="mt-1.5 inline-flex items-center justify-center gap-2 bg-accent text-white font-semibold text-sm px-4 py-4 rounded-[10px] hover:bg-accent-dark transition-colors cursor-pointer"
            >
              Solicitar pre-aprobación →
            </button>
          </form>
        )}

        <p className="text-xs text-white/45 mt-3.5 leading-[1.5]">
          Al enviar aceptas nuestros{" "}
          <a href={`${import.meta.env.BASE_URL}/terminos-y-condiciones`} className="text-accent">
            términos
          </a>{" "}
          y la{" "}
          <a href={`${import.meta.env.BASE_URL}/politicas-de-privacidad`} className="text-accent">
            política de privacidad
          </a>
          . Un asesor te contactará en menos de 15 minutos.
        </p>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
  isLast,
}: {
  label: string;
  children: React.ReactNode;
  isLast?: boolean;
}) {
  return (
    <div className={isLast ? "mb-0" : "mb-7"}>
      <div className="flex justify-between items-baseline mb-3 text-sm font-semibold">
        <span>{label}</span>
      </div>
      {children}
    </div>
  );
}

interface SliderProps {
  label: string;
  valueLabel: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (n: number) => void;
  minLabel: string;
  maxLabel: string;
  isLast?: boolean;
}

function Slider({
  label,
  valueLabel,
  min,
  max,
  step,
  value,
  onChange,
  minLabel,
  maxLabel,
  isLast,
}: SliderProps) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className={isLast ? "mb-0" : "mb-7"}>
      <div className="flex justify-between items-baseline mb-3 text-sm font-semibold">
        <span>{label}</span>
        <strong className="text-primary font-mono text-[15px]">
          {valueLabel}
        </strong>
      </div>
      <div className="relative h-1.5">
        <div
          aria-hidden
          className="absolute inset-0 bg-light rounded-full pointer-events-none"
        />
        <div
          aria-hidden
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-primary-light rounded-full pointer-events-none"
          style={{ width: `${pct}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="hero-range absolute inset-0 w-full h-full appearance-none bg-transparent cursor-pointer"
          aria-label={label}
        />
      </div>
      <div className="flex justify-between font-mono text-[11px] text-gray mt-2">
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-3 border-b border-white/[0.08]">
      <span className="text-[13px] text-white/55">{label}</span>
      <span className="text-sm font-semibold font-mono">{value}</span>
    </div>
  );
}

function ContactInput({
  type,
  placeholder,
  value,
  onChange,
}: {
  type: "text" | "tel" | "email";
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required
      className="bg-white/[0.06] border border-white/10 text-white px-4 py-3.5 rounded-[10px] font-sans text-sm placeholder:text-white/40 focus:outline-none focus:border-accent transition-colors"
    />
  );
}
