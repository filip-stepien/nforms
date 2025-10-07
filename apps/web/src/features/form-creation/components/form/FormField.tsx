import { Flex, Stack } from '@mantine/core';
import { memo, JSX } from 'react';
import { TextFieldSettings } from '../field-settings/TextFieldSettings';
import { OptionCreator } from '../field-controls/option-creator/OptionCreator';
import { Draggable } from '@hello-pangea/dnd';
import { FieldHeader } from './FieldHeader';
import { FieldBody } from './FieldBody';
import { SelectionFieldSettings } from '../field-settings/SelectionFieldSettings';
import { RulesCreator } from '../field-controls/rules-creator/RulesCreator';
import { ControlsMap, Field, FieldType, RuleConfigMap, SettingsMap } from '../../lib/types';
import { useFormFieldHandlers } from '../../hooks/useFormFieldHandlers';
import { ruleConfig } from '../../lib/constants';

type Props = {
    index: number;
    field: Field;
};

export const FormField = memo(function FormField({ index, field }: Props) {
    const { isSelected, onDelete, onSelect, onChange } = useFormFieldHandlers(field);

    const dynamicValuesRuleConfig: RuleConfigMap = {
        ...ruleConfig,
        [FieldType.SELECTION]: ruleConfig[FieldType.SELECTION].map(cfg =>
            cfg.condition === 'answer' && field.type === FieldType.SELECTION
                ? {
                      ...cfg,
                      values: (field.controls as ControlsMap[FieldType.SELECTION]).options.map(
                          ctrl => ctrl.id
                      )
                  }
                : cfg
        )
    };

    const settingsComponents: Record<FieldType, JSX.Element> = {
        [FieldType.TEXT]: (
            <TextFieldSettings
                settings={field.settings as SettingsMap[FieldType.TEXT]}
                onFieldChange={onChange}
            />
        ),
        [FieldType.SELECTION]: (
            <SelectionFieldSettings
                settings={field.settings as SettingsMap[FieldType.SELECTION]}
                onFieldChange={onChange}
            />
        )
    };

    const controlsComponents: Record<FieldType, JSX.Element> = {
        [FieldType.TEXT]: (
            <RulesCreator
                fieldId={field.id}
                fieldType={field.type}
                rules={field.controls.rules}
                ruleConfig={dynamicValuesRuleConfig}
                onFieldChange={onChange}
            />
        ),
        [FieldType.SELECTION]: (
            <Stack>
                <RulesCreator
                    fieldId={field.id}
                    fieldType={field.type}
                    rules={field.controls.rules}
                    ruleConfig={dynamicValuesRuleConfig}
                    onFieldChange={onChange}
                />
                <OptionCreator
                    options={(field.controls as ControlsMap[FieldType.SELECTION]).options}
                    onFieldChange={onChange}
                />
            </Stack>
        )
    };

    console.count('rerender');

    return (
        <Draggable draggableId={field.id} index={index}>
            {provided => (
                <Flex
                    direction='column'
                    gap='sm'
                    className='p-lg pl-sm mt-sm rounded-md border-1 border-outline bg-neutral-100'
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                >
                    <FieldHeader
                        title={field.title}
                        selected={isSelected}
                        settingsComponent={settingsComponents[field.type]}
                        dragHandleProps={provided.dragHandleProps}
                        onFieldChange={onChange}
                        onDelete={onDelete}
                        onSelect={onSelect}
                    />
                    <FieldBody
                        fieldType={field.type}
                        onFieldChange={onChange}
                        controlsComponent={controlsComponents[field.type]}
                    />
                </Flex>
            )}
        </Draggable>
    );
});
