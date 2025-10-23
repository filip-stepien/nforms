import { cn } from '@/lib/utils';
import { ActionIcon, ActionIconProps, PolymorphicComponentProps, Tooltip } from '@mantine/core';
import { Icon } from '@tabler/icons-react';

type Props = {
    icon: Icon;
    tooltip?: string;
} & PolymorphicComponentProps<'button', ActionIconProps>;

export function IconButton({ icon: Icon, tooltip, ...rest }: Props) {
    const { className, ...restProps } = rest;

    const button = (
        <ActionIcon className={cn(className, 'size-[36px]')} {...restProps}>
            <Icon stroke={1.5} size={20} />
        </ActionIcon>
    );

    return tooltip ? (
        <Tooltip label={tooltip} withArrow>
            {button}
        </Tooltip>
    ) : (
        button
    );
}
