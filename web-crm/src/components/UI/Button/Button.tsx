import { FC } from "react";
import styles from "./Button.module.scss";
import cn from "classnames";

export interface IButtonProps {
    label?: string;
    customClass?: string;
    clickHandler?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    width?: number;
    height?: number;
    disabled?: boolean;
    title?: string;
}

const Button: FC<IButtonProps> = (props) => {
    const {
        customClass, label, clickHandler,
        width, height, disabled,
        title
    } = props;

    return (
        <>
            <div
                className={styles.container}
                style={{
                    width: width ? `${width}px` : undefined,
                    height: height ? `${height}px` : undefined
                }}
            >
                <button
                    className={cn(styles.button, customClass)}
                    onClick={clickHandler}
                    disabled={disabled}
                    title={title}
                >
                    {label}
                </button>
            </div>
        </>
    );
};

export default Button;
