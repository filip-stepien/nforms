import { Stack, Flex, TextInput, ActionIcon, CloseIcon, Button } from '@mantine/core';
import { Ref, ChangeEventHandler, MouseEventHandler } from 'react';
import { OptionCreatorRef, useOptionCreator } from '../hooks/useOptionCreator';

type Props = {
    ref?: Ref<OptionCreatorRef>;
};

export function OptionCreator({ ref }: Props) {
    const { options, addOption, updateOption, deleteOption } = useOptionCreator(ref);

    const handleOptionChange: ChangeEventHandler<HTMLInputElement> = event => {
        const { id, value } = event.target;
        updateOption(id, value);
    };

    const handleOptionDelete: MouseEventHandler<HTMLButtonElement> = event => {
        deleteOption(event.currentTarget.id);
    };

    return (
        <div>
            <div className='text-xs mb-xs text-font-secondary'>Enter options</div>
            <Stack>
                {options.map((opt, i) => (
                    <Flex key={opt.id} align='center' gap='sm'>
                        <TextInput
                            id={opt.id}
                            value={opt.content}
                            onChange={handleOptionChange}
                            placeholder={`Option ${i + 1}`}
                            className='flex-1'
                        />
                        <ActionIcon
                            id={opt.id}
                            className='size-[36px]'
                            variant='transparent'
                            color='red'
                            onClick={handleOptionDelete}
                        >
                            <CloseIcon />
                        </ActionIcon>
                    </Flex>
                ))}
                <Button onClick={addOption}>+ Add option</Button>
            </Stack>
        </div>
    );
}
