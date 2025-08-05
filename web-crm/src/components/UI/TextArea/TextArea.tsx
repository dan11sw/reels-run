import { FC, useEffect, useRef, useState } from "react";
import styles from "./TextArea.module.scss";
import { VOID_NULL, isUndefinedOrNull } from "src/types/void_null";
import { InputValueType } from "src/types/input";
import cn from "classnames";

export interface ITextAreaProps {
    name?: string;
    label?: string;
    title?: string;
    defaultValue?: InputValueType;
    changeHandler?: (value?: InputValueType) => void;
    delay?: number;
    customClass?: string;
    readOnly?: boolean;
    required?: boolean;
    width?: string;
}

const TextArea: FC<ITextAreaProps> = (props) => {
    const {
        title, label, defaultValue = '',
        name, changeHandler, delay = 0,
        customClass, readOnly = false, required
    } = props;

    const [value, setValue] = useState<InputValueType>('');
    const timerChange = useRef<NodeJS.Timeout | VOID_NULL>(null);

    useEffect(() => {
        if (!isUndefinedOrNull(defaultValue)) {
            setValue(defaultValue);
        }
    }, [defaultValue]);

    // Отложенное обновление верхнеуровневых состояний
    useEffect(() => {
        timerChange.current && clearTimeout(timerChange.current);

        timerChange.current = setTimeout(() => {
            if (!isUndefinedOrNull(value)) {
                changeHandler && changeHandler(value);
            }
            timerChange.current && clearTimeout(timerChange.current);
        }, delay);
    }, [value]);

    // Очистка ресурсов
    useEffect(() => {
        return () => {
            timerChange.current && clearTimeout(timerChange.current);
        }
    }, []);

    // Обработка изменения данных в Input
    const inputChangeHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setValue(e.target.value);
    };

    return (
        <>
            <div
                className={styles.container}
                style={{
                    width: props.width
                }}
            >
                {
                    label &&
                    <span
                        className={styles.label}
                        title={title}
                    >
                        {label}{(required) ? ' *' : ''}
                    </span>
                }
                <textarea
                    name={name}
                    className={cn(styles.input, customClass)}
                    value={value}
                    onChange={inputChangeHandler}
                    readOnly={readOnly}
                />
            </div>
        </>
    );
};

export default TextArea;
