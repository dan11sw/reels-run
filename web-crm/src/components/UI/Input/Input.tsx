import { FC, useEffect, useRef, useState } from "react";
import styles from "./Input.module.scss";
import { VOID_NULL, isUndefinedOrNull } from "src/types/void_null";
import { InputValueType } from "src/types/input";
import cn from "classnames";

export interface IInputProps {
    name?: string;
    label?: string;
    labelRender?: () => JSX.Element;
    title?: string;
    type?: string;
    defaultValue?: InputValueType;
    changeHandler?: (value?: InputValueType) => void;
    delay?: number;
    customClass?: string;
    readOnly?: boolean;
    maxLength?: number;
    required?: boolean;
    width?: string;
}

const Input: FC<IInputProps> = (props) => {
    const {
        title, label, labelRender, type = "text",
        defaultValue = '', name, changeHandler,
        delay = 0, customClass, readOnly = false,
        maxLength, required, width
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
    const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
    };

    return (
        <>
            <div
                className={styles.container}
                style={{
                    width: width
                }}
            >
                {
                    (label || labelRender) &&
                    <div className={styles.labelContainer}>
                        {
                            label &&
                            <span
                                className={styles.label}
                                title={title}
                            >
                                {label}{(required) ? ' *' : ''}
                            </span>
                        }
                        {
                            labelRender && labelRender()
                        }
                    </div>
                }
                <input
                    name={name}
                    className={cn(styles.input, customClass)}
                    type={type}
                    value={value}
                    onChange={inputChangeHandler}
                    readOnly={readOnly}
                    maxLength={maxLength}
                    required={required}
                />
            </div>
        </>
    );
};

export default Input;
