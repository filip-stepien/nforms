import { Draggable } from '@hello-pangea/dnd';
import { TextInput } from '@mantine/core';
import { IconGripVertical, IconX } from '@tabler/icons-react';
import { IconButton } from '../../ui/IconButton';
import { FieldOption } from './OptionCreator';
import { FocusEventHandler, useEffect, useRef } from 'react';

type Props = {
    option: FieldOption;
    index: number;
    onChange: (id: string, content: string) => void;
    onDelete: (id: string) => void;
};

export function OptionItem({ option, index, onChange, onDelete }: Props) {
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.select();
    }, []);

    const handleOptionBlur: FocusEventHandler<HTMLInputElement> = event => {
        if (!event.target.value.trim()) {
            onChange(option.id, 'Option');
        }
    };

    return (
        <Draggable draggableId={option.id} index={index}>
            {provided => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className='flex items-center gap-sm py-2'
                >
                    <div {...provided.dragHandleProps} className='w-[36px] grid place-items-center'>
                        <IconGripVertical
                            className='text-icon cursor-grab'
                            stroke={1.5}
                            size={20}
                        />
                    </div>
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
                </div>
            )}
        </Draggable>
    );
}
