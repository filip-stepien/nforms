import { Flex } from '@mantine/core';
import { SaveButton } from './action-buttons/SaveButton';
import { FormHeader } from './layout/FormHeader';
import { useFormSaveAction } from '../hooks/useFormSaveAction';
import { FormTabs } from './layout/FormTabs';
import { SectionTitle } from '@/components/SectionTitle';
import { IconFilePlus } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { useRouter } from 'next/navigation';
import { ConfirmationModal } from '@/components/ConfirmationModal';

export function FormCreator() {
    const { isLoading, action } = useFormSaveAction();
    const { back } = useRouter();
    const [confirmOpened, { close: closeConfirm, open: openConfirm }] = useDisclosure();

    return (
        <form action={action}>
            <ConfirmationModal
                opened={confirmOpened}
                onClose={closeConfirm}
                onConfirm={back}
                message='You have unsaved changes. If you leave now, your changes will be lost.'
            />
            <SectionTitle>
                <SectionTitle.BackButton onClick={openConfirm} />
                <SectionTitle.Icon icon={IconFilePlus} />
                <SectionTitle.Title>Create new form</SectionTitle.Title>
            </SectionTitle>
            <Flex
                className='pb-md gap-md md:gap-2xl flex-col align-baseline md:flex-row md:items-end'
                justify='space-between'
            >
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
