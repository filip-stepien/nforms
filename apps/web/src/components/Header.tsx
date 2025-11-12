import { Burger, Group } from '@mantine/core';
import { UserButton } from './UserButton';
import { ActionButton } from '@/features/form-editor/components/ui/ActionButton';
import { IconPlus } from '@tabler/icons-react';
import Link from 'next/link';
import { useDisclosure } from '@mantine/hooks';
import { MenuDrawer } from './MenuDrawer';

export function Header() {
    const [opened, { toggle, close }] = useDisclosure();

    return (
        <>
            <MenuDrawer opened={opened} onClose={close} />
            <Group gap={0} justify='space-between' className='w-full flex-row-reverse'>
                <Group className='hidden flex-row-reverse md:flex'>
                    <UserButton withDivider withMenu />
                    <Link href='/your-forms'>
                        <ActionButton
                            label='Your forms'
                            variant='transparent'
                            size='xs'
                            className='pr-0'
                        />
                    </Link>
                    <Link href='/create-form'>
                        <ActionButton
                            label='Create new'
                            icon={IconPlus}
                            iconSize={18}
                            variant='light'
                            size='sm'
                            className='text-xs'
                        />
                    </Link>
                </Group>
                <Burger
                    opened={opened}
                    onClick={toggle}
                    hiddenFrom='md'
                    className='pl-md flex-1 justify-self-start'
                />
            </Group>
        </>
    );
}
