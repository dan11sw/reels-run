import React, { FC, useCallback, useEffect, useState } from "react";
import styles from "./TestPage.module.scss";
/**
 * Список созданных игр
 * @returns 
 */
const TestPage: FC<any> = () => {
    return (
        <>
            <div className={styles.container}>
                Тестовая страница
            </div>
        </>
    )
};

export default TestPage;