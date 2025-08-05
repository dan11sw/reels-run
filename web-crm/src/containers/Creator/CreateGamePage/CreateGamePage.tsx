import { FC, useEffect, useState } from "react";
import styles from "./CreateGamePage.module.scss";
import GameParams from "src/components/pages/CreateGamePage/GameParams";
import Button from "src/components/UI/Button";
import QuestEditor from "src/components/pages/CreateGamePage/QuestEditor";
import QuestList from "src/components/pages/CreateGamePage/QuestList";
import { useAppDispatch, useAppSelector } from "src/hooks/redux.hook";
import messageQueueAction from "src/store/actions/MessageQueueAction";
import { ICreateGameModel, IGameModel } from "src/models/IGameModel";
import { IQuestGameModel } from "src/models/IQuestModel";
import ECreatorAction from "src/store/actions/Creator/external/ECreatorAction";
import ICreatorAction from "src/store/actions/Creator/internal/ICreatorAction";
import { useNavigate } from "react-router-dom";
import CreatorRoute from "src/constants/routes/creator.route";
import MarkModal from "src/components/Modals/Marks/MarkModal";
import MarkAction from "src/store/actions/Map/MarkAction";

const CreateGamePage: FC<any> = () => {
    const navigate = useNavigate();

    const iCreatorSlice = useAppSelector((s) => s.iCreatorReducer);
    const dispatch = useAppDispatch();

    const [eventScroll, setEventScroll] = useState(0);
    const [updateQuestId, setUpdateQuestId] = useState<number>(-1);
    const [openAddMark, setOpenAddMark] = useState(false);

    const openMarkModal = () => {
        setOpenAddMark(true);
    };

    const closeMarkModal = () => {
        setOpenAddMark(false);
    };

    const markModalExecute = () => {
        // Получаем все свободные метки
        dispatch(MarkAction.getFreeMarks());
    };

    useEffect(() => {
        return () => {
            // Очистка внутреннего хранилища
            dispatch(ICreatorAction.clearAll());
        }
    }, []);

    const [dataGame, setDataGame] = useState<IGameModel>({
        title: "",
        location: ""
    });

    const createGameHandler = () => {
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

        dispatch(ECreatorAction.createGame(data, () => {
            dispatch(messageQueueAction.addMessage(null, "success", "Новая игра успешно создана!"));
            dispatch(ICreatorAction.clearAll());

            window.scrollTo(0, 0);

            // Переход к списку созданных игр
            navigate(CreatorRoute.GAME_LIST);
        }));
    };

    return (
        <>
            <div className={styles.page}>
                <GameParams
                    dataGame={dataGame}
                    setDataGame={setDataGame}
                />
                <Button
                    label={"Добавить новую метку на карту"}
                    width={300}
                    clickHandler={openMarkModal}
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
                    label={"Создать новую игру"}
                    width={300}
                    clickHandler={createGameHandler}
                />
                {
                    openAddMark && <MarkModal
                        openModal={true}
                        closeModal={closeMarkModal}
                        callbackExecute={markModalExecute}
                    />
                }
            </div>
        </>
    );
};

export default CreateGamePage;
