'use client';

import { useTransition } from 'react';
import { togglePropertyActive } from './actions';

type Props = {
  id: string;
  isActive: boolean;
  labels: {
    deactivate: string;
    reactivate: string;
    confirmDeactivate: string;
    confirmReactivate: string;
  };
};

export default function PropertyActiveToggle({ id, isActive, labels }: Props) {
  const [pending, startTransition] = useTransition();

  function onClick() {
    const next = !isActive;
    const message = next ? labels.confirmReactivate : labels.confirmDeactivate;
    if (!window.confirm(message)) return;

    startTransition(async () => {
      await togglePropertyActive(id, next);
    });
  }

  const label = isActive ? labels.deactivate : labels.reactivate;
  // El ícono refleja el ESTADO actual: ojo abierto = visible/activa, ojo tachado = oculta/desactivada.
  const icon = isActive ? 'visibility' : 'visibility_off';
  const color = isActive
    ? 'text-nordic-dark/60 hover:text-red-600 hover:bg-red-50'
    : 'text-nordic-dark/60 hover:text-mosque hover:bg-hint-of-green/40';

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      title={label}
      className={`p-2 rounded-lg transition-all ${color} disabled:opacity-40 disabled:cursor-not-allowed`}
    >
      <span className="material-icons text-xl">{icon}</span>
    </button>
  );
}
