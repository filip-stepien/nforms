import { Draggable } from '@hello-pangea/dnd';
import { Flex, TextInput } from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import { IconButton } from '../../ui/IconButton';
import { ChangeEventHandler, FocusEventHandler } from 'react';
import { DragButton } from '../../ui/DragButton';
import { useAppSelector } from '@/hooks/useAppSelector';
import { selectOption } from '@/features/form-creation/state/selectors';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { deleteOption, setOption } from '@/features/form-creation/state/slices/options';

type Props = {
    index: number;
    optionId: string;
    fieldId: string;
};

export function OptionItem({ index, optionId, fieldId }: Props) {
    const dispatch = useAppDispatch();
    const option = useAppSelector(state => selectOption(state, fieldId, optionId));

    const handleOptionBlur: FocusEventHandler<HTMLInputElement> = event => {
        if (!event.target.value.trim()) {
            dispatch(setOption({ fieldId, optionId, option: { content: 'Option' } }));
        }
    };

    const handleOptionChange: ChangeEventHandler<HTMLInputElement> = event => {
        dispatch(setOption({ fieldId, optionId, option: { content: event.target.value } }));
    };

    const handleOptionDelete = () => {
        dispatch(deleteOption({ fieldId, optionId }));
    };

    return (
        <Draggable draggableId={optionId} index={index}>
            {provided => (
                <Flex
                    gap='sm'
                    className='py-2'
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                >
                    <DragButton dragHandleProps={provided.dragHandleProps} />
                    <TextInput
                        value={option.content}
                        onChange={handleOptionChange}
                        onBlur={handleOptionBlur}
                        placeholder='Option...'
                        className='flex-1'
                    />
                    <IconButton
                        icon={IconX}
                        variant='transparent'
                        color='red'
                        onClick={handleOptionDelete}
                    />
                </Flex>
            )}
        </Draggable>
    );
}
