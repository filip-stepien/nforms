import { Form } from '@/features/form-display/components/Form';
import { findFirstFormById, parseForm } from '@/features/form-display/lib/data';
import { notFound } from 'next/navigation';

type Props = {
    params: Promise<{ id: string }>;
};

export default async function DisplayFormPage({ params }: Props) {
    try {
        const { id } = await params;
        const form = await findFirstFormById(id);
        const parsedForm = await parseForm(form);
        return <Form form={parsedForm} />;
    } catch {
        notFound();
    }
}
