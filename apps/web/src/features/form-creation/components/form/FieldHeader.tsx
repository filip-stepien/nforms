import { Flex, TextInput, Menu, Stack } from '@mantine/core';
import { IconAdjustments, IconTrash } from '@tabler/icons-react';
import { DragButton } from '../ui/DragButton';
import { IconButton } from '../ui/IconButton';
import { ChangeEventHandler, FocusEventHandler, useRef, ReactNode } from 'react';
import { DraggableProvidedDragHandleProps } from '@hello-pangea/dnd';
import { SelectionFieldSettings } from '../field-settings/SelectionFieldSettings';
import { TextFieldSettings } from '../field-settings/TextFieldSettings';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { FieldType, selectFieldById } from '../../state/slices/fields';
import { deleteField, setField } from '../../state/thunks';

type Props = {
    dragHandleProps: DraggableProvidedDragHandleProps | null;
    fieldId: string;
};

export function FieldHeader({ dragHandleProps, fieldId }: Props) {
    const dispatch = useAppDispatch();
    const titleRef = useRef<HTMLInputElement>(null);
    const { title: fieldTitle, type: fieldType } = useAppSelector(state =>
        selectFieldById(state, fieldId)
    );

    // const selected = lastAddedId === fieldId;

    // useEffect(() => {
    //     if (selected) {
    //         titleRef.current?.select();
    //         dispatch(setLastAddedId(null));
    //     }
    // }, [dispatch, selected]);

    const settingsComponents: Record<FieldType, ReactNode> = {
        [FieldType.TEXT]: <TextFieldSettings fieldId={fieldId} />,
        [FieldType.SELECTION]: <SelectionFieldSettings fieldId={fieldId} />
    };

    const handleTitleChange: ChangeEventHandler<HTMLInputElement> = event => {
        dispatch(setField({ fieldId, field: { title: event.target.value } }));
    };

    const handleTitleBlur: FocusEventHandler<HTMLInputElement> = event => {
        if (!event.target.value.trim()) {
            dispatch(setField({ fieldId, field: { title: 'Untitled question' } }));
        }
    };

    const handleDelete = () => {
        dispatch(deleteField({ fieldId }));
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
