import { FC, useEffect, useState } from "react";
import styles from "./MarkModal.module.scss";
import Modal from "src/components/Modal";
import { InputValueType } from "src/types/input";
import { IMark, IMarkEx, IMarkModel } from "src/models/IMarkModel";
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
import { deepEqual } from "src/modules/DeepEqual";

export interface IAddMarkModalProps {
    data?: IMarkEx;
    openModal: boolean;
    closeModal: () => void;
    callbackExecute?: (marks_id?: number) => void;
}

export type IMarkDataState = {
    value: IMarkEx;
    defaultValue: IMarkEx;
}

const markDefault: IMarkDataState = {
    value: {
        id: -1,
        title: '',
        description: '',
        location: '',
        lat: 0,
        lng: 0
    },
    defaultValue: {
        id: -1,
        title: '',
        description: '',
        location: '',
        lat: 0,
        lng: 0
    }
};

const genDefaultValue = (data?: IMarkEx): IMarkDataState => {
    if (!data) {
        return markDefault;
    }

    return {
        value: data,
        defaultValue: data
    };
};

const MarkModal: FC<IAddMarkModalProps> = (props: IAddMarkModalProps) => {
    const {
        data, openModal, closeModal,
        callbackExecute
    } = props;

    const [dataMark, setDataMark] = useState<IMarkDataState>(genDefaultValue(data));
    const [modifyMark, setModifyMark] = useState<boolean>(false);
    const dispatch = useAppDispatch();

    useEffect(() => {
        return () => {
            // Очистка внутреннего хранилища
            dispatch(ICreatorAction.clearAll());
        }
    }, []);

    useEffect(() => {
        setModifyMark(deepEqual(dataMark.value, dataMark.defaultValue));
    }, [dataMark]);

    const inputChangeHandler = <K extends keyof IMarkEx>(type: K) => {
        const withDefault: boolean = (dataMark.value.id > 0) ? false : true;

        return (value: InputValueType) => {
            if (value) {
                const mark = JSON.parse(JSON.stringify(dataMark)) as IMarkDataState;

                if (typeof mark.value[type] == "string") {
                    mark.value[type] = String(value) as IMarkEx[K];

                    if (withDefault) {
                        mark.defaultValue[type] = String(value) as IMarkEx[K];
                    }
                } else if (typeof mark.value[type] == "number") {
                    if (String(value).trim().length === 0) {
                        mark.value[type] = 0 as IMarkEx[K];

                        if (withDefault) {
                            mark.defaultValue[type] = 0 as IMarkEx[K];
                        }
                    } else {
                        mark.value[type] = Number(value) as IMarkEx[K];

                        if (withDefault) {
                            mark.defaultValue[type] = Number(value) as IMarkEx[K];
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

        if (dataMark.value.id > 0) {
            dispatch(MarkAction.updateMark(dataMark.value, (marks_id?: number) => {
                dispatch(messageQueueAction.addMessage(null, "success", `Метка с идентификатором ${dataMark.value.id} обновлена!`));
                closeModal();
                setDataMark(markDefault);

                callbackExecute && callbackExecute(marks_id);
            }));
        } else {
            dispatch(MarkAction.createMark(dataMark.value, (marks_id?: number) => {
                dispatch(messageQueueAction.addMessage(null, "success", "Новая метка успешно добавлена!"));
                closeModal();
                setDataMark(markDefault);

                callbackExecute && callbackExecute(marks_id);
            }));
        }
    };

    const toolbarDownItems = [
        {
            action: addMarkHandler,
            title: (dataMark.value.id > 0) ? "Изменить метку" : "Добавить метку",
            label: (dataMark.value.id > 0) ? "Изменить" : "Добавить",
            disabled: (dataMark.value.id < 0) ? false : modifyMark
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
