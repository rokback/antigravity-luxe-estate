import { notFound } from 'next/navigation';
import { requireAdmin } from '@/lib/auth/roles';
import { getPropertyById } from '@/lib/properties';
import { getTranslations } from '@/i18n';
import PropertyForm from '../../PropertyForm';
import { buildFormLabels } from '../../formLabels';

type Params = Promise<{ id: string }>;

export default async function EditPropertyPage({
  params,
}: {
  params: Params;
}) {
  await requireAdmin();
  const { id } = await params;
  const property = await getPropertyById(id);
  if (!property) notFound();

  const t = await getTranslations();
  const labels = buildFormLabels(t, 'edit');

  return <PropertyForm mode="edit" initial={property} labels={labels} />;
}
