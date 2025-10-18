import { Flex } from '@mantine/core';
import { FormField } from './FormField';
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import { useFormCreateAction } from '../../hooks/useFormCreateAction';
import { useFormStatusEffect } from '../../hooks/useFormStatusEffect';
import { FormHeader } from './FormHeader';
import { FormActions } from './FormActions';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { reorderField, selectFields } from '../../state/slices/fields';
import { FormSettings } from './FormSettings';

export function FormCreator() {
    const { status, action, isLoading } = useFormCreateAction();
    const fields = useAppSelector(state => selectFields(state));
    const dispatch = useAppDispatch();

    useFormStatusEffect(status);

    const handleDragEnd = ({ source, destination }: DropResult) => {
        dispatch(reorderField({ from: source.index, to: destination?.index }));
    };

    return (
        <form action={action}>
            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId='form-creator'>
                    {provided => (
                        <Flex
                            direction='column'
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                        >
                            <Flex gap='sm'>
                                <FormHeader />
                                <FormSettings />
                            </Flex>
                            {fields.map((field, index) => (
                                <FormField key={field.id} index={index} fieldId={field.id} />
                            ))}
                            {provided.placeholder}
                            <FormActions isLoading={isLoading} />
                        </Flex>
                    )}
                </Droppable>
            </DragDropContext>
        </form>
    );
}
