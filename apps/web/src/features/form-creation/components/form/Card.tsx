import { cn } from '@/lib/utils';
import { Stack, StackProps } from '@mantine/core';
import { ReactNode, Ref } from 'react';

type Props = {
    children: ReactNode;
    title?: string;
    ref?: Ref<HTMLDivElement>;
} & StackProps;

export function Card({ children, title, ref, ...props }: Props) {
    const { className, ...restProps } = props;

    return (
        <Stack
            gap='lg'
            className={cn(
                'border-outline p-lg flex-2 rounded-md border-1 bg-neutral-100',
                className
            )}
            ref={ref}
            {...restProps}
        >
            {title && <span className='font-bold'>{title}</span>}
            {children}
        </Stack>
    );
}
