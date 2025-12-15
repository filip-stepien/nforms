import { cn } from '@/lib/utils';
import { Stack, Badge, Group } from '@mantine/core';
import { EvaluatedAttentionCheck } from '@packages/db/schemas/form-responses';
import { IconCircleCheckFilled, IconCircleXFilled } from '@tabler/icons-react';

export function AttentionChecksBreakdown({
    attentionChecks
}: {
    attentionChecks: EvaluatedAttentionCheck[];
}) {
    if (attentionChecks.length === 0) {
        <span className='text-font-tertiary text-xs'>
            This question does not contain any attention checks.
        </span>;
    }

    return attentionChecks.map((check, i) => (
        <Stack gap={0} key={i} className='w-full'>
            <Group
                gap='xs'
                className={cn(
                    'border-outline p-xs w-fit bg-white',
                    check.actualValues.length > 0 ? 'rounded-t border-x border-t' : 'rounded border'
                )}
            >
                {check.applied ? (
                    <IconCircleCheckFilled color='var(--mantine-color-green-filled)' size={18} />
                ) : (
                    <IconCircleXFilled color='var(--mantine-color-red-filled)' size={18} />
                )}
                <Group gap='sm'>
                    <Badge className='rounded-sm' variant='default'>
                        SET
                    </Badge>
                    <Badge className='rounded-sm' variant='light' color={check.category.color}>
                        {check.category.name}
                    </Badge>
                    <Badge className='rounded-sm' variant='default'>
                        SCORE TO
                    </Badge>
                    <Badge className='rounded-sm' variant='light' color='dark'>
                        {check.score}
                    </Badge>
                    <Badge className='rounded-sm' variant='default'>
                        WHEN
                    </Badge>
                    <Badge className='rounded-sm' variant='light' color='dark'>
                        {check.condition}
                    </Badge>
                    <Badge className='rounded-sm' variant='default'>
                        {check.operator}
                    </Badge>
                    <Badge className='rounded-sm' variant='light' color='dark'>
                        {check.ruleValue}
                    </Badge>
                </Group>
            </Group>
            {check.actualValues.length > 0 && (
                <Stack className='p-md border-outline w-full rounded rounded-b border-1 bg-white'>
                    {check.actualValues.map((actualValue, j) => (
                        <Group key={j}>
                            <Badge className='rounded-sm' variant='default'>
                                {actualValue.fieldTitle}
                            </Badge>
                            <Badge
                                className='rounded-sm'
                                variant='light'
                                color={actualValue.valueMatches ? 'green' : 'red'}
                            >
                                PROVIDED: {actualValue.actualValue}
                            </Badge>
                        </Group>
                    ))}
                </Stack>
            )}
        </Stack>
    ));
}
