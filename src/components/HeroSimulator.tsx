import { useState } from "react";

const formatCOP = (value: number) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  })
    .format(value)
    .replace("COP", "$")
    .trim();

const VEHICLE_MIN = 10_000_000;
const VEHICLE_MAX = 120_000_000;
const TERM_MIN = 6;
const TERM_MAX = 60;
const LOAN_RATIO = 0.5;

export default function HeroSimulator() {
  const [vehicleValue, setVehicleValue] = useState(45_000_000);
  const [term, setTerm] = useState(24);

  const loanAmount = Math.round(vehicleValue * LOAN_RATIO);

  const vehiclePct =
    ((vehicleValue - VEHICLE_MIN) / (VEHICLE_MAX - VEHICLE_MIN)) * 100;
  const termPct = ((term - TERM_MIN) / (TERM_MAX - TERM_MIN)) * 100;

  return (
    <div className="bg-white rounded-[28px] p-8 shadow-hero relative">
      <div
        aria-hidden
        className="absolute -top-5 -right-5 w-[120px] h-[120px] bg-accent rounded-full -z-10 opacity-15 blur-[40px]"
      />

      <div className="flex justify-between items-center mb-6">
        <div className="text-lg font-bold">Simula tu préstamo</div>
        <span className="bg-accent/10 text-accent text-[11px] px-2.5 py-1 rounded-full font-mono tracking-wider uppercase font-semibold">
          En vivo
        </span>
      </div>

      <SliderRow
        label="Valor de tu vehículo"
        valueLabel={formatCOP(vehicleValue)}
        min={VEHICLE_MIN}
        max={VEHICLE_MAX}
        step={500_000}
        value={vehicleValue}
        pct={vehiclePct}
        onChange={setVehicleValue}
      />

      <SliderRow
        label="Plazo del préstamo"
        valueLabel={`${term} meses`}
        min={TERM_MIN}
        max={TERM_MAX}
        step={1}
        value={term}
        pct={termPct}
        onChange={setTerm}
      />

      <div className="bg-dark rounded-2xl p-6 mt-6 flex justify-between items-center">
        <div>
          <div className="text-xs text-white/60 font-mono tracking-wider uppercase">
            Recibes hasta
          </div>
          <div className="text-4xl font-extrabold text-white tracking-tight mt-1">
            <span className="text-accent">{formatCOP(loanAmount)}</span>
          </div>
        </div>
      </div>

      <a
        href={`${import.meta.env.BASE_URL}simulador`}
        className="w-full justify-center mt-5 inline-flex items-center gap-2 bg-primary text-white font-semibold text-sm px-[18px] py-2.5 rounded-[10px] hover:bg-primary-dark transition-colors"
      >
        Solicitar este préstamo
      </a>
    </div>
  );
}

interface SliderRowProps {
  label: string;
  valueLabel: string;
  min: number;
  max: number;
  step: number;
  value: number;
  pct: number;
  onChange: (n: number) => void;
}

function SliderRow({
  label,
  valueLabel,
  min,
  max,
  step,
  value,
  pct,
  onChange,
}: SliderRowProps) {
  return (
    <div className="mb-5">
      <div className="text-[13px] font-semibold mb-2 flex justify-between">
        <span>{label}</span>
        <span className="text-primary font-mono">{valueLabel}</span>
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
    </div>
  );
}
