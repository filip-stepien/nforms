import { PolymorphicComponentProps, Button, Group, ButtonProps } from '@mantine/core';
import { Icon } from '@tabler/icons-react';

type Props = {
    icon?: Icon;
    stroke?: number;
    iconSize?: number;
    label: string;
} & PolymorphicComponentProps<'button', ButtonProps>;

export function ActionButton({ icon: Icon, iconSize = 20, label, stroke = 1.5, ...rest }: Props) {
    return (
        <Button className='w-fit' {...rest}>
            <Group gap={8}>
                {Icon && <Icon size={iconSize} stroke={stroke} />}
                <span>{label}</span>
            </Group>
        </Button>
    );
}
