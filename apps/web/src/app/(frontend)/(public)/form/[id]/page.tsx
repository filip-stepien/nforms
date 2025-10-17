import { Form } from '@/features/form-display/components/Form';
import { getParsedForm } from '@/features/form-display/lib/data';
import { notFound } from 'next/navigation';

type Props = {
    params: Promise<{ id: string }>;
};

export default async function DisplayFormPage({ params }: Props) {
    try {
        const { id } = await params;
        const parsedForm = await getParsedForm(id);
        return <Form parsedForm={parsedForm} />;
    } catch {
        notFound();
    }
}
