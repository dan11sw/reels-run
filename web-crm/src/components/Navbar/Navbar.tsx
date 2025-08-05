import { FC } from "react";
import styles from "./Navbar.module.css";
import IconRouter from "../Icons/Routers/IconRouter";
import Dropdown from "../UI/Dropdown";
import { DropdownOption } from "../UI/Dropdown/Dropdown";
import NetmanPng from "src/assets/images/netman.png";
import { useAppDispatch, useAppSelector } from "src/hooks/redux.hook";
import AuthAction from "src/store/actions/AuthAction";
import messageQueueAction from "src/store/actions/MessageQueueAction";
import { useNavigate } from "react-router-dom";
import BaseRoute from "src/constants/routes/base.route";
import CreatorRoute from "src/constants/routes/creator.route";

const optionsUserProfile: DropdownOption[] = [
    {
        id: 1,
        label: "Главная",
        path: BaseRoute.HOME
    },
    {
        id: 2,
        label: "Профиль"
    },
    {
        id: 3,
        label: "Выход"
    }
];

const optionsCreator: DropdownOption[] = [
    {
        id: 1,
        label: "Создать игру",
        path: CreatorRoute.CREATE_GAME
    },
    {
        id: 2,
        label: "Созданные игры",
        path: CreatorRoute.GAME_LIST
    },
    {
        id: 3,
        label: "Список меток",
        path: CreatorRoute.MARK_LIST
    }
];

const Navbar: FC<any> = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const userProfileClick = (id: number) => {
        const index = optionsUserProfile.findIndex((item) => {
            return item.id === id;
        });

        if ((index >= 0) && (optionsUserProfile[index].label.trim().toLowerCase() === "выход")) {
            dispatch(AuthAction.logout(() => {
                navigate(BaseRoute.SIGN_IN);
                dispatch(messageQueueAction.addMessage(null, "dark", "Вы вышли из системы!"));
            }))
        } else if (index >= 0) {
            const option = optionsUserProfile[index];
            option.path && navigate(option.path);
        }
    };

    const creatorClick = (id: number) => {
        const index = optionsUserProfile.findIndex((item) => {
            return item.id === id;
        });

        if (index >= 0) {
            const option = optionsCreator[index];
            option.path && navigate(option.path);
        }
    };

    return (
        <>
            <div className={styles.navbar}>
                <div>
                    <Dropdown
                        position={"center"}
                        options={optionsUserProfile}
                        clickHandler={userProfileClick}
                    >
                        <IconRouter.UserProfileIcon />
                    </Dropdown>
                </div>
                <div>
                    <Dropdown
                        label={"Создатель"}
                        position={"left"}
                        options={optionsCreator}
                        clickHandler={creatorClick}
                    />
                </div>
                <div className={styles.image}>
                    <h1>Система управления ReelsRun</h1>
                </div>
            </div>
        </>
    );
};

export default Navbar;
