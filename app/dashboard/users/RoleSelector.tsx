'use client';

import { useState, useTransition } from 'react';
import { updateUserRole } from './actions';
import type { UserRole } from '@/lib/auth/roles';

type Labels = {
  admin: string;
  user: string;
  saving: string;
  cannotDemoteSelf: string;
  saved: string;
  error: string;
};

export function RoleSelector({
  userId,
  initialRole,
  isSelf,
  labels,
}: {
  userId: string;
  initialRole: UserRole;
  isSelf: boolean;
  labels: Labels;
}) {
  const [role, setRole] = useState<UserRole>(initialRole);
  const [pending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<
    { kind: 'ok' | 'err'; text: string } | null
  >(null);

  function onChange(next: UserRole) {
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

  return (
    <div className="flex items-center gap-2">
      <select
        value={role}
        disabled={pending}
        onChange={(e) => onChange(e.target.value as UserRole)}
        className="rounded-lg border border-nordic-dark/15 bg-white px-2 py-1.5 text-sm font-medium focus:border-mosque focus:outline-none disabled:opacity-60"
      >
        <option value="user">{labels.user}</option>
        <option value="admin" disabled={isSelf && role !== 'admin'}>
          {labels.admin}
        </option>
      </select>
      <span className="text-xs min-w-[5rem]">
        {pending && (
          <span className="text-nordic-muted">{labels.saving}</span>
        )}
        {!pending && feedback?.kind === 'ok' && (
          <span className="text-mosque">{feedback.text}</span>
        )}
        {!pending && feedback?.kind === 'err' && (
          <span className="text-red-600">{feedback.text}</span>
        )}
      </span>
    </div>
  );
}
