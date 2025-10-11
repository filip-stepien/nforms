'use client';

import { FormCreator } from '@/features/form-creation/components/form/FormCreator';
import StoreProvider from '@/providers/StoreProvider';

export default function CreateFormPage() {
    return (
        <StoreProvider>
            <FormCreator />
        </StoreProvider>
    );
}
