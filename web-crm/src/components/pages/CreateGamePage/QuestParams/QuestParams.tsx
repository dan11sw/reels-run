import { FC, forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import styles from "./QuestParams.module.css";
import Input from "src/components/UI/Input";
import TextArea from "src/components/UI/TextArea";
import InputRange from "src/components/UI/InputRange";
import Button from "src/components/UI/Button";
import { useAppDispatch, useAppSelector } from "src/hooks/redux.hook";
import messageQueueAction from "src/store/actions/MessageQueueAction";
import { InputValueType } from "src/types/input";
import { IMarkModel } from "src/models/IMarkModel";
import { IQuestDataModel } from "src/models/IQuestModel";
import { v4 } from "uuid";
import ICreatorAction from "src/store/actions/Creator/internal/ICreatorAction";
import { FunctionVOID } from "src/types/function";
import { isUndefinedOrNull } from "src/modules/ModuleObjector";

export interface IQuestParamsProps {
    dataQuest: IQuestDataModel;
    setDataQuest: React.Dispatch<React.SetStateAction<IQuestDataModel>>;
    selectMark: IMarkModel;
    clearSelectMark: FunctionVOID;
    clearDataQuest: FunctionVOID;
}

export type QuestParamsHandle = {
    scrollToElement: () => void;
};

/**
 * Функциональный компонент параметров квеста
 */
const QuestParams = forwardRef<QuestParamsHandle, IQuestParamsProps>((props, ref) => {
    const {
        selectMark, dataQuest, setDataQuest,
        clearSelectMark, clearDataQuest
    } = props;

    const iCreatorSelector = useAppSelector((s) => s.iCreatorReducer);
    const dispatch = useAppDispatch();

    const containerRef = useRef<HTMLDivElement>(null);

    const inputChangeHandler = (type: string) => {
        return (value: InputValueType) => {
            setDataQuest({
                ...dataQuest,
                [type]: (type === "radius") ? Number(value) : value
            });
        };
    };

    const checkDataQuest = () => {
        return !selectMark.id || !dataQuest.hint.trim().length
            || !dataQuest.action.trim().length || dataQuest.radius <= 0;
    };

    useImperativeHandle(ref, () => {
        return {
            scrollToElement: () => {
                containerRef.current && containerRef.current.scrollIntoView({ block: 'start', behavior: 'smooth' });
            }
        }
    });

    return (
        <>
            <div
                ref={containerRef}
                className={styles.container}
            >
                <div className={styles.content}>
                    <Input
                        label="Местоположение"
                        readOnly={true}
                        defaultValue={selectMark.location}
                        required
                    />
                    <Input
                        name="hint"
                        label="Подсказка"
                        defaultValue={dataQuest.hint}
                        changeHandler={inputChangeHandler("hint")}
                        required
                    />
                    <TextArea
                        name="task"
                        label="Задача"
                        defaultValue={dataQuest.task}
                        changeHandler={inputChangeHandler("task")}
                        title="Основная задача (какова цель?)"
                        required
                    />
                    <TextArea
                        name="action"
                        label="Действие"
                        defaultValue={dataQuest.action}
                        changeHandler={inputChangeHandler("action")}
                        title="Конкретное действие (что именно нужно сделать?)"
                        required
                    />
                    <InputRange
                        name="radius"
                        label="Радиус действия"
                        defaultValue={dataQuest.radius}
                        changeHandler={inputChangeHandler("radius")}
                        title="В рамках этого радиуса пользователь сможет определить квест"
                        required
                    />
                </div>

                <div className={styles.controls}>
                    <Button
                        label={(dataQuest.id) ? "Отмена" : "Очистить"}
                        clickHandler={() => {
                            clearSelectMark();
                            clearDataQuest();

                            if (dataQuest.id) {
                                dispatch(messageQueueAction.addMessage(null, "dark", "Изменения отменены"));
                            } else {
                                dispatch(messageQueueAction.addMessage(null, "dark", "Форма очищена"));
                            }
                        }}
                    />
                    <Button
                        label={(!isUndefinedOrNull(dataQuest.id)) ? "Изменить" : "Добавить"}
                        clickHandler={() => {
                            const index = iCreatorSelector.quests.findIndex((value) => {
                                return value.mark.id === selectMark.id;
                            });

                            if (index >= 0 && isUndefinedOrNull(dataQuest.id)) {
                                dispatch(messageQueueAction.addMessage(null, "error", "Квест с данной меткой уже добавлен!"));
                                return;
                            }

                            const data = {
                                ...dataQuest,
                                mark: selectMark,
                                id: isUndefinedOrNull(dataQuest.id) ? selectMark.id : dataQuest.id
                            };

                            if (isUndefinedOrNull(data.id)) {
                                dispatch(messageQueueAction.addMessage(null, "error", "Необходимо выбрать метку!"));
                                return;
                            } else if (!data.hint.trim().length) {
                                dispatch(messageQueueAction.addMessage(null, "error", "Необходимо добавить подсказку!"));
                                return;
                            } else if (!data.action.trim().length) {
                                dispatch(messageQueueAction.addMessage(null, "error", "Необходимо добавить действие!"));
                                return;
                            } else if (data.radius <= 0) {
                                dispatch(messageQueueAction.addMessage(null, "error", "Необходимо добавить действие!"));
                                return;
                            }

                            if (dataQuest.id) {
                                // Обновляем существующую запись
                                dispatch(ICreatorAction.updateQuest(data, () => {
                                    clearSelectMark();
                                    clearDataQuest();

                                    dispatch(messageQueueAction.addMessage(null, "success", "Квест изменён!"));
                                }));
                            } else {
                                // Создаём новую запись
                                dispatch(ICreatorAction.addQuest(data, () => {
                                    clearSelectMark();
                                    clearDataQuest();

                                    dispatch(messageQueueAction.addMessage(null, "success", "Квест добавлен!"));
                                }));
                            }
                        }}
                    />
                </div>
            </div>
        </>
    );
});

export default QuestParams;
