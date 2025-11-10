import { Stack, Group, Badge } from '@mantine/core';
import { IconCircleCheckFilled, IconCircleXFilled } from '@tabler/icons-react';
import { ScoringBreakdownTree } from './ScoringBreakdownTree';
import { EvaluatedField } from '@packages/db/schemas/form-responses';
import { cn } from '@/lib/utils';

type Props = {
    rule: EvaluatedField;
};

export function ScoringAction({ rule }: Props) {
    const firstRule = rule.logs.at(0);
    const ruleIsEmpty = firstRule && firstRule.logs.length === 0;

    return (
        <Stack gap={0}>
            <Group
                gap='xs'
                className={cn(
                    'border-outline p-sm w-fit min-w-[200px] bg-white',
                    ruleIsEmpty ? 'rounded-sm border-1' : 'rounded-t-sm border-x-1 border-t-1'
                )}
            >
                {rule.score.result ? (
                    <IconCircleCheckFilled color='var(--mantine-color-green-filled)' size={18} />
                ) : (
                    <IconCircleXFilled color='var(--mantine-color-red-filled)' size={18} />
                )}
                <Badge className='rounded-sm' color={rule.score.category.color} variant='default'>
                    {rule.score.operation}
                </Badge>
                <Badge className='rounded-sm' variant='light' color='dark'>
                    {rule.score.points} {rule.score.points > 1 ? 'POINTS' : 'POINT'}
                </Badge>
                <Badge className='rounded-sm' color={rule.score.category.color} variant='default'>
                    FOR
                </Badge>
                <Badge className='rounded-sm' color={rule.score.category.color} variant='light'>
                    {rule.score.category.name}
                </Badge>
            </Group>
            {!ruleIsEmpty && rule.logs.map((log, i) => <ScoringBreakdownTree key={i} log={log} />)}
        </Stack>
    );
}
