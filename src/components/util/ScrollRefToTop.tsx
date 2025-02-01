import { useEffect, RefObject } from 'react';
import { useLocation } from 'react-router-dom';

interface Props {
  scrollRef: RefObject<HTMLDivElement>;
}

export default function ScrollRefToTop({ scrollRef }: Props) {
    const { pathname } = useLocation();

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = 0;
        }
    }, [pathname, scrollRef]);

    return null;
}
