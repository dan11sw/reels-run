import React, { FC, Fragment, useEffect } from "react";
import styles from './Modal.module.scss';
import Button from "../UI/Button";
import Portal from "../Portal";
import IconRouter from "../Icons/Routers/IconRouter";
import FocusLock from "react-focus-lock";
import useLockBodyScroll from "src/hooks/useLockBodyScroll";

export interface IToolbarItem {
    action?: () => void;
    title?: string;
    label?: string;
    width?: number;
}

export interface IModalProps {
    title?: string;
    actionHandler: () => void;
    closeHandler: () => void;
    children: React.ReactNode;
    width: number;
    height: number;
    toolbarDownItems?: IToolbarItem[]
}

/**
 * Main modal component
 * @param props Props for modal component
 * @returns 
 */
const Modal: FC<IModalProps> = (props) => {
    const {
        title, closeHandler,
        children, width, height,
        actionHandler, toolbarDownItems
    } = props;

    /**
     * Processing of pressing the A key Escape
     */
    useEffect(() => {
        const closeOnEscapeKey = e => e.key === "Escape" ? closeHandler() : null;
        document.addEventListener("keydown", closeOnEscapeKey);

        return () => {
            document.removeEventListener("keydown", closeOnEscapeKey);
        };
    }, [closeHandler]);

    useLockBodyScroll(true);

    return (
        <Portal>
            <FocusLock autoFocus={false}>
                <div
                    className={styles.container}
                >
                    <div className={styles.holder}
                        style={{
                            width: `${width}px`,
                            height: `${height}px`
                        }}
                    >
                        <div className={styles.up_controls}>
                            {
                                title && <p className={styles.title}>{title}</p>
                            }

                            <IconRouter.CrossCircleIcon
                                width={30}
                                height={30}
                                clickHandler={closeHandler}
                            />
                        </div>

                        <div className={styles.content} style={{
                            width: `${(width - 30)}px`,
                            marginLeft: '15px',
                            maxHeight: `${height - 100}px`
                        }}>
                            {children}
                        </div>

                        {
                            // Defining the bottom buttons
                            toolbarDownItems && toolbarDownItems.length > 0 && <div className={styles.down_controls}>
                                {
                                    toolbarDownItems.map((item, key) => {
                                        return (
                                            <Fragment>
                                                <Button
                                                    label={item.label}
                                                    title={item.title}
                                                    clickHandler={item.action}
                                                    width={item.width}
                                                />
                                            </Fragment>
                                        );
                                    })
                                }
                            </div>
                        }
                    </div>
                </div>
            </FocusLock>
        </Portal>
    )
};

export default Modal;