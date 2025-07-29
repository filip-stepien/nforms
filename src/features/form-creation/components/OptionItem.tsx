import { Draggable } from '@hello-pangea/dnd';
import { TextInput, ActionIcon, CloseIcon } from '@mantine/core';
import { IconGripVertical } from '@tabler/icons-react';
import { FieldOption } from '../hooks/useOptionCreator';

type Props = {
    option: FieldOption;
    index: number;
    onChange: (id: string, content: string) => void;
    onDelete: (id: string) => void;
};

export function OptionItem({ option, index, onChange, onDelete }: Props) {
    return (
        <Draggable draggableId={option.id} index={index}>
            {provided => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className='flex items-center gap-sm py-2'
                >
                    <div {...provided.dragHandleProps}>
                        <IconGripVertical className='text-icon' />
                    </div>
                    <TextInput
                        value={option.content}
                        onChange={e => onChange(option.id, e.target.value)}
                        placeholder='Option...'
                        className='flex-1'
                    />
                    <ActionIcon
                        className='size-[36px]'
                        variant='transparent'
                        color='red'
                        onClick={() => onDelete(option.id)}
                    >
                        <CloseIcon />
                    </ActionIcon>
                </div>
            )}
        </Draggable>
    );
}
