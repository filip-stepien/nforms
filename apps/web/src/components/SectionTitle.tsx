import { ActionIcon, Group } from '@mantine/core';
import { Icon, IconChevronLeft } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';

type Props = {
    children: ReactNode;
    gap?: string | number;
    bottom?: string | number;
};

export function SectionTitle(props: Props) {
    const { children, bottom = 'md', gap = 'sm' } = props;
    return (
        <Group gap={gap} className={`md:pb-${bottom}`}>
            {children}
        </Group>
    );
}

SectionTitle.BackButton = function BackButton({ onClick }: { onClick?: () => void }) {
    const router = useRouter();

    const handleBackClick = () => {
        if (onClick) {
            onClick();
        } else {
            router.back();
        }
    };

    return (
        <ActionIcon
            variant='subtle'
            className='hover:bg-neutral-50'
            size='lg'
            onClick={handleBackClick}
        >
            <IconChevronLeft className='text-font-secondary' />
        </ActionIcon>
    );
};

SectionTitle.Icon = function IconButton({ icon: Icon }: { icon: Icon }) {
    return <Icon size={20} />;
};

SectionTitle.Title = function Title({ children }: { children: ReactNode }) {
    return <h1 className='text-2xl font-bold'>{children}</h1>;
};
