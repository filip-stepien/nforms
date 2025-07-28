import { useState, useCallback } from 'react';

export function useRerender(): () => void {
    const [, setValue] = useState(0);

    const rerender = useCallback(() => {
        setValue(prev => prev + 1);
    }, []);

    return rerender;
}
