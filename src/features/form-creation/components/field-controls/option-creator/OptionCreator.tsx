import { DragDropContext, Droppable, OnDragEndResponder } from '@hello-pangea/dnd';
import { Button, Flex } from '@mantine/core';
import { OptionItem } from './OptionItem';

export type FieldOption = {
    id: string;
    content: string;
};

type Props = {
    options: FieldOption[];
    onOptionAdd: () => void;
    onOptionUpdate: (id: string, content: string) => void;
    onOptionDelete: (id: string) => void;
    onOptionReorder: (from: number, to: number) => void;
};

export function OptionCreator(props: Props) {
    const { options, onOptionAdd, onOptionDelete, onOptionUpdate, onOptionReorder } = props;

    const handleOptionDragEnd: OnDragEndResponder<string> = ({ destination, source }) => {
        onOptionReorder(source.index, destination?.index ?? source.index);
    };

    return (
        <div>
            <span className='text-xs mb-xs text-font-secondary'>Enter options</span>
            <DragDropContext onDragEnd={handleOptionDragEnd}>
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
                                    option={opt}
                                    index={i}
                                    onChange={onOptionUpdate}
                                    onDelete={onOptionDelete}
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
