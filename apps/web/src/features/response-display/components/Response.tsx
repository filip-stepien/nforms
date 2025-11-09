'use client';

import { Accordion, Badge, Group, Stack, Table, Notification, Flex } from '@mantine/core';
import {
    IconChevronDown,
    IconChevronUp,
    IconCircleCheckFilled,
    IconCircleXFilled,
    IconMessageCircleSearch,
    IconTrash
} from '@tabler/icons-react';
import dayjs from 'dayjs';
import { FieldRuleGroupLog, FieldRuleLog, FormResponse } from '@packages/db/schemas/form-responses';
import { Form } from '@packages/db/schemas/form/form';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { ActionButton } from '@/features/form-editor/components/ui/ActionButton';
import { IconButton } from '@/features/form-editor/components/ui/IconButton';

function LogTree({
    log,
    hasBackground = false
}: {
    log: FieldRuleLog | FieldRuleGroupLog;
    hasBackground?: boolean;
}) {
    if (log.type === 'group') {
        return (
            <Notification
                className={cn(
                    'border-outline py-md rounded-sm border-1 bg-white pl-5 shadow-none before:w-1',
                    hasBackground ? 'bg-neutral-50' : 'bg-white'
                )}
                color={log.result ? 'green' : 'red'}
                withCloseButton={false}
            >
                <Stack gap='sm'>
                    <Badge className='rounded-sm' variant='default'>
                        GROUP ({log.combinator})
                    </Badge>
                    <Stack gap='xs'>
                        {log.logs
                            ?.toSorted((a, b) => {
                                if (a.type === b.type) return 0;
                                return a.type === 'rule' ? -1 : 1;
                            })
                            .map((child, i) => (
                                <LogTree key={i} log={child} hasBackground={!hasBackground} />
                            ))}
                    </Stack>
                </Stack>
            </Notification>
        );
    }

    return (
        <Group gap='xs' className={cn('border-outline p-xs rounded-sm border-1 bg-white')}>
            {log.result ? (
                <IconCircleCheckFilled color='var(--mantine-color-green-filled)' size={18} />
            ) : (
                <IconCircleXFilled color='var(--mantine-color-red-filled)' size={18} />
            )}
            <Group gap='sm'>
                <Badge className='rounded-sm' variant='light' color='dark'>
                    {log.targetFieldTitle}
                </Badge>
                <Badge className='rounded-sm' variant='default'>
                    {log.condition}
                </Badge>
                <Badge className='rounded-sm' variant='default'>
                    {log.operator}
                </Badge>
                <Badge className='rounded-sm' variant='default'>
                    {log.actualValue}
                </Badge>
                <Badge className='rounded-sm' variant='light' color={log.result ? 'green' : 'red'}>
                    EXPECTED: {log.ruleValue}
                </Badge>
            </Group>
        </Group>
    );
}

type Props = {
    response: FormResponse;
    form: Form;
};

export function Response({ response, form }: Props) {
    const [opened, setOpened] = useState<string[]>([]);

    const assignedCategories = response.categoryRules
        .filter(category => category.assigned)
        .map(({ category }, i) => (
            <Badge key={i} color={category.color} className='rounded-sm' variant='light'>
                {category.name}
            </Badge>
        ));

    return (
        <Stack>
            <Group justify='space-between'>
                <Group gap='sm'>
                    <IconMessageCircleSearch stroke={1.5} />
                    <h1 className='text-2xl font-bold'>Response details</h1>
                </Group>
                <ActionButton icon={IconTrash} label='Delete' color='red' variant='light' />
            </Group>
            <Stack gap={0}>
                <div className='border-outline overflow-hidden rounded-t-sm border-1'>
                    <Table
                        variant='vertical'
                        classNames={{ th: 'font-bold w-[180px] bg-neutral-50' }}
                    >
                        <Table.Tbody>
                            <Table.Tr>
                                <Table.Th>Respondent</Table.Th>
                                <Table.Td>{response.email}</Table.Td>
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Th>Submission</Table.Th>
                                <Table.Td>
                                    {dayjs(response.submission).format('HH:mm DD.MM.YYYY')}
                                </Table.Td>
                            </Table.Tr>
                        </Table.Tbody>
                    </Table>
                </div>
                <Accordion
                    defaultValue='Apples'
                    variant='filled'
                    classNames={{
                        item: 'border-outline border-x-1 border-b-1 rounded-t-none rounded-b-sm overflow-hidden',
                        control: 'px-0 flex flex-row-reverse',
                        chevron: 'hidden',
                        label: 'py-0',
                        content: 'p-sm bg-neutral-50',
                        panel: 'border-t-1 border-outline'
                    }}
                >
                    <Accordion.Item value={'xd'}>
                        <Accordion.Control>
                            <Group gap={0} className='text-sm'>
                                <div className='px-sm w-[180px] bg-neutral-50 py-2 font-bold'>
                                    Assigned categories
                                </div>
                                <div className='px-sm w-full flex-1 bg-white py-2'>
                                    {assignedCategories.length > 0 ? assignedCategories : '<None>'}
                                </div>
                            </Group>
                        </Accordion.Control>
                        <Accordion.Panel>
                            <Stack>
                                <span className='text-xs font-bold'>
                                    Category assignment breakdown
                                </span>
                            </Stack>
                        </Accordion.Panel>
                    </Accordion.Item>
                </Accordion>
            </Stack>
            {response.responses.map((r, i) => (
                <Accordion
                    key={i}
                    multiple
                    variant='separated'
                    classNames={{
                        item: 'bg-neutral-50 border-outline p-xxs',
                        chevron: 'mt-8 hidden',
                        control: 'cursor-default'
                    }}
                    value={opened}
                >
                    <Accordion.Item value={`response-${i}`}>
                        <Accordion.Control component='div'>
                            <Group align='flex-end'>
                                <Stack className='flex-1 text-sm'>
                                    <span className='font-bold'>
                                        {i + 1}. {r.fieldTitle}
                                    </span>
                                    <div className='border-outline px-sm rounded-sm border-1 bg-white py-2'>
                                        {r.response}
                                    </div>
                                </Stack>
                                <ActionButton
                                    onClick={() =>
                                        setOpened(prev =>
                                            prev.includes(`response-${i}`)
                                                ? prev.filter(e => e !== `response-${i}`)
                                                : [...prev, `response-${i}`]
                                        )
                                    }
                                    variant='light'
                                    icon={
                                        opened.includes(`response-${i}`)
                                            ? IconChevronUp
                                            : IconChevronDown
                                    }
                                    label='Scoring'
                                />
                            </Group>
                        </Accordion.Control>
                        <Accordion.Panel>
                            <Stack gap='sm'>
                                <span className='text-xs font-bold'>Category scoring results</span>
                                <div className='border-outline w-fit overflow-hidden rounded-sm border-1'>
                                    <Table
                                        variant='vertical'
                                        withColumnBorders
                                        classNames={{
                                            table: 'w-fit block text-xs',
                                            th: 'bg-white min-w-[160px]',
                                            td: 'bg-white min-w-[160px]'
                                        }}
                                    >
                                        <Table.Tbody>
                                            <Table.Tr>
                                                <Table.Th>Category</Table.Th>
                                                <Table.Td>Scoring result</Table.Td>
                                            </Table.Tr>
                                            {response.categoryRules.map(({ category }) => {
                                                const total = r.fieldRules.reduce((acc, rule) => {
                                                    if (
                                                        !rule.score.result ||
                                                        rule.score.category.name !== category.name
                                                    )
                                                        return acc;

                                                    switch (rule.score.operation) {
                                                        case 'ADD':
                                                            return acc + rule.score.points;
                                                        case 'SUBTRACT':
                                                            return acc - rule.score.points;
                                                        default:
                                                            throw new Error(
                                                                `Invalid rule score operation: ${rule.score.operation}`
                                                            );
                                                    }
                                                }, 0);
                                                return (
                                                    <Table.Tr key={category.name}>
                                                        <Table.Th>
                                                            <Badge
                                                                key={category.name}
                                                                color={category.color}
                                                                className='rounded-sm'
                                                                variant='light'
                                                            >
                                                                {category.name}
                                                            </Badge>
                                                        </Table.Th>
                                                        <Table.Td>
                                                            {total > 0 ? `+${total}` : total}
                                                        </Table.Td>
                                                    </Table.Tr>
                                                );
                                            })}
                                        </Table.Tbody>
                                    </Table>
                                </div>
                                <span className='text-xs font-bold'>
                                    Category scoring breakdown
                                </span>
                                <Stack gap='md'>
                                    {r.fieldRules.map(rule => (
                                        <Stack key={i} gap={0}>
                                            <Group
                                                gap='xs'
                                                className='border-outline p-sm w-fit min-w-[200px] rounded-t-sm border-x-1 border-t-1 bg-white'
                                            >
                                                {rule.score.result ? (
                                                    <IconCircleCheckFilled
                                                        color='var(--mantine-color-green-filled)'
                                                        size={18}
                                                    />
                                                ) : (
                                                    <IconCircleXFilled
                                                        color='var(--mantine-color-red-filled)'
                                                        size={18}
                                                    />
                                                )}
                                                <Badge
                                                    className='rounded-sm'
                                                    color={rule.score.category.color}
                                                    variant='default'
                                                >
                                                    {rule.score.operation}
                                                </Badge>
                                                <Badge
                                                    className='rounded-sm'
                                                    variant='light'
                                                    color='dark'
                                                >
                                                    {rule.score.points}{' '}
                                                    {rule.score.points > 1 ? 'POINTS' : 'POINT'}
                                                </Badge>
                                                <Badge
                                                    className='rounded-sm'
                                                    color={rule.score.category.color}
                                                    variant='default'
                                                >
                                                    FOR
                                                </Badge>
                                                <Badge
                                                    className='rounded-sm'
                                                    color={rule.score.category.color}
                                                    variant='light'
                                                >
                                                    {rule.score.category.name}
                                                </Badge>
                                            </Group>
                                            {rule.logs.map((log, j) => (
                                                <LogTree key={j + log.combinator} log={log} />
                                            ))}
                                        </Stack>
                                    ))}
                                </Stack>
                            </Stack>
                        </Accordion.Panel>
                    </Accordion.Item>
                </Accordion>
            ))}
        </Stack>
    );
}
