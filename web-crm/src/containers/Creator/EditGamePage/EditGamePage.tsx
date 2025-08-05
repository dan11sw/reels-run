import { FC, useEffect, useRef, useState } from "react";
import styles from "./EditGamePage.module.scss";
import GameParams from "src/components/pages/CreateGamePage/GameParams";
import Button from "src/components/UI/Button";
import QuestEditor from "src/components/pages/CreateGamePage/QuestEditor";
import QuestList from "src/components/pages/CreateGamePage/QuestList";
import Modal from "src/components/Modal";
import { InputValueType } from "src/types/input";
import { IMark } from "src/models/IMarkModel";
import Input from "src/components/UI/Input";
import { useAppDispatch, useAppSelector } from "src/hooks/redux.hook";
import messageQueueAction from "src/store/actions/MessageQueueAction";
import MarkAction from "src/store/actions/Map/MarkAction";
import { ICreateGameModel, IGameModel } from "src/models/IGameModel";
import { IQuestGameModel } from "src/models/IQuestModel";
import ECreatorAction from "src/store/actions/Creator/external/ECreatorAction";
import ICreatorAction from "src/store/actions/Creator/internal/ICreatorAction";
import { useNavigate, useParams } from "react-router-dom";
import CreatorRoute from "src/constants/routes/creator.route";

const markDefault: IMark = {
    title: '',
    description: '',
    location: '',
    lat: 0,
    lng: 0
};

/**
 * Функциональный компонент изменения игры
 * @returns 
 */
const EditGamePage: FC<any> = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const iCreatorSlice = useAppSelector((s) => s.iCreatorReducer);
    const eCreatorSlice = useAppSelector((s) => s.eCreatorReducer);
    const dispatch = useAppDispatch();

    const [eventScroll, setEventScroll] = useState(0);
    const [updateQuestId, setUpdateQuestId] = useState<number>(-1);
    const [openAddMark, setOpenAddMark] = useState(false);

    useEffect(() => {
        if (id && !Number.isNaN(Number(id))) {
            dispatch(ECreatorAction.gameInfo({
                info_games_id: Number(id)
            }, (value) => {
                setDataGame({
                    id: value.id,
                    title: value.title || "",
                    location: value.location || ""
                });

                if (value.quests) {
                    dispatch(ICreatorAction.setQuests(value.quests));
                }
            }));
        }
    }, [id]);

    useEffect(() => {
        return () => {
            // Очистка внутреннего хранилища
            dispatch(ICreatorAction.clearAll());
        }
    }, []);

    const [dataMark, setDataMark] = useState<IMark>(markDefault);

    const [dataGame, setDataGame] = useState<IGameModel>({
        title: "",
        location: ""
    });

    const openHandler = () => {
        setOpenAddMark(true);
    }

    const closeHandler = () => {
        setOpenAddMark(false);
    };

    const updateGameHandler = () => {
        if (dataGame.title.trim().length === 0) {
            dispatch(messageQueueAction.addMessage(null, "error", "Необходимо ввести наименование игры"));
            return;
        }

        if (iCreatorSlice.quests.length === 0) {
            dispatch(messageQueueAction.addMessage(null, "error", "Необходимо добавить как минимум 1 квест"));
            return;
        }

        const data = {
            ...dataGame,
            id: undefined,
            info_games_id: dataGame.id,
            quests: iCreatorSlice.quests.map((value) => {
                return {
                    hint: value.hint,
                    action: value.action,
                    task: value.task,
                    marks_id: value.mark.id,
                    radius: value.radius
                } as IQuestGameModel
            })
        } as ICreateGameModel;

        dispatch(ECreatorAction.updateGame(data, () => {
            dispatch(messageQueueAction.addMessage(null, "success", "Игра успешно изменена"));
            dispatch(ICreatorAction.clearAll());

            window.scrollTo(0, 0);

            // Переход к списку созданных игр
            navigate(CreatorRoute.GAME_LIST);
        }));
    };

    const inputChangeHandler = <K extends keyof IMark>(type: K) => {
        return (value: InputValueType) => {
            if (value) {
                const mark = JSON.parse(JSON.stringify(dataMark)) as IMark;

                if (typeof mark[type] == "string") {
                    mark[type] = String(value) as IMark[K];
                } else if (typeof mark[type] == "number") {
                    if (String(value).trim().length === 0) {
                        mark[type] = 0 as IMark[K];
                    } else {
                        mark[type] = Number(value) as IMark[K];
                    }
                }

                setDataMark(mark);
            }
        };
    };

    const addMarkHandler = () => {
        if (dataMark.location.trim().length === 0) {
            dispatch(messageQueueAction.addMessage(null, "error", "Необходимо добавить местоположение"));
            return;
        } else if (!dataMark.lat) {
            dispatch(messageQueueAction.addMessage(null, "error", "Необходимо добавить координату lat"));
            return;
        } else if (!dataMark.lng) {
            dispatch(messageQueueAction.addMessage(null, "error", "Необходимо добавить координату lng"));
            return;
        }

        if (dataMark.lat > 90 || dataMark.lat < -90) {
            dispatch(messageQueueAction.addMessage(null, "error", "Значение координаты lat должно быть на отрезке (-90; 90)"));
            return;
        } else if (dataMark.lng > 180 || dataMark.lng < -180) {
            dispatch(messageQueueAction.addMessage(null, "error", "Значение координаты lat должно быть на отрезке (-180; 180)"));
            return;
        }

        dispatch(MarkAction.createMark(dataMark, () => {
            dispatch(messageQueueAction.addMessage(null, "success", "Новая метка успешно добавлена!"));
            dispatch(MarkAction.getFreeMarks());
            setOpenAddMark(false);
            setDataMark(markDefault);
        }));
    };

    const toolbarDownItems = [
        {
            action: addMarkHandler,
            title: "Добавить игру",
            label: "Добавить"
        },
        {
            action: closeHandler,
            title: "Закрыть",
            label: "Закрыть"
        }
    ];

    return (
        <>
            <div className={styles.page}>
                <GameParams
                    title={"Изменение параметров игры"}
                    dataGame={dataGame}
                    setDataGame={setDataGame}
                />
                <Button
                    label={"Добавить новую метку на карту"}
                    width={300}
                    clickHandler={openHandler}
                />
                <QuestEditor
                    eventScroll={eventScroll}
                    updateQuestId={updateQuestId}
                    setUpdateQuestId={setUpdateQuestId}
                />
                <QuestList
                    updateQuestId={updateQuestId}
                    setUpdateQuestId={setUpdateQuestId}
                    setEventScroll={setEventScroll}
                />
                <Button
                    label={"Изменить игру"}
                    width={300}
                    clickHandler={updateGameHandler}
                />
                {
                    openAddMark && <Modal
                        title="Добавление новой метки"
                        actionHandler={addMarkHandler}
                        closeHandler={closeHandler}
                        width={500}
                        height={400}
                        toolbarDownItems={toolbarDownItems}
                    >
                        <div className={styles.modal_container}>
                            <div className={styles.modal_add_mark}>
                                <Input
                                    name="title"
                                    label="Название"
                                    defaultValue={''}
                                    changeHandler={inputChangeHandler("title")}
                                    width={"300px"}
                                    required
                                />
                                <Input
                                    name="location"
                                    label="Местоположение"
                                    defaultValue={''}
                                    changeHandler={inputChangeHandler("location")}
                                    width={"300px"}
                                    required
                                />
                                <Input
                                    name="location"
                                    label="Местоположение"
                                    defaultValue={''}
                                    changeHandler={inputChangeHandler("location")}
                                    width={"300px"}
                                    required
                                />
                                <Input
                                    type="number"
                                    name="lat"
                                    label="Координата lat"
                                    defaultValue={''}
                                    changeHandler={inputChangeHandler("lat")}
                                    width={"300px"}
                                    required
                                />
                                <Input
                                    type="number"
                                    name="lng"
                                    label="Координата lng"
                                    defaultValue={''}
                                    changeHandler={inputChangeHandler("lng")}
                                    width={"300px"}
                                    required
                                />
                            </div>
                        </div>
                    </Modal>
                }
            </div>
        </>
    );
};

export default EditGamePage;
