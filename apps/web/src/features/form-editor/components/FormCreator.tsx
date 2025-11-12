import { Flex } from '@mantine/core';
import { SaveButton } from './action-buttons/SaveButton';
import { FormHeader } from './layout/FormHeader';
import { useFormSaveAction } from '../hooks/useFormSaveAction';
import { FormTabs } from './layout/FormTabs';
import { SectionTitle } from '@/components/SectionTitle';
import { IconFilePlus } from '@tabler/icons-react';

export function FormCreator() {
    const { isLoading, action } = useFormSaveAction();

    return (
        <form action={action}>
            <SectionTitle icon={IconFilePlus} withBackButton>
                Create new form
            </SectionTitle>
            <Flex gap={100} className='pb-xs' justify='space-between' align='flex-end'>
                <FormHeader />
                <SaveButton isLoading={isLoading} />
            </Flex>
            <FormTabs defaultTab='questions'>
                <FormTabs.Tabs>
                    <FormTabs.QuestionsTab />
                    <FormTabs.CategoriesTab />
                    <FormTabs.SettingsTab />
                </FormTabs.Tabs>
                <FormTabs.QuestionsPanel />
                <FormTabs.CategoriesPanel />
                <FormTabs.SettingsPanel />
            </FormTabs>
        </form>
    );
}
