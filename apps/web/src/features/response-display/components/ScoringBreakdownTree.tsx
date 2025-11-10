import { cn } from '@/lib/utils';
import { Stack, Badge, Group, Notification } from '@mantine/core';
import { FieldRuleLog, FieldRuleGroupLog } from '@packages/db/schemas/form-responses';
import { IconCircleCheckFilled, IconCircleXFilled } from '@tabler/icons-react';

type Props = {
    log: FieldRuleLog | FieldRuleGroupLog;
    hasBackground?: boolean;
};

export function ScoringBreakdownTree({ log, hasBackground = false }: Props) {
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
                                <ScoringBreakdownTree
                                    key={i}
                                    log={child}
                                    hasBackground={!hasBackground}
                                />
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
