'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import { updateUserRole } from './actions';
import type { UserRole } from '@/lib/auth/roles';

type Labels = {
  admin: string;
  user: string;
  saving: string;
  cannotDemoteSelf: string;
  saved: string;
  error: string;
  changeRole: string;
};

export function RoleSelector({
  userId,
  initialRole,
  isSelf,
  highlight,
  labels,
}: {
  userId: string;
  initialRole: UserRole;
  isSelf: boolean;
  highlight?: boolean;
  labels: Labels;
}) {
  const [role, setRole] = useState<UserRole>(initialRole);
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<
    { kind: 'ok' | 'err'; text: string } | null
  >(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  function pick(next: UserRole) {
    setOpen(false);
    if (next === role) return;
    if (isSelf && next !== 'admin') {
      setFeedback({ kind: 'err', text: labels.cannotDemoteSelf });
      return;
    }
    const previous = role;
    setRole(next);
    setFeedback(null);
    startTransition(async () => {
      const result = await updateUserRole(userId, next);
      if (!result.ok) {
        setRole(previous);
        setFeedback({
          kind: 'err',
          text:
            result.error === 'cannot_demote_self'
              ? labels.cannotDemoteSelf
              : labels.error,
        });
        return;
      }
      setFeedback({ kind: 'ok', text: labels.saved });
    });
  }

  const buttonBase =
    'inline-flex items-center px-4 py-2 text-xs font-medium rounded-lg transition-colors w-full md:w-auto justify-center';
  const buttonStyle = highlight
    ? 'bg-mosque text-white shadow-md hover:bg-mosque/90 focus:outline-none'
    : 'border border-nordic-dark/10 bg-white text-nordic-dark hover:bg-nordic-dark hover:text-white focus:outline-none shadow-sm';

  return (
    <div className="w-full flex flex-col items-end gap-1.5 relative" ref={containerRef}>
      <button
        type="button"
        disabled={pending}
        onClick={() => setOpen((v) => !v)}
        className={`${buttonBase} ${buttonStyle} disabled:opacity-60 disabled:cursor-not-allowed`}
      >
        {labels.changeRole}
        <span className="material-icons text-[16px] ml-2">
          {open ? 'expand_less' : 'expand_more'}
        </span>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute top-full right-0 mt-2 w-44 rounded-lg shadow-card bg-mosque ring-1 ring-black/5 z-50 overflow-hidden"
        >
          <RoleMenuItem
            label={labels.admin}
            icon="shield"
            active={role === 'admin'}
            onClick={() => pick('admin')}
          />
          <RoleMenuItem
            label={labels.user}
            icon="person"
            active={role === 'user'}
            disabled={isSelf}
            onClick={() => pick('user')}
          />
        </div>
      )}

      <span className="text-[11px] min-h-[1rem]">
        {pending && <span className="text-nordic-muted">{labels.saving}</span>}
        {!pending && feedback?.kind === 'ok' && (
          <span className="text-mosque font-medium">{feedback.text}</span>
        )}
        {!pending && feedback?.kind === 'err' && (
          <span className="text-red-600">{feedback.text}</span>
        )}
      </span>
    </div>
  );
}

function RoleMenuItem({
  label,
  icon,
  active,
  disabled,
  onClick,
}: {
  label: string;
  icon: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  const base =
    'flex items-center w-full text-left px-4 py-3 text-xs transition-colors';
  const tone = disabled
    ? 'text-white/40 cursor-not-allowed'
    : active
      ? 'text-white font-medium bg-white/15 hover:bg-white/20'
      : 'text-white/80 hover:bg-white/10 hover:text-white';

  return (
    <button
      type="button"
      role="menuitem"
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`${base} ${tone}`}
    >
      <span
        className={`material-icons text-sm mr-3 ${disabled ? 'text-white/30' : 'text-white/70'}`}
      >
        {icon}
      </span>
      {label}
    </button>
  );
}
