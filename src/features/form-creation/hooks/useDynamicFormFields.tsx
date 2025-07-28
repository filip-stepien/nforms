import { useRef, useCallback, createRef, RefObject } from 'react';
import { useRerender } from './useRerender';
import { FormFieldRef } from './useFormField';

export function useDynamicFormFields() {
    const fieldRefs = useRef<RefObject<FormFieldRef | null>[]>([]);
    const rerender = useRerender();

    const addField = useCallback(() => {
        fieldRefs.current.push(createRef<FormFieldRef>());
        rerender();
    }, [rerender]);

    const getFieldData = useCallback(() => {
        return fieldRefs.current
            .map(ref => ref.current)
            .filter(Boolean)
            .map(current => ({
                title: current!.getTitle(),
                fieldType: current!.getFieldType(),
                options: current!.getOptions(),
                settings: current!.getSettings()
            }));
    }, []);

    return {
        fieldRefs: fieldRefs.current,
        addField,
        getFieldData
    };
}
