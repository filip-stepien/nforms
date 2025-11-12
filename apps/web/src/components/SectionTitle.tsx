import { ActionIcon, Group } from '@mantine/core';
import { Icon, IconChevronLeft } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';

type Props = {
    children: ReactNode;
    icon?: Icon;
    withBackButton?: boolean;
    gap?: string | number;
    bottom?: string | number;
};

export function SectionTitle(props: Props) {
    const { children, icon: Icon, withBackButton = false, bottom = 'md', gap = 'sm' } = props;
    const router = useRouter();

    const handleBackClick = () => {
        router.back();
    };

    return (
        <Group gap={gap} className={`pb-${bottom}`}>
            {withBackButton && (
                <ActionIcon
                    variant='subtle'
                    className='hover:bg-neutral-50'
                    size='lg'
                    onClick={handleBackClick}
                >
                    <IconChevronLeft className='text-font-secondary' />
                </ActionIcon>
            )}
            {Icon && <Icon />}
            <h1 className='text-2xl font-bold'>{children}</h1>
        </Group>
    );
}
