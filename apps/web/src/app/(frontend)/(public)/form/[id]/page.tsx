type Props = {
    params: Promise<{ id: string }>;
};

export default async function DisplayFormPage({ params }: Props) {
    const { id } = await params;

    return <p>Form: {id}</p>;
}
