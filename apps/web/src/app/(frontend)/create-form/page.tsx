'use client';

import { FormCreator } from '@/features/form-creation/components/form/FormCreator';
import { formStore } from '@/features/form-creation/state/formStore';
import { Provider } from 'react-redux';

export default function CreateFormPage() {
    return (
        <Provider store={formStore}>
            <FormCreator />
        </Provider>
    );
}
