'use client';

import { FormCreator } from '@/features/form-editor/components/FormCreator';
import StoreProvider from '@/providers/StoreProvider';

export default function CreateFormPage() {
    return (
        <StoreProvider>
            <FormCreator />
        </StoreProvider>
    );
}
