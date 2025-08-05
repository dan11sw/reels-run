import { FC, useEffect, useRef, useState } from "react";
import styles from "./InputRange.module.scss";
import { VOID_NULL, isUndefinedOrNull } from "src/types/void_null";
import { InputValueType } from "src/types/input";
import cn from "classnames";

export interface IInputRangeProps {
    name?: string;
    label?: string;
    title?: string;
    type?: string;
    defaultValue?: InputValueType;
    changeHandler?: (value?: InputValueType) => void;
    delay?: number;
    customClass?: string;
    readOnly?: boolean;
    min?: number;
    max?: number;
    required?: boolean;
}

const InputRange: FC<IInputRangeProps> = (props) => {
    const {
        title, label, type = "text",
        defaultValue = '', name, changeHandler,
        delay = 0, customClass, readOnly = false,
        min = 1, max = 50, required
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
        if (readOnly) {
            return;
        }

        setValue(e.target.value);
    };

    return (
        <>
            <div className={styles.container}>
                {
                    label &&
                    <span
                        className={styles.label}
                        title={title}
                    >
                        {label}{(required) ? ' *' : ''}
                    </span>
                }
                <output>{value}</output>
                <input
                    name={name}
                    className={cn(styles.input, customClass)}
                    readOnly={readOnly}
                    type="range"
                    min={min}
                    max={max}
                    defaultValue={defaultValue}
                    value={value}
                    onChange={inputChangeHandler}
                />
            </div>
        </>
    );
};

export default InputRange;
