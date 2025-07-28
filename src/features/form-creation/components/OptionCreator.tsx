import { Stack, Flex, TextInput, ActionIcon, CloseIcon, Button } from '@mantine/core';
import { Ref, useState, useImperativeHandle, ChangeEventHandler, MouseEventHandler } from 'react';
import { v4 as uuid } from 'uuid';

export type OptionCreatorRef = {
    getOptions: () => FieldOption[];
};

export type FieldOption = {
    id: string;
    content: string;
};

export function OptionCreator({ ref }: { ref?: Ref<OptionCreatorRef> }) {
    const [options, setOptions] = useState<FieldOption[]>([]);

    useImperativeHandle(
        ref,
        () => ({
            getOptions: () => options
        }),
        [options]
    );

    const handleAddOption = () => {
        setOptions(prev => [...prev, { id: uuid(), content: '' }]);
    };

    const handleOptionChange: ChangeEventHandler<HTMLInputElement> = event => {
        const { id, value } = event.target;
        setOptions(prev => prev.map(opt => (opt.id === id ? { ...opt, content: value } : opt)));
    };

    const handleOptionDelete: MouseEventHandler<HTMLButtonElement> = event => {
        const id = event.currentTarget.id;
        setOptions(prev => prev.filter(opt => opt.id !== id));
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
                <Button onClick={handleAddOption}>+ Add option</Button>
            </Stack>
        </div>
    );
}
