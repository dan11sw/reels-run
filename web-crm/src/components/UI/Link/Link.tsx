import { FC } from "react";
import styles from "./Link.module.scss";

export interface ILinkProps {
    label?: string;
    clickHandler?: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
}

const Link: FC<ILinkProps> = (props) => {
    const { label, clickHandler } = props;

    return (
        <>
            <div>
                <a
                    className={styles.link}
                    onClick={clickHandler}
                >
                    {label}
                </a>
            </div>
        </>
    );
};

export default Link;
