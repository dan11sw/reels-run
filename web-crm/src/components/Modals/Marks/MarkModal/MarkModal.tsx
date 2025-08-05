import { FC, useEffect, useState } from "react";
import styles from "./MarkModal.module.scss";
import Modal from "src/components/Modal";
import { InputValueType } from "src/types/input";
import { IMark } from "src/models/IMarkModel";
import Input from "src/components/UI/Input";
import { useAppDispatch } from "src/hooks/redux.hook";
import messageQueueAction from "src/store/actions/MessageQueueAction";
import MarkAction from "src/store/actions/Map/MarkAction";
import ICreatorAction from "src/store/actions/Creator/internal/ICreatorAction";
import TextArea from "src/components/UI/TextArea";
import { checkClipboardReadSupport } from "src/utils/clipboard";
import useClipboard from "src/hooks/useClipboard";
import ClipboardIcon from "src/components/Icons/Resources/ClipboardIcon";
import { isUndefinedOrNull } from "src/types/void_null";
import { getNumberFloat } from "src/utils/number";

export interface IAddMarkModalProps {
    id?: number;
    openModal: boolean;
    closeModal: () => void;
    callbackExecute?: () => void;
}

export type IMarkDataState = {
    value: IMark;
    defaultValue: IMark;
}

const markDefault: IMarkDataState = {
    value: {
        title: '',
        description: '',
        location: '',
        lat: 0,
        lng: 0
    },
    defaultValue: {
        title: '',
        description: '',
        location: '',
        lat: 0,
        lng: 0
    }
};

const MarkModal: FC<IAddMarkModalProps> = (props: IAddMarkModalProps) => {
    const {
        id, openModal, closeModal,
        callbackExecute
    } = props;

    const [dataMark, setDataMark] = useState<IMarkDataState>(markDefault);
    const dispatch = useAppDispatch();

    useEffect(() => {
        return () => {
            // Очистка внутреннего хранилища
            dispatch(ICreatorAction.clearAll());
        }
    }, []);

    const inputChangeHandler = <K extends keyof IMark>(type: K, withDefault: boolean = false) => {
        return (value: InputValueType) => {
            if (value) {
                const mark = structuredClone(dataMark); // JSON.parse(JSON.stringify(dataMark)) as IMark;

                if (typeof mark.value[type] == "string") {
                    mark.value[type] = String(value) as IMark[K];

                    if (withDefault) {
                        mark.defaultValue[type] = String(value) as IMark[K];
                    }
                } else if (typeof mark.value[type] == "number") {
                    if (String(value).trim().length === 0) {
                        mark.value[type] = 0 as IMark[K];

                        if (withDefault) {
                            mark.defaultValue[type] = 0 as IMark[K];
                        }
                    } else {
                        mark.value[type] = Number(value) as IMark[K];

                        if (withDefault) {
                            mark.defaultValue[type] = Number(value) as IMark[K];
                        }
                    }
                }

                setDataMark(mark);
            }
        };
    };

    const addMarkHandler = () => {
        if (dataMark.value.location.trim().length === 0) {
            dispatch(messageQueueAction.addMessage(null, "error", "Необходимо добавить местоположение"));
            return;
        } else if (!dataMark.value.lat) {
            dispatch(messageQueueAction.addMessage(null, "error", "Необходимо добавить координату lat"));
            return;
        } else if (!dataMark.value.lng) {
            dispatch(messageQueueAction.addMessage(null, "error", "Необходимо добавить координату lng"));
            return;
        }

        if (dataMark.value.lat > 90 || dataMark.value.lat < -90) {
            dispatch(messageQueueAction.addMessage(null, "error", "Значение координаты lat должно быть на отрезке (-90; 90)"));
            return;
        } else if (dataMark.value.lng > 180 || dataMark.value.lng < -180) {
            dispatch(messageQueueAction.addMessage(null, "error", "Значение координаты lat должно быть на отрезке (-180; 180)"));
            return;
        }

        dispatch(MarkAction.createMark(dataMark.value, () => {
            dispatch(messageQueueAction.addMessage(null, "success", "Новая метка успешно добавлена!"));
            closeModal();
            setDataMark(markDefault);

            callbackExecute && callbackExecute();
        }));
    };

    const toolbarDownItems = [
        {
            action: addMarkHandler,
            title: "Добавить игру",
            label: "Добавить"
        },
        {
            action: closeModal,
            title: "Закрыть",
            label: "Закрыть"
        }
    ];

    const [clipboardState] = useClipboard();
    const clickClickboardHandler = () => {
        checkClipboardReadSupport((value) => {
            if (!value || (value.length === 0)) {
                dispatch(messageQueueAction.addMessage(null, "error", "Данные из буфера обмена не могут быть использованы (не верный формат)"));
                return;
            }

            const values = value.split(", ");
            if (values.length !== 2) {
                dispatch(messageQueueAction.addMessage(null, "error", "Данные из буфера обмена не могут быть использованы (не верный формат)"));
                return;
            }

            const lat = getNumberFloat(values[0]);
            const lng = getNumberFloat(values[1]);

            if (isUndefinedOrNull(lat) || isUndefinedOrNull(lng)) {
                dispatch(messageQueueAction.addMessage(null, "error", "Данные из буфера обмена не могут быть использованы (не верный формат)"));
                return;
            }

            const lat1 = lat as number;
            const lng1 = lng as number;

            const mark = structuredClone(dataMark);
            mark.value.lat = lat1;
            mark.defaultValue.lat = lat1;

            mark.value.lng = lng1;
            mark.defaultValue.lng = lng1;

            setDataMark(mark);
        });
    };

    useEffect(() => {
        if (!openModal) {
            setDataMark(markDefault);
        }
    }, [openModal]);

    return (
        openModal ? <Modal
            title="Добавление новой метки"
            actionHandler={addMarkHandler}
            closeHandler={closeModal}
            width={500}
            height={400}
            toolbarDownItems={toolbarDownItems}
        >
            <div className={styles.modal_container}>
                <div className={styles.modal_add_mark}>
                    <Input
                        name="title"
                        label="Название"
                        defaultValue={dataMark.defaultValue.title}
                        changeHandler={inputChangeHandler("title")}
                        width={"360px"}
                        required
                    />
                    <TextArea
                        name="description"
                        label="Описание"
                        defaultValue={dataMark.defaultValue.description}
                        changeHandler={inputChangeHandler("description")}
                        width={"360px"}
                        required
                    />
                    <Input
                        name="location"
                        label="Местоположение"
                        defaultValue={dataMark.defaultValue.location}
                        changeHandler={inputChangeHandler("location")}
                        width={"360px"}
                        required
                    />
                    <Input
                        type="number"
                        name="lat"
                        label="Координата lat"
                        labelRender={(clipboardState.canRead) ? () => {
                            return <>
                                <ClipboardIcon
                                    title="Вставить из буфера обмена?"
                                    clickHandler={() => {
                                        clickClickboardHandler();
                                    }}
                                />
                            </>;
                        } : undefined}
                        defaultValue={dataMark.defaultValue.lat}
                        changeHandler={inputChangeHandler("lat")}
                        width={"360px"}
                        required
                    />
                    <Input
                        type="number"
                        name="lng"
                        label="Координата lng"
                        defaultValue={dataMark.defaultValue.lng}
                        changeHandler={inputChangeHandler("lng")}
                        width={"360px"}
                        required
                    />
                </div>
            </div>
        </Modal> : <></>
    );
};

export default MarkModal;
