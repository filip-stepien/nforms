'use client';

import { Tabs } from '@mantine/core';
import { IconMessageCircle, IconSettings, IconCategory } from '@tabler/icons-react';
import { ReactNode } from 'react';
import { FormResponsesTab } from '../tabs/FormResponsesTab';
import { FormSettingsTab } from '../tabs/FormSettingsTab';
import { FormQuestionsTab } from '../tabs/FormQuestionsTab';
import { FormCategoriesTab } from '../tabs/FormCategoriesTab';
import { FormResponse } from '@packages/db/schemas/form-responses';
import { Paginated } from '@/lib/pagination';
import { CategoriesChartData, ResponsesChartData } from '../../lib/data';

type FormTab = 'questions' | 'settings' | 'responses' | 'categories';

type Props = {
    defaultTab: FormTab;
    children: ReactNode | ReactNode[];
};

export function FormTabs({ defaultTab, children }: Props) {
    return (
        <Tabs defaultValue={defaultTab} classNames={{ panel: 'p-sm pt-lg' }}>
            {children}
        </Tabs>
    );
}

FormTabs.Tabs = function FormTabs({ children }: { children: ReactNode | ReactNode[] }) {
    return <Tabs.List>{children}</Tabs.List>;
};

FormTabs.QuestionsTab = function QuestionsTab() {
    return (
        <Tabs.Tab value='questions' leftSection={<IconMessageCircle stroke={1.5} size={18} />}>
            Questions
        </Tabs.Tab>
    );
};

FormTabs.QuestionsPanel = function QuestionsPanel() {
    return (
        <Tabs.Panel value='questions'>
            <FormQuestionsTab />
        </Tabs.Panel>
    );
};

FormTabs.SettingsTab = function SettingsTab() {
    return (
        <Tabs.Tab value='settings' leftSection={<IconSettings stroke={1.5} size={18} />}>
            Settings
        </Tabs.Tab>
    );
};

FormTabs.SettingsPanel = function SettingsPanel() {
    return (
        <Tabs.Panel value='settings'>
            <FormSettingsTab />
        </Tabs.Panel>
    );
};

FormTabs.CategoriesTab = function CategoriesTab() {
    return (
        <Tabs.Tab value='categories' leftSection={<IconCategory stroke={1.5} size={18} />}>
            Categories
        </Tabs.Tab>
    );
};

FormTabs.CategoriesPanel = function CategoriesPanel() {
    return (
        <Tabs.Panel value='categories'>
            <FormCategoriesTab />
        </Tabs.Panel>
    );
};

FormTabs.ResponsesTab = function ResponsesTab() {
    return (
        <Tabs.Tab value='responses' leftSection={<IconMessageCircle stroke={1.5} size={18} />}>
            Responses
        </Tabs.Tab>
    );
};

FormTabs.ResponsesPanel = function ResponsesPanel(props: {
    responses: Promise<Paginated<FormResponse[]>>;
    responsesChartData: Promise<ResponsesChartData[]>;
    categoriesChartData: Promise<CategoriesChartData[]>;
    totalResponses: Promise<number>;
    thisWeekResponses: Promise<number>;
    suspenseKey: string;
}) {
    return (
        <Tabs.Panel value='responses'>
            <FormResponsesTab {...props} />
        </Tabs.Panel>
    );
};
