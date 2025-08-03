import { Draggable } from '@hello-pangea/dnd';
import { Flex, TextInput } from '@mantine/core';
import { IconGripVertical, IconX } from '@tabler/icons-react';
import { IconButton } from '../../ui/IconButton';
import { FieldOption } from './OptionCreator';
import { FocusEventHandler, useEffect, useRef } from 'react';
import { DragButton } from '../../ui/DragButton';
import { clearSelection } from '@/features/form-creation/lib/utils';

type Props = {
    option: FieldOption;
    index: number;
    selected: boolean;
    onSelect: () => void;
    onChange: (id: string, content: string) => void;
    onDelete: (id: string) => void;
};

export function OptionItem({ option, index, selected, onChange, onDelete, onSelect }: Props) {
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (selected) {
            inputRef.current?.select();
            onSelect();
        }
    }, [selected]);

    const handleOptionBlur: FocusEventHandler<HTMLInputElement> = event => {
        if (!event.target.value.trim()) {
            onChange(option.id, 'Option');
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
                        onChange={e => onChange(option.id, e.target.value)}
                        onBlur={handleOptionBlur}
                        placeholder='Option...'
                        className='flex-1'
                    />
                    <IconButton
                        icon={IconX}
                        variant='transparent'
                        color='red'
                        onClick={() => onDelete(option.id)}
                    />
                </Flex>
            )}
        </Draggable>
    );
}
