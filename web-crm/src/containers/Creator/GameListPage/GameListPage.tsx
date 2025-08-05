import React, { FC, useCallback, useEffect, useState } from "react";
import styles from "./GameListPage.module.scss";
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
const GameListPage: FC<any> = () => {
    const navigate = useNavigate();

    const [select, setSelect] = useState<number | null>(null);
    const [hover, setHover] = useState<number | null>(null);
    const [deleteItem, setDeleteItem] = useState<IGameItem | null>(null);

    const selectorGames = useAppSelector((s) => s.eCreatorReducer);
    const dispatch = useAppDispatch();

    // Обработчик клика вне таблицы
    const outsideClickHandle = useCallback(() => {
        if (!deleteItem) {
            setSelect(null);
        }
    }, [deleteItem]);

    // Ссылка для связывания с конкретным элементом
    const refOutside = useOutsideClick(outsideClickHandle);

    const deleteItemConfirm = (item: IGameItem) => {
        setDeleteItem(item);
    };

    const deleteItemHandler = () => {

    };

    const closeDeleteModal = () => {
        setDeleteItem(null);
    };

    const onMouseEnterHandler = (item: IGameItem) => {
        setHover(item.id);
    };

    const onMouseLeaveHandler = () => {
        setHover(null);
    };

    const renderGameItem = (item: IGameItem) => {
        let defClass: string | null = null;
        if (select === item.id) {
            defClass = styles.rowItemSelect;
        } else if (hover === item.id) {
            defClass = styles.rowItemHover;
        } else {
            defClass = styles.rowItem;
        }

        const createdDate = DateTime
            .fromISO(item.created_at)
            .toFormat("dd.MM.yyyy HH:mm");

        const updatedDate = DateTime
            .fromISO(item.updated_at)
            .toFormat("dd.MM.yyyy HH:mm");

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
                    <p title={item.title}>{item.title}</p>
                </div>
                <div className={styles.rowCell}>
                    <p title={item.location}>{item.location}</p>
                </div>
                <div className={styles.rowCell}>
                    <p title={item.created_at}>{createdDate}</p>
                </div>
                <div className={styles.rowCell}>
                    <p title={item.updated_at}>{updatedDate}</p>
                </div>
                <div className={styles.rowCell}>
                    <p title={`${item.count_quests}`}>{item.count_quests}</p>
                </div>
                <div className={styles.row} style={{ width: "81px" }}>
                    <IconRouter.PencilIcon
                        width={32}
                        height={32}
                        color="#ffffff"
                        clickHandler={(e) => {
                            e?.stopPropagation();

                            const path = CreatorRoute.EDIT_GAME.replace(":id", item.id.toString());

                            window.scrollTo(0, 0);
                            navigate(path);
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
                clickHandler={() => {
                    const path = CreatorRoute.CREATE_GAME;

                    window.scrollTo(0, 0);
                    navigate(path);
                }}
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
            title: "Удалить игру",
            label: "Да",
            width: 64
        },
        {
            action: closeDeleteModal,
            title: "Не удалять игру",
            label: "Нет",
            width: 64
        }
    ];

    useEffect(() => {
        dispatch(ECreatorAction.getCreatedGames());
    }, []);

    return (
        <>
            <div className={styles.container}>
                <h2>Список созданных игр</h2>
                <Table
                    extBodyRef={refOutside}
                    columns={["Название", "Локация", "Дата создания", "Дата изменения", "Кол-во квестов"]}
                    data={selectorGames.games}
                    renderItem={renderGameItem}
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
                        <p>Вы действительно хотите удалить игру "{deleteItem.title}"?</p>
                        <p>Все данные об игре будут удалены.</p>
                    </div>
                </Modal>
            }

            {
                selectorGames.isLoading && <Loader />
            }
        </>
    )
};

export default GameListPage;