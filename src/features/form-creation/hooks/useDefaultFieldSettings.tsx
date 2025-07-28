import { Ref, useImperativeHandle, useState } from 'react';

export type DefaultFieldSettings = {
    required: boolean;
};

export type DefaultFieldSettingsRef = {
    getDefaultSettings: () => DefaultFieldSettings;
};

export function useDefaultFieldSettings(ref?: Ref<DefaultFieldSettingsRef>) {
    const [defaultSettings, setDefaultSettings] = useState<DefaultFieldSettings>({
        required: true
    });

    useImperativeHandle(
        ref,
        () => ({
            getDefaultSettings: () => defaultSettings
        }),
        [defaultSettings]
    );

    return { defaultSettings, setDefaultSettings };
}
