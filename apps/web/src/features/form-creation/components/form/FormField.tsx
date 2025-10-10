import { Flex } from '@mantine/core';
import { memo } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { FieldHeader } from './FieldHeader';
import { FieldBody } from './FieldBody';

type Props = {
    index: number;
    fieldId: string;
};

export const FormField = memo(function FormField({ index, fieldId }: Props) {
    return (
        <Draggable draggableId={fieldId} index={index}>
            {provided => (
                <Flex
                    direction='column'
                    gap='sm'
                    className='p-lg pl-sm mt-sm rounded-md border-1 border-outline bg-neutral-100'
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                >
                    <FieldHeader dragHandleProps={provided.dragHandleProps} fieldId={fieldId} />
                    <FieldBody fieldId={fieldId} />
                </Flex>
            )}
        </Draggable>
    );
});
