import { Stack, Group, Badge } from '@mantine/core';
import { EvaluatedCategory } from '@packages/db/schemas/form-responses';
import { IconCircleCheckFilled, IconCircleXFilled } from '@tabler/icons-react';
import { CategoryBreakdownTree } from './CategoryBreakdownTree';
import { cn } from '@/lib/utils';

type Props = {
    rule: EvaluatedCategory;
};

export function CategoryAssignment({ rule }: Props) {
    const firstRule = rule.logs.at(0);
    const ruleIsEmpty = firstRule === undefined || (firstRule && firstRule.logs.length === 0);

    return (
        <Stack gap={0}>
            <Group
                gap='xs'
                className={cn(
                    'border-outline p-sm w-fit min-w-[200px] bg-white',
                    ruleIsEmpty ? 'rounded-sm border-1' : 'rounded-t-sm border-x-1 border-t-1'
                )}
            >
                {rule.assigned ? (
                    <IconCircleCheckFilled color='var(--mantine-color-green-filled)' size={18} />
                ) : (
                    <IconCircleXFilled color='var(--mantine-color-red-filled)' size={18} />
                )}
                <Badge className='rounded-sm' variant='default'>
                    ASSIGN
                </Badge>
                <Badge className='rounded-sm' color={rule.category.color} variant='light'>
                    {rule.category.name}
                </Badge>
            </Group>
            {!ruleIsEmpty && rule.logs.map((log, i) => <CategoryBreakdownTree key={i} log={log} />)}
        </Stack>
    );
}
