import { ActionButton } from '@/features/form-editor/components/ui/ActionButton';
import { Accordion, Badge, Group, Stack } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { FormResponse } from '@packages/db/schemas/form-responses';
import { IconChevronUp, IconChevronDown } from '@tabler/icons-react';

type Props = {
    formResponse: FormResponse;
};

const accordionItemValue = 'item';

export function CategoriesAccordion({ formResponse }: Props) {
    const [opened, { toggle }] = useDisclosure(false);

    const assignedCategories = formResponse.categoryRules
        .filter(category => category.assigned)
        .map(({ category }, i) => (
            <Badge key={i} color={category.color} className='rounded-sm' variant='light'>
                {category.name}
            </Badge>
        ));

    return (
        <Accordion
            variant='filled'
            classNames={{
                item: 'border-outline border-x-1 border-b-1 rounded-t-none rounded-b-sm overflow-hidden',
                control: 'px-0 flex flex-row-reverse',
                chevron: 'hidden',
                label: 'py-0',
                content: 'p-sm bg-neutral-50',
                panel: 'border-t-1 border-outline'
            }}
            value={opened ? accordionItemValue : null}
        >
            <Accordion.Item value={accordionItemValue}>
                <Accordion.Control component='div'>
                    <Group gap={0} className='bg-white text-sm'>
                        <div className='px-sm py-sm w-[180px] bg-neutral-50 font-bold'>
                            Assigned categories
                        </div>
                        <div className='px-sm w-full flex-1 py-2'>
                            {assignedCategories.length > 0 ? assignedCategories : '<None>'}
                        </div>
                        <ActionButton
                            variant='transparent'
                            icon={opened ? IconChevronUp : IconChevronDown}
                            onClick={toggle}
                            label='Details'
                            className='bg-white'
                        />
                    </Group>
                </Accordion.Control>
                <Accordion.Panel>
                    <Stack>
                        <span className='text-xs font-bold'>Category assignment breakdown</span>
                    </Stack>
                </Accordion.Panel>
            </Accordion.Item>
        </Accordion>
    );
}
