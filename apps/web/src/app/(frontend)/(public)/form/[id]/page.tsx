import { Form } from '@/features/form-display/components/Form';
import { getForm } from '@/features/form-display/lib/data';
import { notFound } from 'next/navigation';

type Props = {
    params: Promise<{ id: string }>;
};

export default async function DisplayFormPage({ params }: Props) {
    try {
        const { id } = await params;
        const form = await getForm(id);
        return <Form form={form} />;
    } catch {
        notFound();
    }
}
