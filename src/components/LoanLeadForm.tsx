import { useState } from "react";

interface Props {
  vehicleType?: "carro" | "moto";
  variant?: "hero" | "page";
}

const PHONE = "573113547995";

export default function LoanLeadForm({ vehicleType = "carro", variant = "hero" }: Props) {
  const [form, setForm] = useState({
    nombre: "",
    placa: "",
    identificacion: "",
    marcaVersion: "",
    whatsapp: "",
    email: "",
  });

  const isHero = variant === "hero";

  function update<K extends keyof typeof form>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function buildMessage() {
    const tipo = vehicleType === "moto" ? "moto" : "carro";
    return [
      `Hola Prendautos, quiero solicitar un préstamo sobre mi ${tipo}.`,
      "",
      `• Nombre: ${form.nombre || "—"}`,
      `• Placa: ${form.placa || "—"}`,
      `• Identificación del propietario: ${form.identificacion || "—"}`,
      `• Marca y versión: ${form.marcaVersion || "—"}`,
      `• WhatsApp: ${form.whatsapp || "—"}`,
      `• Email: ${form.email || "—"}`,
    ].join("\n");
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = encodeURIComponent(buildMessage());
    const url = `https://wa.me/${PHONE}?text=${text}`;
    window.open(url, "_blank", "noopener");
  }

  const containerClasses = isHero
    ? "bg-white rounded-[28px] p-7 sm:p-8 shadow-hero relative"
    : "bg-white rounded-[28px] p-7 sm:p-10 border border-border";

  return (
    <div className={containerClasses}>
      {isHero && (
        <div
          aria-hidden
          className="absolute -top-5 -right-5 w-[120px] h-[120px] bg-accent rounded-full -z-10 opacity-15 blur-[40px]"
        />
      )}

      <div className="flex justify-between items-center mb-5">
        <div className="text-lg font-bold tracking-tight">
          Solicita tu préstamo
        </div>
        <span className="bg-accent/10 text-accent text-[11px] px-2.5 py-1 rounded-full font-mono tracking-wider uppercase font-semibold">
          30 min
        </span>
      </div>

      <p className="text-[13px] text-gray leading-relaxed mb-5">
        Déjanos los datos de tu {vehicleType === "moto" ? "moto" : "vehículo"} y te
        contactamos por WhatsApp con el avalúo y el monto exacto a prestar.
      </p>

      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        <Field
          label="Nombre"
          value={form.nombre}
          onChange={(v) => update("nombre", v)}
          placeholder="Tu nombre completo"
          autoComplete="name"
          required
        />
        <Field
          label="Placa"
          value={form.placa}
          onChange={(v) => update("placa", v.toUpperCase())}
          placeholder="ABC123"
          required
        />
        <Field
          label="Identificación del propietario"
          value={form.identificacion}
          onChange={(v) => update("identificacion", v)}
          placeholder="Cédula del dueño en la matrícula"
          inputMode="numeric"
          required
        />
        <Field
          label={`Marca y versión ${vehicleType === "moto" ? "de la moto" : "del vehículo"}`}
          value={form.marcaVersion}
          onChange={(v) => update("marcaVersion", v)}
          placeholder={vehicleType === "moto" ? "Ej. Pulsar NS200 2022" : "Ej. Mazda 3 Touring 2019"}
          required
        />
        <Field
          label="WhatsApp"
          value={form.whatsapp}
          onChange={(v) => update("whatsapp", v)}
          placeholder="3xx xxx xxxx"
          inputMode="tel"
          autoComplete="tel"
          required
        />
        <Field
          label="Email"
          value={form.email}
          onChange={(v) => update("email", v)}
          placeholder="tucorreo@ejemplo.com"
          type="email"
          autoComplete="email"
          required
        />

        <button
          type="submit"
          className="mt-2 w-full inline-flex items-center justify-center gap-2 bg-primary text-white font-semibold text-sm px-[18px] py-3 rounded-[10px] hover:bg-primary-dark transition-colors"
        >
          Enviar por WhatsApp
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2a10 10 0 00-8.6 14.9L2 22l5.2-1.4A10 10 0 1012 2z" />
          </svg>
        </button>

        <p className="text-[11px] text-gray text-center mt-1">
          El avalúo depende del modelo, año y estado del vehículo. Te respondemos en minutos.
        </p>
      </form>
    </div>
  );
}

interface FieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  inputMode?: "text" | "tel" | "email" | "numeric" | "url";
  autoComplete?: string;
  required?: boolean;
}

function Field({ label, value, onChange, placeholder, type = "text", inputMode, autoComplete, required }: FieldProps) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[12px] font-semibold text-dark/80 tracking-tight">
        {label}
      </span>
      <input
        type={type}
        inputMode={inputMode}
        autoComplete={autoComplete}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3.5 py-2.5 rounded-[10px] border border-border bg-white text-[14px] text-dark placeholder:text-gray/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-colors"
      />
    </label>
  );
}
