import React, { FC, useCallback, useEffect, useState } from "react";
import styles from "./MarkListPage.module.scss";
import Table from "src/components/Table";
import IconRouter from "src/components/Icons/Routers/IconRouter";
import Modal from "src/components/Modal";
import { useAppDispatch, useAppSelector } from "src/hooks/redux.hook";
import ECreatorAction from "src/store/actions/Creator/external/ECreatorAction";
import { DateTime } from "luxon";
import { isUndefinedOrNull } from "src/types/void_null";
import messageQueueAction from "src/store/actions/MessageQueueAction";
import Loader from "src/components/UI/Loader";
import useOutsideClick from "src/hooks/useOutsideClick";
import { useNavigate } from "react-router-dom";
import CreatorRoute from "src/constants/routes/creator.route";
import { IMarkInfo } from "src/models/ICreatorModel";
import MarkModal from "src/components/Modals/Marks/MarkModal";

export interface IGameItem {
    id: number;
    title: string;
    location: string;
    created_at: string;
    updated_at: string;
    count_quests: number;
};

/**
 * Список созданных игр
 * @returns 
 */
const MarkListPage: FC<any> = () => {
    const navigate = useNavigate();

    const [select, setSelect] = useState<number | null>(null);
    const [hover, setHover] = useState<number | null>(null);
    const [deleteItem, setDeleteItem] = useState<IMarkInfo | null>(null);

    const markModalExecute = () => {
        dispatch(ECreatorAction.getCreatedMarks());
    };

    /* ------------------ Состояние для контроля модального окна добавления новой записи ------------------ */
    const [openAddMark, setOpenAddMark] = useState(false);

    const openAddMarkModal = () => {
        setOpenAddMark(true);
    }

    const closeAddMarkModal = () => {
        setOpenAddMark(false);
    };
    /* ---------------------------------------------------------------------------------------------------- */

     /* ------------------ Состояние для контроля модального окна редактирования записи ------------------ */
    const [openEditMark, setOpenEditMark] = useState(false);

    const openEditMarkModal = () => {
        setOpenEditMark(true);
    }

    const closeEditMarkModal = () => {
        setOpenEditMark(false);
    };
    /* ---------------------------------------------------------------------------------------------------- */

    const selectorCreator = useAppSelector((s) => s.eCreatorReducer);
    const dispatch = useAppDispatch();

    // Обработчик клика вне таблицы
    const outsideClickHandle = useCallback(() => {
        if (!deleteItem) {
            setSelect(null);
        }
    }, [deleteItem]);

    // Ссылка для связывания с конкретным элементом
    const refOutside = useOutsideClick(outsideClickHandle);

    const deleteItemConfirm = (item: IMarkInfo) => {
        setDeleteItem(item);
    };

    const deleteItemHandler = () => {

    };

    const closeDeleteModal = () => {
        setDeleteItem(null);
    };

    const onMouseEnterHandler = (item: IMarkInfo) => {
        setHover(item.id);
    };

    const onMouseLeaveHandler = () => {
        setHover(null);
    };

    const renderMarkItem = (item: IMarkInfo) => {
        let defClass: string | null = null;

        if (select === item.id) {
            defClass = styles.rowItemSelect;
        } else if (hover === item.id) {
            defClass = styles.rowItemHover;
        } else {
            defClass = styles.rowItem;
        }

        return (
            <div
                data-id={item.id}
                className={defClass}
                onMouseEnter={() => {
                    onMouseEnterHandler(item);
                }}
                onClick={() => {
                    if (item.id === select) {
                        setSelect(null);
                    } else {
                        setSelect(item.id);
                    }
                }}
            >
                <div className={styles.rowCell}>
                    <p title={String(item.id)}>{item.id}</p>
                </div>
                <div className={styles.rowCell}>
                    <p title={item.description}>{item.title}</p>
                </div>
                <div className={styles.rowCell}>
                    <p title={item.location}>{item.location}</p>
                </div>
                <div className={styles.rowCell}>
                    <p title={String(item.lng)}>{item.lng}</p>
                </div>
                <div className={styles.rowCell}>
                    <p title={String(item.lat)}>{item.lat}</p>
                </div>
                <div className={styles.row} style={{ width: "81px" }}>
                    <IconRouter.PencilIcon
                        width={32}
                        height={32}
                        color="#ffffff"
                        clickHandler={(e) => {
                            e?.stopPropagation();

                            /*const path = CreatorRoute.EDIT_GAME.replace(":id", item.id.toString());

                            window.scrollTo(0, 0);
                            navigate(path);*/
                        }}
                    />
                    <IconRouter.DeleteIcon
                        width={26}
                        height={26}
                        color="#ff0000"
                        clickHandler={(e) => {
                            e?.stopPropagation();
                            deleteItemConfirm(item);
                        }}
                    />
                </div>
            </div>
        );
    };

    const renderControlButtons = () => {
        return <div className={styles.addIconContainer}>
            <IconRouter.AddElementIcon
                width={40}
                height={40}
                clickHandler={openAddMarkModal}
            />
        </div>;
    };

    const deleteGameHandler = useCallback(() => {
        if (deleteItem) {
            dispatch(ECreatorAction.deleteGame({
                info_games_id: deleteItem.id
            }, () => {
                setDeleteItem(null);
                dispatch(messageQueueAction.addMessage(null, "success", "Игра успешно удалена"));
                dispatch(ECreatorAction.getCreatedGames());
            }));
        }
    }, [deleteItem]);

    const toolbarDownItems = [
        {
            action: deleteGameHandler,
            title: "Удалить метку",
            label: "Да",
            width: 64
        },
        {
            action: closeDeleteModal,
            title: "Не удалять метку",
            label: "Нет",
            width: 64
        }
    ];

    useEffect(() => {
        dispatch(ECreatorAction.getCreatedMarks());
    }, []);

    return (
        <>
            <div className={styles.container}>
                <h2>Список игровых меток</h2>
                <Table
                    extBodyRef={refOutside}
                    columns={["ID", "Наименование", "Локация", "latitude", "longtitude"]}
                    data={selectorCreator.marks}
                    renderItem={renderMarkItem}
                    renderControls={renderControlButtons}
                    onMouseLeaveHandler={onMouseLeaveHandler}
                />
            </div>

            {
                deleteItem && <Modal
                    title="Подтверждение удаления"
                    actionHandler={deleteItemHandler}
                    closeHandler={closeDeleteModal}
                    width={500}
                    height={200}
                    toolbarDownItems={toolbarDownItems}
                >
                    <div className={styles.columnModal}>
                        <p>Вы действительно хотите удалить метку по локации "{deleteItem.location}"?</p>
                        <p>Все данные о метке будут удалены.</p>
                    </div>
                </Modal>
            }

            {
                openAddMark && <MarkModal
                    openModal={true}
                    closeModal={closeAddMarkModal}
                    callbackExecute={markModalExecute}
                />
            }

            {
                openEditMark && <MarkModal
                    openModal={true}
                    closeModal={closeEditMarkModal}
                    callbackExecute={markModalExecute}
                />
            }

            {
                selectorCreator.isLoading && <Loader />
            }
        </>
    )
};

export default MarkListPage;