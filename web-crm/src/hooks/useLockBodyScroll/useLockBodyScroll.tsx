import { useEffect, useRef } from "react";

/**
 * Хук для скрытия / раскрытия скролла всей страницы
 * @param props Параметры хука
 * @returns 
 */
const useLockBodyScroll = (isLocked: boolean) => {
    const refStyle = useRef<string | null>(null);

    useEffect(() => {
        if(refStyle.current === null) {
            refStyle.current = document.body.style.overflow;
        }

        if (isLocked) {
            document.body.style.overflow = "hidden";
        }

        return () => {
            document.body.style.overflow = refStyle.current as string;
            refStyle.current = null;
        };
    }, [isLocked]);
};

export default useLockBodyScroll;