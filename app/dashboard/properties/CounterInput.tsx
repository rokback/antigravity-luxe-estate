'use client';

type Props = {
  label: string;
  icon: string;
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
};

export default function CounterInput({
  label,
  icon,
  value,
  min = 0,
  max = 99,
  onChange,
}: Props) {
  const safeValue = Number.isFinite(value) ? value : 0;
  const dec = () => onChange(Math.max(min, safeValue - 1));
  const inc = () => onChange(Math.min(max, safeValue + 1));

  return (
    <div className="flex items-center justify-between">
      <label className="text-sm font-medium text-nordic-dark flex items-center gap-2">
        <span className="material-icons text-nordic-dark/40 text-sm">{icon}</span>
        {label}
      </label>
      <div className="flex items-center border border-nordic-dark/10 rounded-md overflow-hidden bg-white shadow-sm">
        <button
          type="button"
          onClick={dec}
          disabled={safeValue <= min}
          className="w-8 h-8 flex items-center justify-center hover:bg-clear-day text-nordic-dark/60 transition-colors border-r border-nordic-dark/10 disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="decrement"
        >
          −
        </button>
        <input
          type="text"
          readOnly
          value={safeValue}
          className="w-10 text-center border-none bg-transparent text-nordic-dark p-0 focus:ring-0 text-sm font-medium outline-none"
        />
        <button
          type="button"
          onClick={inc}
          disabled={safeValue >= max}
          className="w-8 h-8 flex items-center justify-center hover:bg-clear-day text-nordic-dark/60 transition-colors border-l border-nordic-dark/10 disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="increment"
        >
          +
        </button>
      </div>
    </div>
  );
}
