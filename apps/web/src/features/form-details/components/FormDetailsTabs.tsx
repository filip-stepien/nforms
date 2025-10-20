import { AddFieldButton } from '@/features/form-creation/components/form/AddFieldButton';
import { FormFieldsContainer } from '@/features/form-creation/components/form/FormFieldsContainer';
import { FormSettings } from '@/features/form-creation/components/form/FormSettings';
import { Tabs, Flex } from '@mantine/core';
import { IconMessageCircle, IconLayoutList, IconSettings } from '@tabler/icons-react';
import { FormResponses } from './FormResponses';

type Props = {
    formId: string;
};

export function FormDetailsTabs({ formId }: Props) {
    return (
        <Tabs defaultValue='questions' classNames={{ panel: 'p-sm pt-lg' }}>
            <Tabs.List>
                <Tabs.Tab
                    value='responses'
                    leftSection={<IconMessageCircle stroke={1.5} size={18} />}
                >
                    Responses
                </Tabs.Tab>
                <Tabs.Tab value='questions' leftSection={<IconLayoutList stroke={1.5} size={18} />}>
                    Questions
                </Tabs.Tab>
                <Tabs.Tab value='settings' leftSection={<IconSettings stroke={1.5} size={18} />}>
                    Settings
                </Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value='responses'>
                <FormResponses formId={formId} />
            </Tabs.Panel>
            <Tabs.Panel value='questions'>
                <FormFieldsContainer />
                <Flex justify='center' className='pt-sm'>
                    <AddFieldButton />
                </Flex>
            </Tabs.Panel>
            <Tabs.Panel value='settings'>
                <FormSettings />
            </Tabs.Panel>
        </Tabs>
    );
}
