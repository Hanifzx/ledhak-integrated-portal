import { useRef, useCallback } from 'react';

export function useDebounce(callback, delay = 300) {
    const timerRef = useRef(null);

    return useCallback((...args) => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        timerRef.current = setTimeout(() => {
            callback(...args);
        }, delay);
    }, [callback, delay]);
}
