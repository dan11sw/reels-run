import { useEffect, useRef } from "react";

type RefStyleState = {
    overflow: string;
    paddingRight: string;
};

/**
 * Хук для скрытия / раскрытия скролла всей страницы
 * @param props Параметры хука
 * @returns 
 */
const useLockBodyScroll = (isLocked: boolean) => {
    const refStyle = useRef<RefStyleState | null>(null);

    useEffect(() => {
        if (refStyle.current === null) {
            // Замоминаем старое состояние некоторых стилей document
            refStyle.current = {
                overflow: document.body.style.overflow,
                paddingRight: document.body.style.paddingRight
            };
        }

        if (isLocked) {
            const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
            
            document.body.style.overflow = "hidden";
            document.body.style.paddingRight = `${scrollbarWidth}px`;
        }

        return () => {
            document.body.style.overflow = refStyle.current?.overflow as string;
            document.body.style.paddingRight = refStyle.current?.paddingRight as string;
            
            refStyle.current = null;
        };
    }, [isLocked]);
};

export default useLockBodyScroll;