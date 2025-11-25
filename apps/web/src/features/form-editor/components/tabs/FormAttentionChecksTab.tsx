import { useAppSelector } from '@/hooks/useAppSelector';
import { selectFields } from '../../state/fields';
import { useRuleSelectValues } from '../../hooks/useRuleSelectValues';
import { useState } from 'react';
import { Badge, Group, NumberInput, Select, Stack } from '@mantine/core';
import { ActionButton } from '../ui/ActionButton';
import { IconPlus, IconTrash, IconX } from '@tabler/icons-react';
import { IconButton } from '../ui/IconButton';
import { selectCategories } from '../../state/respondent-categories';

function AttentionCheck() {
    const questions = useAppSelector(selectFields);
    const [selected, setSelected] = useState(questions.at(0)!.id);
    const { selectValues } = useRuleSelectValues(selected);

    return (
        <Stack className='p-xl border-outline w-full rounded-sm border bg-neutral-100'>
            <Group justify='space-between' align='flex-start' wrap='nowrap'>
                <Stack>
                    <Group className='flex-1'>
                        <Badge className='min-w-18 rounded-sm' variant='default' size='lg'>
                            SET
                        </Badge>
                        <Select />
                        <Badge className='rounded-sm' variant='default' size='lg'>
                            SCORE TO
                        </Badge>
                        <NumberInput />
                    </Group>
                    <Group>
                        <Badge className='min-w-18 rounded-sm' variant='default' size='lg'>
                            WHEN
                        </Badge>
                        <Select />
                        <Select />
                        <Select />
                    </Group>
                </Stack>
                <IconButton
                    color='red'
                    variant='light'
                    icon={IconTrash}
                    className='justify-self-end'
                />
            </Group>
            <Stack className='p-lg border-outline border bg-white' gap='sm'>
                <Group>
                    <Select
                        value={selected}
                        data={questions.map(q => ({ label: q.title, value: q.id }))}
                        allowDeselect={false}
                        className='w-fit'
                    />
                    <ActionButton
                        label='Add question to group'
                        icon={IconPlus}
                        variant='transparent'
                    />
                </Group>
                <Stack gap={0}>
                    <Group>
                        <span className='text-sm'>Question 1</span>
                        <IconButton icon={IconX} color='red' variant='transparent' />
                    </Group>
                    <Group>
                        <span className='text-sm'>Question 2</span>
                        <IconButton icon={IconX} color='red' variant='transparent' />
                    </Group>
                    <Group>
                        <span className='text-sm'>Question 3</span>
                        <IconButton icon={IconX} color='red' variant='transparent' />
                    </Group>
                </Stack>
            </Stack>
        </Stack>
    );
}

export function FormAttentionChecksTab() {
    const questions = useAppSelector(selectFields);
    const categories = useAppSelector(selectCategories);

    return questions.length > 0 && categories.length > 0 ? (
        <Stack align='center'>
            <AttentionCheck />
            <ActionButton
                label='Add attention check'
                icon={IconPlus}
                variant='transparent'
                className='pt-sm'
            />
        </Stack>
    ) : (
        'Add questions and categories first'
    );
}
