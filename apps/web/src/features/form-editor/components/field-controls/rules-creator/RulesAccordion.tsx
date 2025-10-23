import { Accordion } from '@mantine/core';
import { IconTextGrammar, ReactNode } from '@tabler/icons-react';

type Props = {
    children: ReactNode;
};

export function RulesAccordion({ children }: Props) {
    return (
        <Accordion
            variant='contained'
            classNames={{
                control: 'bg-white px-3.5 outline-none',
                panel: 'bg-white h-fit',
                label: 'py-1.5',
                item: 'border-border',
                icon: 'w-fit mr-2'
            }}
        >
            <Accordion.Item value='rules'>
                <Accordion.Control
                    icon={<IconTextGrammar stroke={1.5} size={20} className='text-icon w-fit' />}
                >
                    <span className='text-sm'>Category scoring rules</span>
                </Accordion.Control>
                <Accordion.Panel>{children}</Accordion.Panel>
            </Accordion.Item>
        </Accordion>
    );
}
