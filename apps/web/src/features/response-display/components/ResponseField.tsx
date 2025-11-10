import { Accordion, Group, Stack } from '@mantine/core';
import { EvaluatedResponse, FormResponse } from '@packages/db/schemas/form-responses';
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react';
import { ScoringResultsTable } from './ScoringResultsTable';
import { ScoringAction } from './ScoringAction';
import { useDisclosure } from '@mantine/hooks';
import { ActionButton } from '@/features/form-editor/components/ui/ActionButton';

type Props = {
    index: number;
    formResponse: FormResponse;
    response: EvaluatedResponse;
};

const accordionItemValue = 'item';

export function ResponseField({ index, response, formResponse }: Props) {
    const [opened, { toggle }] = useDisclosure(false);

    return (
        <Accordion
            variant='separated'
            classNames={{
                item: 'bg-neutral-50 border-outline p-xxs hover:bg-neutral-100',
                chevron: 'hidden',
                control: 'cursor-default'
            }}
            value={opened ? accordionItemValue : null}
        >
            <Accordion.Item value={accordionItemValue}>
                <Accordion.Control component='div'>
                    <Stack className='flex-1 text-sm' gap='sm'>
                        <Group gap={0} justify='space-between'>
                            <span className='font-bold'>
                                {index + 1}. {response.fieldTitle}
                            </span>
                            <ActionButton
                                variant='transparent'
                                icon={opened ? IconChevronUp : IconChevronDown}
                                onClick={toggle}
                                label='Details'
                                className='px-0'
                            />
                        </Group>
                        <div className='border-outline px-sm cursor-text rounded-sm border-1 bg-white py-2'>
                            {response.response}
                        </div>
                    </Stack>
                </Accordion.Control>
                <Accordion.Panel>
                    <Stack gap='sm'>
                        <span className='text-xs font-bold'>Category scoring results</span>
                        <ScoringResultsTable formResponse={formResponse} response={response} />
                        <span className='text-xs font-bold'>Category scoring breakdown</span>
                        <Stack gap='md'>
                            {response.fieldRules.map((rule, i) => (
                                <ScoringAction rule={rule} key={i} />
                            ))}
                        </Stack>
                    </Stack>
                </Accordion.Panel>
            </Accordion.Item>
        </Accordion>
    );
}
