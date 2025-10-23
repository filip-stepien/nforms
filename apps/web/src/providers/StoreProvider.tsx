'use client';

import { AppStore, makeStore, RootState } from '@/lib/store';
import { ReactNode, useRef } from 'react';
import { Provider } from 'react-redux';

type Props = {
    children: ReactNode;
    preloadedState?: Partial<RootState>;
};

export default function StoreProvider({ children, preloadedState }: Props) {
    const storeRef = useRef<AppStore | null>(null);

    if (!storeRef.current) {
        storeRef.current = makeStore(preloadedState);
    }

    return <Provider store={storeRef.current}>{children}</Provider>;
}
