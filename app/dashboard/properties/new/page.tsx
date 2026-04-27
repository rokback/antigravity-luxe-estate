import { requireAdmin } from '@/lib/auth/roles';
import { getTranslations } from '@/i18n';
import PropertyForm from '../PropertyForm';
import { buildFormLabels } from '../formLabels';

export default async function NewPropertyPage() {
  await requireAdmin();
  const t = await getTranslations();
  const labels = buildFormLabels(t, 'create');

  return <PropertyForm mode="create" labels={labels} />;
}
