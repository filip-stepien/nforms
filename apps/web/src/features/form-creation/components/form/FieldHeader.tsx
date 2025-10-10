import { Flex, TextInput, Menu, Stack } from '@mantine/core';
import { IconAdjustments, IconTrash } from '@tabler/icons-react';
import { DragButton } from '../ui/DragButton';
import { IconButton } from '../ui/IconButton';
import { ChangeEventHandler, FocusEventHandler, useRef, useEffect, ReactNode } from 'react';
import { DraggableProvidedDragHandleProps } from '@hello-pangea/dnd';
import { useFormSelector } from '../../hooks/useFormSelector';
import {
    deleteField,
    selectFieldById,
    setField,
    setLastAddedId
} from '../../state/formFieldsSlice';
import { useFormDispatch } from '../../hooks/useFormDispatch';
import { FieldType } from '../../lib/types';
import { SelectionFieldSettings } from '../field-settings/SelectionFieldSettings';
import { TextFieldSettings } from '../field-settings/TextFieldSettings';

type Props = {
    dragHandleProps: DraggableProvidedDragHandleProps | null;
    fieldId: string;
};

export function FieldHeader({ dragHandleProps, fieldId }: Props) {
    const dispatch = useFormDispatch();
    const titleRef = useRef<HTMLInputElement>(null);
    const lastAddedId = useFormSelector(state => state.formFields.lastAddedId);
    const fieldType = useFormSelector(state => selectFieldById(state, fieldId).type);
    const fieldTitle = useFormSelector(state => selectFieldById(state, fieldId).title);
    const selected = lastAddedId === fieldId;

    const settingsComponents: Record<FieldType, ReactNode> = {
        [FieldType.TEXT]: <TextFieldSettings fieldId={fieldId} />,
        [FieldType.SELECTION]: <SelectionFieldSettings fieldId={fieldId} />
    };

    useEffect(() => {
        if (selected) {
            titleRef.current?.select();
            dispatch(setLastAddedId(null));
        }
    }, [dispatch, selected]);

    const handleTitleChange: ChangeEventHandler<HTMLInputElement> = event => {
        dispatch(setField({ fieldId, field: { title: event.target.value } }));
    };

    const handleTitleBlur: FocusEventHandler<HTMLInputElement> = event => {
        if (!event.target.value.trim()) {
            dispatch(setField({ fieldId, field: { title: 'Untitled question' } }));
        }
    };

    const handleDelete = () => {
        dispatch(deleteField(fieldId));
    };

    return (
        <Flex align='end' gap='sm'>
            <DragButton dragHandleProps={dragHandleProps} className='h-[36px]' />
            <TextInput
                ref={titleRef}
                variant='unstyled'
                placeholder='Question title...'
                className='flex-1 border-b-1 border-outline font-semibold'
                size='sm'
                value={fieldTitle}
                onChange={handleTitleChange}
                onBlur={handleTitleBlur}
            />
            {settingsComponents[fieldType] && (
                <Menu shadow='md' width={300} position='bottom-end'>
                    <Menu.Target>
                        <IconButton variant='light' icon={IconAdjustments} />
                    </Menu.Target>
                    <Menu.Dropdown>
                        <Menu.Label>Field settings</Menu.Label>
                        <Stack className='p-sm'>{settingsComponents[fieldType]}</Stack>
                    </Menu.Dropdown>
                </Menu>
            )}
            <IconButton icon={IconTrash} variant='light' color='red' onClick={handleDelete} />
        </Flex>
    );
}
