import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { Button, Flex } from '@mantine/core';
import { OptionItem } from './OptionItem';
import { useOptionCreator } from '@/features/form-creation/hooks/useOptionCreator';
import { useFormSelector } from '@/features/form-creation/hooks/useFormSelector';
import { selectFieldById } from '@/features/form-creation/state/formFieldsSlice';
import { FieldType } from '@/features/form-creation/lib/types';

export type FieldOption = {
    id: string;
    content: string;
};

type Props = {
    fieldId: string;
};

export function OptionCreator({ fieldId }: Props) {
    const { onOptionAdd, onOptionReorder } = useOptionCreator(fieldId);

    const options = useFormSelector(
        state => selectFieldById<FieldType.SELECTION>(state, fieldId).controls.options
    );

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
                                <OptionItem key={opt.id} index={i} option={opt} fieldId={fieldId} />
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
