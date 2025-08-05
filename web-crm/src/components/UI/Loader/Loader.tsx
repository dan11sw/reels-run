import { FC } from "react";
import styles from "./Loader.module.scss";

const Loader: FC<any> = () => {
    return (
        <>
            <div className={styles.loadingContainer}>
                <div className={styles.loadingSpinner}></div>
            </div>
        </>
    );
};

export default Loader;
