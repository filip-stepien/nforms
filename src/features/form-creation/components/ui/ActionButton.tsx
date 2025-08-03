import { PolymorphicComponentProps, Button, Group, ButtonProps } from '@mantine/core';
import { Icon, ReactNode } from '@tabler/icons-react';

type Props = {
    icon?: Icon;
    label: string;
} & PolymorphicComponentProps<'button', ButtonProps>;

export function ActionButton({ icon: Icon, label, ...rest }: Props) {
    return (
        <Button className='w-fit' {...rest}>
            <Group gap={8}>
                {Icon && <Icon size={20} stroke={1.5} />}
                <span>{label}</span>
            </Group>
        </Button>
    );
}
