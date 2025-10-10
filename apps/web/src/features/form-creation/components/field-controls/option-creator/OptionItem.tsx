import { Draggable } from '@hello-pangea/dnd';
import { Flex, TextInput } from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import { IconButton } from '../../ui/IconButton';
import { FieldOption } from './OptionCreator';
import { FocusEventHandler, useEffect, useRef } from 'react';
import { DragButton } from '../../ui/DragButton';
import { useOptionCreator } from '@/features/form-creation/hooks/useOptionCreator';

type Props = {
    option: FieldOption;
    fieldId: string;
    index: number;
};

export function OptionItem({ option, index, fieldId }: Props) {
    const { lastAddedId, onOptionUpdate, onOptionDelete, onOptionSelect } =
        useOptionCreator(fieldId);
    const inputRef = useRef<HTMLInputElement>(null);
    const selected = lastAddedId === option.id;

    useEffect(() => {
        if (selected) {
            inputRef.current?.select();
            onOptionSelect();
        }
    }, [selected, onOptionSelect]);

    const handleOptionBlur: FocusEventHandler<HTMLInputElement> = event => {
        if (!event.target.value.trim()) {
            onOptionUpdate(option.id, 'Option');
        }
    };

    return (
        <Draggable draggableId={option.id} index={index}>
            {provided => (
                <Flex
                    gap='sm'
                    className='py-2'
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                >
                    <DragButton dragHandleProps={provided.dragHandleProps} />
                    <TextInput
                        ref={inputRef}
                        value={option.content}
                        onChange={e => onOptionUpdate(option.id, e.target.value)}
                        onBlur={handleOptionBlur}
                        placeholder='Option...'
                        className='flex-1'
                    />
                    <IconButton
                        icon={IconX}
                        variant='transparent'
                        color='red'
                        onClick={() => onOptionDelete(option.id)}
                    />
                </Flex>
            )}
        </Draggable>
    );
}
