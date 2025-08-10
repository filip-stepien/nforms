import { Loader } from '@mantine/core';

export function Loading() {
    return (
        <div className='grid place-items-center gap-lg pt-xl'>
            <Loader />
            <span className='text-primary'>Loading...</span>
        </div>
    );
}
