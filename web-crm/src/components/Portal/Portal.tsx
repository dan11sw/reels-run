import { useState, useLayoutEffect, FC } from "react";
import { createPortal } from "react-dom";

export interface IPortalProps {
    wrappedId?: string;
    children: React.ReactNode;
}

/**
 * Создание нового элемента в DOM-дереве
 * @param id Идентификатор верхнеуровневого элемента-обёртки
 * @returns 
 */
const createWrapperElement = (id) => {
    const wrapperElement = document.createElement('div');
    wrapperElement.setAttribute("id", id);

    document.body.appendChild(wrapperElement);

    return wrapperElement;
}

/**
 * Функциональный компонент для создания порталов
 * @param props Параметры компонента
 * @returns 
 */
const Portal: FC<IPortalProps> = (props) => {
    const { wrappedId = "modals", children } = props;

    const [wrapperElement, setWrapperElement] = useState<HTMLElement | null>(null);

    useLayoutEffect(() => {
        let element = document.getElementById(wrappedId);
        let systemCreated = false;

        if (!element) {
            systemCreated = true;
            element = createWrapperElement(wrappedId);
        }

        setWrapperElement(element);

        return () => {
            // Удаление элемента дерева если он был создан
            if(systemCreated && element && element.parentNode) {
                element.parentNode.removeChild(element);
            }
        };
    }, [wrappedId]);


    return wrapperElement ? createPortal(children, wrapperElement) : null;
};

export default Portal;