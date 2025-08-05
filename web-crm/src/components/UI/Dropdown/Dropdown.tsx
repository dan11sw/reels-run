import { FC, useEffect, useRef, useState } from "react";
import styles from "./Dropdown.module.css";
import { VOID_NULL } from "src/types/void_null";
import { DirectionType } from "src/types/ui";

export type DropdownOption = {
    id: number;
    label: string;
    path?: string;
}

export interface IDropdownProps {
    label?: string;
    children?: React.ReactNode;
    position?: DirectionType;
    options?: DropdownOption[];
    clickHandler?: (id: number) => void;
}

const Dropdown: FC<IDropdownProps> = (props) => {
    const {
        label, children, position = "left",
        options, clickHandler
    } = props;

    const container = useRef<HTMLDivElement | null>(null);
    const [dropdownState, setDropdownState] = useState({ open: false });

    const handleDropdownClick = () => {
        setDropdownState({ open: !dropdownState.open });
    };

    const handleClickOutside = (e) => {
        if (container.current && !container.current.contains(e.target)) {
            setDropdownState({ open: false });
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        }
    }, []);

    const renderLabel = () => {
        if (children) {
            return (
                <>
                    <div
                        onClick={handleDropdownClick}
                    >
                        {children}
                    </div>
                </>
            );
        }

        return (
            <>
                <button
                    type="button"
                    className={styles.button}
                    onClick={handleDropdownClick}
                >
                    {label}
                </button>
            </>
        );
    };

    const getStyles = () => {
        if (!container.current) {
            return {};
        }

        const rect = container.current?.getBoundingClientRect();
        const style = {
            minWidth: `${rect.width}px`
        };

        if (position === "left") {
            return style;
        } else if (position === "right") {
            return {
                ...style,
                right: 0
            }
        } else if (position === "center") {
            return {
                ...style,
                left: '50%',
                transform: 'translate(-50%)'
            };
        }

        return style;
    };

    return (
        <div className={styles.container} ref={container}>
            {renderLabel()}
            {dropdownState.open && options && options.length > 0 && (
                <div
                    className={styles.dropdown}
                    style={getStyles()}
                >
                    <ul>
                        {
                            options.map((item, index) => {
                                return (
                                    <>
                                        <li
                                            key={index}
                                            onClick={() => {
                                                clickHandler && clickHandler(item.id);
                                                handleDropdownClick();
                                            }}
                                        >
                                            {item.label}
                                        </li>
                                    </>
                                );
                            })
                        }
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Dropdown;
