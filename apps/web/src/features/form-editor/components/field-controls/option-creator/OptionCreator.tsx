import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import { Button, Flex } from '@mantine/core';
import { OptionItem } from './OptionItem';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { v4 as uuid } from 'uuid';
import {
    addOption,
    reorderOption,
    selectOptionsByFieldId
} from '@/features/form-editor/state/options';

type Props = {
    fieldId: string;
};

export function OptionCreator({ fieldId }: Props) {
    const dispatch = useAppDispatch();
    const options = useAppSelector(selectOptionsByFieldId(fieldId));

    const handleDragEnd = ({ source, destination }: DropResult) => {
        dispatch(reorderOption({ fieldId, from: source.index, to: destination?.index }));
    };

    const handleOptionAdd = () => {
        dispatch(
            addOption({
                id: uuid(),
                fieldId,
                content: `Option ${options.length + 1}`
            })
        );
    };

    return (
        <div>
            <span className='mb-xs text-font-secondary text-xs'>Enter options</span>
            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId='option-creator'>
                    {provided => (
                        <Flex
                            direction='column'
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                        >
                            {options?.map((option, i) => (
                                <OptionItem key={option.id} index={i} optionId={option.id} />
                            ))}
                            {provided.placeholder}
                        </Flex>
                    )}
                </Droppable>
            </DragDropContext>
            <Button onClick={handleOptionAdd} variant='transparent'>
                + Add
            </Button>
        </div>
    );
}
