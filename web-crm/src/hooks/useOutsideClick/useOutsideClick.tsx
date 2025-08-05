import { useEffect, useRef } from "react";

/**
 * Хук для определения клика вне области определённого компонента
 * @param props Параметры хука
 * @returns 
 */
const useOutsideClick = (outsideClickHandler: () => void) => {
    const ref = useRef<HTMLElement>(null);

    useEffect(() => {
        const handleClick = (event: TouchEvent | MouseEvent) => {
            if(ref.current && event.target && !ref.current.contains(event.target as Node)) {
                outsideClickHandler();
            }
        };

        document.addEventListener("mousedown", handleClick);

        return () => {
            document.removeEventListener("mousedown", handleClick);
        };
    }, [outsideClickHandler]);

    return ref;
};

export default useOutsideClick;