'use client';

import { Tabs, TabsTab, TabsPanel, TabsList, Stack, TextInput, Flex } from '@mantine/core';
import { IconMessageCircle, IconSettings, IconLayoutList } from '@tabler/icons-react';
import { ShareButton } from './buttons/CopyURLButton';
import { AddFieldButton } from '@/features/form-creation/components/form/AddFieldButton';
import { FormFieldsContainer } from '@/features/form-creation/components/form/FormFieldsContainer';
import { FormSettings } from '@/features/form-creation/components/form/FormSettings';
import { DeleteButton } from './buttons/DeleteButton';
import { EmbedButton } from './buttons/EmbedButton';
import { OpenButton } from './buttons/OpenButton';
import { SaveButton } from './buttons/SaveButton';
import dayjs from 'dayjs';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useFormSaveAction } from '@/hooks/useFormSaveAction';

type Props = {
    formId: string;
    createdAt: Date;
    baseUrl: string;
};

export function FormDetails({ formId, createdAt, baseUrl }: Props) {
    const form = useAppSelector(state => state.form);
    const { isLoading, action } = useFormSaveAction(formId);

    return (
        <form action={action}>
            <Stack>
                <Flex>
                    <Flex direction='column' gap='sm'>
                        <span className='text-font-tertiary text-sm'>
                            Created on {dayjs(createdAt).format('DD.MM.YYYY')}
                        </span>
                        <TextInput
                            label='Title'
                            value={form.title}
                            onChange={() => null}
                            variant='unstyled'
                            classNames={{ input: 'text-3xl' }}
                        />
                        <TextInput
                            label='Description'
                            placeholder={form.description ? undefined : 'No description provided.'}
                            value={form.description ?? ''}
                            onChange={() => null}
                            variant='unstyled'
                            classNames={{ input: 'text-xl' }}
                        />
                    </Flex>
                    <Flex gap='xs' align='flex-end' justify='flex-end' className='w-full'>
                        <SaveButton isLoading={isLoading} />
                        <OpenButton url={`/form/${formId}`} />
                        <ShareButton url={`${baseUrl}form/${formId}`} />
                        <EmbedButton embedding='<div />' />
                        <DeleteButton formId={formId} />
                    </Flex>
                </Flex>

                <Tabs defaultValue='questions' classNames={{ panel: 'p-sm pt-lg' }}>
                    <TabsList>
                        <TabsTab
                            value='responses'
                            leftSection={<IconMessageCircle stroke={1.5} size={18} />}
                        >
                            Responses
                        </TabsTab>
                        <TabsTab
                            value='questions'
                            leftSection={<IconLayoutList stroke={1.5} size={18} />}
                        >
                            Questions
                        </TabsTab>
                        <TabsTab
                            value='settings'
                            leftSection={<IconSettings stroke={1.5} size={18} />}
                        >
                            Settings
                        </TabsTab>
                    </TabsList>

                    <TabsPanel value='responses'>Responses</TabsPanel>
                    <TabsPanel value='questions'>
                        <FormFieldsContainer />
                        <Flex justify='center' className='pt-sm'>
                            <AddFieldButton />
                        </Flex>
                    </TabsPanel>
                    <TabsPanel value='settings'>
                        <FormSettings />
                    </TabsPanel>
                </Tabs>
            </Stack>
        </form>
    );
}
