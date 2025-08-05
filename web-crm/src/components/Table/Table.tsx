import React, { FC } from "react";
import styles from './Table.module.scss';

export interface ITableProps {
    extRef?: React.RefObject<any>;
    extBodyRef?: React.RefObject<any>;
    columns: string[];
    data: any[];
    renderItem: (item: any) => JSX.Element;
    renderControls?: () => JSX.Element;
    onMouseLeaveHandler?: () => void
};

/**
 * Функциональный компонент таблицы
 * @returns 
 */
const Table: FC<ITableProps> = (props) => {
    const { onMouseLeaveHandler, extRef, extBodyRef, renderControls } = props;

    return (
        <>
            <div
                ref={extRef}
                className={styles.container}
            >
                <div className={styles.column}>
                    {
                        props.columns.map((item, key) => {
                            return (
                                <div key={key} className={styles.columnCell}>
                                    <p>{item}</p>
                                </div>
                            );
                        })
                    }
                    {
                        renderControls && renderControls()
                    }
                </div>
                <div
                    ref={extBodyRef}
                    className={styles.body}
                    onMouseLeave={onMouseLeaveHandler}
                >
                    {
                        props.data.map((item, key) => {
                            return (
                                <React.Fragment key={item.id || key}>
                                    {
                                        props.renderItem(item)
                                    }
                                </React.Fragment>
                            );
                        })
                    }
                </div>
            </div>
        </>
    )
};


export default Table;