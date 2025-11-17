'use client';

import { FormHeader } from './layout/FormHeader';
import { FormTimestamp } from './layout/FormTimestamp';
import { Stack, Flex } from '@mantine/core';
import { ShareButton } from './action-buttons/CopyURLButton';
import { DeleteButton } from './action-buttons/DeleteButton';
import { OpenButton } from './action-buttons/OpenButton';
import { SaveButton } from './action-buttons/SaveButton';
import { useFormSaveAction } from '../hooks/useFormSaveAction';
import { FormTabs } from './layout/FormTabs';
import { FormResponse } from '@packages/db/schemas/form-responses';
import { Paginated } from '@/lib/pagination';
import { SectionTitle } from '@/components/SectionTitle';
import { IconFileDescription } from '@tabler/icons-react';
import { CategoriesChartData, ResponsesChartData } from '../lib/data';
import { RootState } from '@/lib/store';
import { useDisclosure } from '@mantine/hooks';
import { ConfirmationModal } from '@/components/ConfirmationModal';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/hooks/useAppStore';

type Props = {
    formId: string;
    baseUrl: string;
    createdAt: Date;
    responses: Promise<Paginated<FormResponse[]>>;
    categoriesChartData: Promise<CategoriesChartData[]>;
    responsesChartData: Promise<ResponsesChartData[]>;
    totalResponses: Promise<number>;
    thisWeekResponses: Promise<number>;
    suspenseKey: string;
    initialState: RootState;
};

export function FormEditor(props: Props) {
    const {
        formId,
        baseUrl,
        createdAt,
        responses,
        suspenseKey,
        categoriesChartData,
        responsesChartData,
        totalResponses,
        thisWeekResponses,
        initialState
    } = props;

    const { isLoading, action } = useFormSaveAction(formId);
    const store = useAppStore();
    const { back } = useRouter();
    const [confirmOpened, { close: closeConfirm, open: openConfirm }] = useDisclosure();

    const handleGoBack = () => {
        const currentState = store.getState();

        if (JSON.stringify(currentState) === JSON.stringify(initialState)) {
            back();
        } else {
            openConfirm();
        }
    };

    return (
        <form action={action}>
            <ConfirmationModal
                opened={confirmOpened}
                onClose={closeConfirm}
                onConfirm={back}
                message='You have unsaved changes. If you leave now, your changes will be lost.'
            />
            <SectionTitle>
                <SectionTitle.BackButton onClick={handleGoBack} />
                <SectionTitle.Icon icon={IconFileDescription} />
                <SectionTitle.Title>Form details</SectionTitle.Title>
            </SectionTitle>
            <Flex gap={100} className='pb-xs bg-white'>
                <Stack flex={1}>
                    <FormTimestamp createdAt={createdAt} />
                    <FormHeader />
                </Stack>
                <Flex gap='xs' align='flex-end' justify='flex-end'>
                    <SaveButton isLoading={isLoading} />
                    <OpenButton url={`/form/${formId}`} />
                    <ShareButton url={`${baseUrl}form/${formId}`} />
                    <DeleteButton formId={formId} />
                </Flex>
            </Flex>
            <FormTabs defaultTab='responses'>
                <FormTabs.Tabs>
                    <FormTabs.ResponsesTab />
                    <FormTabs.QuestionsTab />
                    <FormTabs.CategoriesTab />
                    <FormTabs.SettingsTab />
                </FormTabs.Tabs>
                <FormTabs.ResponsesPanel
                    responses={responses}
                    totalResponses={totalResponses}
                    thisWeekResponses={thisWeekResponses}
                    suspenseKey={suspenseKey}
                    categoriesChartData={categoriesChartData}
                    responsesChartData={responsesChartData}
                />
                <FormTabs.QuestionsPanel />
                <FormTabs.CategoriesPanel />
                <FormTabs.SettingsPanel />
            </FormTabs>
        </form>
    );
}
