import { Stack } from '@mantine/core';
import UseAnimations from 'react-useanimations';
import { Animation } from 'react-useanimations/utils';

type Props = {
    animation: Animation;
    title?: string;
    subtitle?: string;
    description?: string;
};

export function SubmitInfo({ animation, title, subtitle, description }: Props) {
    return (
        <div className='bg-neutral-background grid h-dvh w-dvw place-items-center'>
            <div className='p-2xl shadow-card grid aspect-square w-md place-items-center rounded-md bg-white'>
                <Stack align='center'>
                    <UseAnimations animation={animation} size={200} autoplay={true} />
                    <span className='text-3xl font-bold'>{title}</span>
                    <Stack className='text-center' gap={0}>
                        <span className='text-lg'>{subtitle}</span>
                        <span className='text-lg'>{description}</span>
                    </Stack>
                </Stack>
            </div>
        </div>
    );
}
