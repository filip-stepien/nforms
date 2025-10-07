import { Flex, TextInput, Menu, Stack } from '@mantine/core';
import { IconAdjustments, IconTrash } from '@tabler/icons-react';
import { DragButton } from '../ui/DragButton';
import { IconButton } from '../ui/IconButton';
import { JSX, ChangeEventHandler, FocusEventHandler, useEffect, useRef } from 'react';
import { DraggableProvidedDragHandleProps } from '@hello-pangea/dnd';
import { FieldUpdater } from '../../lib/types';

type Props = {
    title: string;
    selected?: boolean;
    settingsComponent?: JSX.Element;
    dragHandleProps: DraggableProvidedDragHandleProps | null;
    onFieldChange: FieldUpdater;
    onDelete: () => void;
    onSelect: () => void;
};

export function FieldHeader(props: Props) {
    const titleRef = useRef<HTMLInputElement>(null);

    const {
        dragHandleProps,
        title,
        selected,
        settingsComponent,
        onDelete,
        onSelect,
        onFieldChange
    } = props;

    useEffect(() => {
        if (selected) {
            titleRef.current?.select();
            onSelect();
        }
    }, [selected, onSelect]);

    const handleTitleChange: ChangeEventHandler<HTMLInputElement> = event => {
        onFieldChange(prev => ({ ...prev, title: event.target.value }));
    };

    const handleTitleBlur: FocusEventHandler<HTMLInputElement> = event => {
        if (!event.target.value.trim()) {
            onFieldChange(prev => ({ ...prev, title: 'Untitled question' }));
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
            {settingsComponent && (
                <Menu shadow='md' width={300} position='bottom-end'>
                    <Menu.Target>
                        <IconButton variant='light' icon={IconAdjustments} />
                    </Menu.Target>
                    <Menu.Dropdown>
                        <Menu.Label>Field settings</Menu.Label>
                        <Stack className='p-sm'>{settingsComponent}</Stack>
                    </Menu.Dropdown>
                </Menu>
            )}
            <IconButton icon={IconTrash} variant='light' color='red' onClick={onDelete} />
        </Flex>
    );
}
