import { Draggable } from '@hello-pangea/dnd';
import { Flex, TextInput } from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import { ChangeEventHandler, FocusEventHandler } from 'react';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { deleteOption, selectOptionById, setOption } from '@/features/form-editor/state/options';
import { DragButton } from '../../ui/DragButton';
import { IconButton } from '../../ui/IconButton';

type Props = {
    index: number;
    optionId: string;
};

export function OptionItem({ index, optionId }: Props) {
    const dispatch = useAppDispatch();
    const option = useAppSelector(state => selectOptionById(state, optionId));

    const handleOptionBlur: FocusEventHandler<HTMLInputElement> = event => {
        if (!event.target.value.trim()) {
            dispatch(setOption({ optionId, option: { content: 'Option' } }));
        }
    };

    const handleOptionChange: ChangeEventHandler<HTMLInputElement> = event => {
        dispatch(setOption({ optionId, option: { content: event.target.value } }));
    };

    const handleOptionDelete = () => {
        dispatch(deleteOption({ optionId }));
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
