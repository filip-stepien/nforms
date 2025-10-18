import { Stack } from '@mantine/core';
import UseAnimations from 'react-useanimations';
import radioButton from 'react-useanimations/lib/radioButton';

export function SubmitCheck() {
    return (
        <div className='bg-neutral-background grid h-dvh w-dvw place-items-center'>
            <div className='p-2xl shadow-card grid aspect-square w-md place-items-center rounded-md bg-white'>
                <Stack align='center'>
                    <UseAnimations animation={radioButton} size={200} autoplay={true} />
                    <span className='text-3xl font-bold'>All done!</span>
                    <Stack className='text-center' gap={0}>
                        <span className='text-lg'>We’ve got your response.</span>
                        <span className='text-lg'>Feel free to close this page.</span>
                    </Stack>
                </Stack>
            </div>
        </div>
    );
}
