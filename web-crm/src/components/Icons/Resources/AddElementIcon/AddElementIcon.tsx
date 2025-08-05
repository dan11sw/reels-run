import { FC } from "react";
import styles from "./AddElementIcon.module.scss";

export interface AddElementIconProps {
    title?: string;
    width?: number;
    height?: number;
    clickHandler?: () => void;
}

const AddElementIcon: FC<AddElementIconProps> = (props) => {
    const {
        title, width = 32, height = 32,
        clickHandler
    } = props;

    const clickIconHandler = () => {
        clickHandler && clickHandler();
    };

    return (
        <>
            <svg
                width={`${width}px`}
                height={`${height}px`}
                viewBox="0 0 32 32"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                className={styles.icon}
                onClick={clickIconHandler}
            >

                <title>{title}</title>
                <path className={styles.color} d="M24,15v2h-7v7h-2v-7H8v-2h7V8h2v7H24z M24.485,24.485c-4.686,4.686-12.284,4.686-16.971,0
	c-4.686-4.686-4.686-12.284,0-16.971c4.687-4.686,12.284-4.686,16.971,0C29.172,12.201,29.172,19.799,24.485,24.485z M23.071,8.929
	c-3.842-3.842-10.167-3.975-14.142,0c-3.899,3.899-3.899,10.243,0,14.142c3.975,3.975,10.301,3.841,14.142,0
	C26.97,19.172,26.97,12.828,23.071,8.929z"/>
            </svg>
        </>
    );
};

export default AddElementIcon;
