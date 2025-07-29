import { useCallback, createRef, RefObject, useState } from 'react';
import { FormFieldRef } from './useFormField';
import { v4 as uuid } from 'uuid';
import { useListState } from '@mantine/hooks';

export type DynamicFormField = {
    id: string;
    ref: RefObject<FormFieldRef | null>;
};

export function useDynamicFormFields() {
    const [fields, handlers] = useListState<DynamicFormField>([]);

    const addField = useCallback(() => {
        handlers.append({
            id: uuid(),
            ref: createRef<FormFieldRef>()
        });
    }, []);

    const deleteField = useCallback((id: string) => {
        handlers.filter(field => field.id !== id);
    }, []);

    const getFieldData = useCallback(() => {
        return fields
            .map(({ ref }) => ref.current)
            .filter(Boolean)
            .map(current => ({
                title: current!.getTitle(),
                fieldType: current!.getFieldType(),
                options: current!.getOptions(),
                settings: current!.getSettings()
            }));
    }, [fields]);

    return {
        fields,
        addField,
        deleteField,
        getFieldData
    };
}
