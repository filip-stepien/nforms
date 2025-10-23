import { Tabs } from '@mantine/core';
import { IconMessageCircle, IconSettings, Icon, ReactNode } from '@tabler/icons-react';
import { FormResponsesTab } from '../tabs/FormResponsesTab';
import { FormSettingsTab } from '../tabs/FormSettingsTab';
import { capitalizeFirstLetter } from '../../lib/utils';
import { FormQuestionsTab } from '../tabs/FormQuestionsTab';

type FormTab = 'questions' | 'settings' | 'responses';

type FormTabsMap = Record<
    FormTab,
    {
        icon: Icon;
        component: ReactNode;
    }
>;

type Props = {
    formId?: string;
    tabs: FormTab[];
    defaultTab: FormTab;
};

export function FormTabs({ formId, tabs, defaultTab }: Props) {
    const tabsMap: FormTabsMap = {
        questions: {
            icon: IconMessageCircle,
            component: <FormQuestionsTab />
        },
        settings: {
            icon: IconSettings,
            component: <FormSettingsTab />
        },
        responses: {
            icon: IconMessageCircle,
            component: formId && <FormResponsesTab formId={formId} />
        }
    };

    return (
        <Tabs defaultValue={defaultTab} classNames={{ panel: 'p-sm pt-lg' }}>
            <Tabs.List>
                {tabs.map(tab => {
                    const Icon = tabsMap[tab].icon;
                    return (
                        <Tabs.Tab
                            key={tab}
                            value={tab}
                            leftSection={<Icon stroke={1.5} size={18} />}
                        >
                            {capitalizeFirstLetter(tab)}
                        </Tabs.Tab>
                    );
                })}
            </Tabs.List>
            {tabs.map(tab => (
                <Tabs.Panel value={tab} key={tab}>
                    {tabsMap[tab].component}
                </Tabs.Panel>
            ))}
        </Tabs>
    );
}
