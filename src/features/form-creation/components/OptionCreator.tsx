import { OptionCreatorRef, useOptionCreator } from '../hooks/useOptionCreator';
import { DragDropContext, Droppable, OnDragEndResponder } from '@hello-pangea/dnd';
import { OptionItem } from './OptionItem';
import { Button, Flex } from '@mantine/core';
import { Ref } from 'react';

type Props = {
    ref?: Ref<OptionCreatorRef>;
};

export function OptionCreator({ ref }: Props) {
    const { options, addOption, updateOption, deleteOption, reorderOption } = useOptionCreator(ref);

    const handleOptionDragEnd: OnDragEndResponder<string> = ({ destination, source }) => {
        reorderOption(source.index, destination?.index ?? source.index);
    };

    return (
        <div>
            <span className='text-xs mb-xs text-font-secondary'>Enter options</span>
            <DragDropContext onDragEnd={handleOptionDragEnd}>
                <Droppable droppableId='droppable'>
                    {provided => (
                        <Flex
                            direction='column'
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                        >
                            {options.map((opt, i) => (
                                <OptionItem
                                    key={opt.id}
                                    option={opt}
                                    index={i}
                                    onChange={updateOption}
                                    onDelete={deleteOption}
                                />
                            ))}
                            {provided.placeholder}
                        </Flex>
                    )}
                </Droppable>
            </DragDropContext>
            <Button onClick={addOption} variant='transparent'>
                + Add
            </Button>
        </div>
    );
}
