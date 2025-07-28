import { Ref, useImperativeHandle, useRef, useState } from 'react';
import {
    FieldSettingsMap,
    FieldType,
    useFormFieldConfiguration
} from './useFormFieldConfiguration';

export type FormFieldRef = {
    getTitle: () => string;
    getFieldType: () => FieldType;
    getSettings: () => FieldSettingsMap[FieldType] | null;
    getOptions: () => string[] | null;
};

export function useFormField(ref?: Ref<FormFieldRef>) {
    const titleRef = useRef<HTMLInputElement>(null);
    const [fieldType, setFieldType] = useState<FieldType>(FieldType.TEXT);
    const { defaultSettingsRef, controlsComponent, settingsComponent, getSettings, getOptions } =
        useFormFieldConfiguration(fieldType);

    useImperativeHandle(
        ref,
        () => ({
            getFieldType: () => fieldType,
            getTitle: () => titleRef.current?.value ?? '',
            getOptions,
            getSettings
        }),
        [fieldType]
    );

    return {
        titleRef,
        setFieldType,
        defaultSettingsRef,
        controlsComponent,
        settingsComponent
    };
}
