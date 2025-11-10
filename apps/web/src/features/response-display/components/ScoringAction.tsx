import { Stack, Group, Badge } from '@mantine/core';
import { IconCircleCheckFilled, IconCircleXFilled } from '@tabler/icons-react';
import { ScoringBreakdownTree } from './ScoringBreakdownTree';
import { EvaluatedField } from '@packages/db/schemas/form-responses';

type Props = {
    rule: EvaluatedField;
};

export function ScoringAction({ rule }: Props) {
    return (
        <Stack gap={0}>
            <Group
                gap='xs'
                className='border-outline p-sm w-fit min-w-[200px] rounded-t-sm border-x-1 border-t-1 bg-white'
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
            {rule.logs.map((log, j) => (
                <ScoringBreakdownTree key={j + log.combinator} log={log} />
            ))}
        </Stack>
    );
}
