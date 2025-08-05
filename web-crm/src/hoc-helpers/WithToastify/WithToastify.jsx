/* Библиотеки */
import React, { useEffect } from 'react';

/* Хуки */
import { useAppDispatch, useAppSelector } from '../../hooks/redux.hook';
import messageQueueAction from 'src/store/actions/MessageQueueAction';
import useMessageToastify from 'src/hooks/useMessageToastify';

/**
 * High-Order Component для обёртки всех страниц,
 * для их обеспечения очередью сообщений.
 * @param {*} View Функциональный компонент для отрисовки (конкретная страница)
 * @returns {JSX.Element} React-элемент
 */
const WithToastify = (View) => {
    const Component = () => {
        const messageQueueSelector = useAppSelector(state => state.messageQueueReducer);
        const dispatch = useAppDispatch();
        const messageToastify = useMessageToastify();

        useEffect(() => {
            if(messageQueueSelector.queue.length > 0){
                const message = messageQueueSelector.queue[0];
                messageToastify(message.data.message, message.type);

                dispatch(messageQueueAction.removeMessage(message.uuid));
            }
        }, [messageQueueSelector]);
        
        return (
            <View />
        );
    };

    return Component;
}

export default WithToastify;