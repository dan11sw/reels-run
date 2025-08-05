import { FC } from "react";
import styles from "./GameParams.module.scss";
import Input from "src/components/UI/Input";
import { IGameModel } from "src/models/IGameModel";
import { InputValueType } from "src/types/input";

export interface IGameParamsProps {
    title?: string;
    dataGame: IGameModel;
    setDataGame: React.Dispatch<React.SetStateAction<IGameModel>>;
}

const defaultTitle = "Создание новой игры";

const GameParams: FC<IGameParamsProps> = (props) => {
    const { title = defaultTitle, dataGame, setDataGame } = props;

    const inputChangeHandler = (type: string) => {
        return (value: InputValueType) => {
            setDataGame({
                ...dataGame,
                [type]: String(value)
            });
        };
    };

    return (
        <>
            <div className={styles.container}>
                <h2>{title}</h2>
                <div className={styles.params}>
                    <div className={styles.column}>
                        <Input
                            label="Название игры"
                            name={"title"}
                            required={true}
                            defaultValue={dataGame.title}
                            changeHandler={inputChangeHandler("title")}
                        />
                        <Input
                            label="Город"
                            name={"location"}
                            defaultValue={dataGame.location}
                            changeHandler={inputChangeHandler("location")}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default GameParams;
