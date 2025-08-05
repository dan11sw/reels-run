import { FC } from "react";
import styles from "./QuestList.module.scss";
import { useAppDispatch, useAppSelector } from "src/hooks/redux.hook";
import IconRouter from "src/components/Icons/Routers/IconRouter";
import Button from "src/components/UI/Button";
import Input from "src/components/UI/Input";
import TextArea from "src/components/UI/TextArea";
import InputRange from "src/components/UI/InputRange";
import ICreatorAction from "src/store/actions/Creator/internal/ICreatorAction";
import messageQueueAction from "src/store/actions/MessageQueueAction";

export interface IQuestListProps {
    updateQuestId: number;
    setUpdateQuestId: React.Dispatch<React.SetStateAction<number>>;
    setEventScroll: React.Dispatch<React.SetStateAction<number>>;
}

/**
 * Функциональный компонент для демонстрации созданных на странице квестов
 * @returns 
 */
const QuestList: FC<IQuestListProps> = (props) => {
    const iCreatorSlice = useAppSelector((s) => s.iCreatorReducer);
    const dispatch = useAppDispatch();

    return (
        <>
            <div className={styles.container}>
                <h2>Добавленные квесты</h2>
                <div className={styles.questList}>
                    {iCreatorSlice.quests !== null &&
                        iCreatorSlice.quests.map((item) => (
                            <div
                                key={item.id}
                                className={styles.quest}
                            >
                                {/* Блок для заполнения информации о каждом отдельном квесте */}
                                <Input
                                    label="Местоположение"
                                    name="location"
                                    defaultValue={item.mark.location}
                                    readOnly
                                />

                                <Input
                                    label="Подсказка"
                                    name="hint"
                                    defaultValue={item.hint}
                                    readOnly
                                />
                                <TextArea
                                    label="Задача"
                                    name="task"
                                    defaultValue={item.task}
                                    readOnly
                                />
                                <TextArea
                                    label="Действие"
                                    name="action"
                                    defaultValue={item.action}
                                    readOnly
                                />
                                <InputRange
                                    label="Радиус действия"
                                    name="radius"
                                    defaultValue={item.radius}
                                    readOnly
                                />
                                <div className={styles.controls}>
                                    <Button
                                        label="Удалить"
                                        clickHandler={() => {
                                            if (item.id) {
                                                dispatch(ICreatorAction.removeQuest(item.id, () => {
                                                    dispatch(messageQueueAction.addMessage(null, "dark", "Квест удалён"));
                                                }));
                                            }
                                        }}
                                    />
                                    <Button
                                        label="Изменить"
                                        clickHandler={() => {
                                            if (item.id) {
                                                props.setUpdateQuestId(item.id);
                                                props.setEventScroll(Math.random() + 1);
                                            }

                                            /*let marker = getMarkerState(dataMarks, {
                                                lat: parseFloat(item.lat),
                                                lng: parseFloat(item.lng),
                                            });

                                            if (!marker) {
                                                return;
                                            }

                                            let quests = listQuests.quests;
                                            let index = findQuestByLatLng(marker.lat, marker.lng);
                                            if (index < 0) {
                                                message("Данного квеста нет в списке!", "error");
                                                return;
                                            }

                                            window.scrollTo({ top: 0, behavior: "smooth" }); // возвращение к началу страницы
                                            setBlockEditQuest({
                                                display: "grid",
                                            });

                                            // Открытие блока для добавления квеста
                                            setBlockQuest({
                                                display: "grid",
                                            });

                                            setDataQuest({
                                                task: quests[index].task,
                                                action: quests[index].action,
                                                radius: quests[index].radius,
                                                hint: quests[index].hint,
                                            });

                                            setDataCurrentMark({
                                                location: quests[index].location,
                                                lat: quests[index].lat,
                                                lng: quests[index].lng,
                                            });

                                            message("Редактирование квеста", "info");*/
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </>
    );
};

export default QuestList;
