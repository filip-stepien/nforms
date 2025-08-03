import { Flex, TextInput, Menu, Stack } from '@mantine/core';
import { IconAdjustments, IconTrash } from '@tabler/icons-react';
import { DragButton } from '../ui/DragButton';
import { IconButton } from '../ui/IconButton';
import { FieldType } from '../../hooks/useFormFields';
import { ReactNode, ChangeEventHandler, FocusEventHandler, useEffect, useRef } from 'react';
import { DraggableProvidedDragHandleProps } from '@hello-pangea/dnd';

type Props = {
    title: string;
    fieldType: FieldType;
    selected?: boolean;
    settingsComponent: Record<FieldType, ReactNode>;
    dragHandleProps: DraggableProvidedDragHandleProps | null;
    onTitleChange: (title: string) => void;
    onDelete: () => void;
    onSelect: () => void;
};

export function FieldHeader(props: Props) {
    const titleRef = useRef<HTMLInputElement>(null);

    const {
        dragHandleProps,
        title,
        selected,
        fieldType,
        settingsComponent,
        onDelete,
        onSelect,
        onTitleChange
    } = props;

    useEffect(() => {
        if (selected) {
            titleRef.current?.select();
            onSelect();
        }
    }, [selected]);

    const handleTitleChange: ChangeEventHandler<HTMLInputElement> = event => {
        onTitleChange(event.target.value);
    };

    const handleTitleBlur: FocusEventHandler<HTMLInputElement> = event => {
        if (!event.target.value.trim()) {
            onTitleChange('Untitled question');
        }
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
                value={title}
                onChange={handleTitleChange}
                onBlur={handleTitleBlur}
            />
            {fieldType && settingsComponent[fieldType] && (
                <Menu shadow='md' width={300} position='bottom-end'>
                    <Menu.Target>
                        <IconButton variant='light' icon={IconAdjustments} />
                    </Menu.Target>
                    <Menu.Dropdown>
                        <Menu.Label>Field settings</Menu.Label>
                        <Stack className='p-sm'>{settingsComponent[fieldType]}</Stack>
                    </Menu.Dropdown>
                </Menu>
            )}
            <IconButton icon={IconTrash} variant='light' color='red' onClick={onDelete} />
        </Flex>
    );
}
