'use client';

import { Tabs, TabsTab, TabsPanel, TabsList, Stack, TextInput, Flex } from '@mantine/core';
import { Form } from '@packages/db/schemas/form';
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

type Props = {
    form: Form;
    baseUrl: string;
};

export function FormDetails({ form, baseUrl }: Props) {
    return (
        <Stack>
            <Flex>
                <Flex direction='column' gap='sm'>
                    <span className='text-font-tertiary text-sm'>
                        Created on {dayjs(form.createdAt).format('DD.MM.YYYY')}
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
                    <SaveButton />
                    <OpenButton url={`/form/${form.id}`} />
                    <ShareButton url={`${baseUrl}form/${form.id}`} />
                    <EmbedButton embedding='<div />' />
                    <DeleteButton formId={form.id} />
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
                    <TabsTab value='settings' leftSection={<IconSettings stroke={1.5} size={18} />}>
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
    );
}
