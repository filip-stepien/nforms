import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { Button, Flex } from '@mantine/core';
import { OptionItem } from './OptionItem';
import { useOptionCreator } from '@/features/form-creation/hooks/useOptionCreator';
import { FieldUpdater } from '@/features/form-creation/lib/types';

export type FieldOption = {
    id: string;
    content: string;
};

type Props = {
    options: FieldOption[];
    onFieldChange: FieldUpdater;
};

export function OptionCreator({ options, onFieldChange }: Props) {
    const {
        lastAddedId,
        onOptionAdd,
        onOptionDelete,
        onOptionUpdate,
        onOptionReorder,
        onOptionSelect
    } = useOptionCreator(options, onFieldChange);

    return (
        <div>
            <span className='text-xs mb-xs text-font-secondary'>Enter options</span>
            <DragDropContext
                onDragEnd={({ destination, source }) =>
                    onOptionReorder(source.index, destination?.index)
                }
            >
                <Droppable droppableId='option-creator'>
                    {provided => (
                        <Flex
                            direction='column'
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                        >
                            {options?.map((opt, i) => (
                                <OptionItem
                                    key={opt.id}
                                    index={i}
                                    option={opt}
                                    selected={opt.id === lastAddedId}
                                    onChange={onOptionUpdate}
                                    onDelete={onOptionDelete}
                                    onSelect={onOptionSelect}
                                />
                            ))}
                            {provided.placeholder}
                        </Flex>
                    )}
                </Droppable>
            </DragDropContext>
            <Button onClick={onOptionAdd} variant='transparent'>
                + Add
            </Button>
        </div>
    );
}
