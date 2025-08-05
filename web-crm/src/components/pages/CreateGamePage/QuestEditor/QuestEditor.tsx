import { FC, Fragment, useEffect, useRef, useState } from "react";
import Map, { Marker, Source, Layer } from 'react-map-gl';
import styles from "./QuestEditor.module.scss";
import ConfigApp from "src/config/config.app";
import { useAppDispatch, useAppSelector } from "src/hooks/redux.hook";
import MarkAction from "src/store/actions/Map/MarkAction";
import messageQueueAction from "src/store/actions/MessageQueueAction";
import { IMarkModel } from "src/models/IMarkModel";
import { IQuestDataModel, IQuestModel } from "src/models/IQuestModel";
import Loader from "src/components/UI/Loader";
import QuestParams from "../QuestParams";
import { QuestParamsHandle } from "../QuestParams/QuestParams";
import { isUndefinedOrNull } from "src/types/void_null";

const scaleFactor = 0.5;

export interface IQuestEditorProps {
    eventScroll: number;
    updateQuestId: number;
    setUpdateQuestId: React.Dispatch<React.SetStateAction<number>>;
}

const QuestEditor: FC<IQuestEditorProps> = (props) => {
    const iCreatorSelector = useAppSelector((s) => s.iCreatorReducer);
    const markSelector = useAppSelector((s) => s.markReducer);
    const dispatch = useAppDispatch();

    const questEditorRef = useRef<QuestParamsHandle>(null);

    const [selectMark, setSelectMark] = useState<IMarkModel>({
        location: "Выберите метку на карте",
    });

    const clearSelectMark = () => {
        setSelectMark({
            location: "Выберите метку на карте"
        });
    };

    const [dataQuest, setDataQuest] = useState<IQuestDataModel>({
        task: "",
        action: "",
        radius: 1,
        hint: ""
    });

    const clearDataQuest = () => {
        setDataQuest({
            id: undefined,
            task: "",
            action: "",
            radius: 1,
            hint: ""
        });

        props.setUpdateQuestId(-1);
    };

    /**
     * Поиск квеста по заданным координатам (lat; lng)
     * @param lat Координата lat
     * @param lng Координата lng
     * @returns 
     */
    const findQuestByLatLng = (lat, lng) => {
        let index = -1;
        for (let i = 0; i < iCreatorSelector.quests.length; i++) {
            const item = iCreatorSelector.quests[i];

            if ((item.mark.lat == lat) && (item.mark.lng == lng)) {
                index = i;
                break;
            }
        }

        return index;
    };

    //идентификация маркера, на который было произведено нажатие (клик)
    const getMarkerState = (dataMarks, obj) => {
        if (!dataMarks || !obj) {
            return null;
        }

        for (let i = 0; i < dataMarks.length; i++) {
            if (dataMarks[i].lat == obj.lat && dataMarks[i].lng == obj.lng) {
                return dataMarks[i];
            }
        }

        return null;
    };

    const clickMarkerHandler = (e) => {
        // resetQuestBlock();

        /*await setBlockEditQuest({
            display: "none",
        });*/

        // Открытие блока для добавления квеста
        /*await setBlockQuest({
            display: "grid",
        });*/

        let marker = getMarkerState(markSelector.freeMarks, {
            lat: parseFloat(e.target._lngLat.lat),
            lng: parseFloat(e.target._lngLat.lng),
        });

        if (!marker) {
            return;
        }

        let index = findQuestByLatLng(marker.lat, marker.lng);

        if (index >= 0) {
            const quest = iCreatorSelector.quests[index];

            setDataQuest({
                task: quest.task,
                action: quest.action,
                radius: quest.radius,
                hint: quest.hint,
                id: quest.id
            });
        } else {
            clearDataQuest();
        }

        setSelectMark({
            location: marker.location,
            lng: marker.lng,
            lat: marker.lat,
            id: marker.id,
        });

        dispatch(messageQueueAction.addMessage(null, "success", "Метка выбрана"));
    };

    useEffect(() => {
        if (props.eventScroll > 0) {
            questEditorRef.current && questEditorRef.current.scrollToElement();
        }
    }, [props.eventScroll]);

    useEffect(() => {
        const { updateQuestId } = props;

        if (updateQuestId >= 0) {
            const index = iCreatorSelector.quests.findIndex((value) => {
                return value.id === updateQuestId;
            });

            const quest = iCreatorSelector.quests[index];

            setDataQuest({
                task: quest.task,
                action: quest.action,
                radius: quest.radius,
                hint: quest.hint,
                id: quest.id
            });

            setSelectMark(quest.mark);
        }
    }, [props.updateQuestId]);

    return (
        <>
            <div className={styles.container}>
                <h2>{(!isUndefinedOrNull(dataQuest.id)) ? "Изменение" : "Добавление"} квеста</h2>
                <div className={styles.quest}>
                    <div className={styles.map}>
                        <Map
                            initialViewState={{
                                longitude: 104.298234,
                                latitude: 52.262757,
                                zoom: 14
                            }}
                            mapStyle="mapbox://styles/mapbox/streets-v11"
                            mapboxAccessToken={ConfigApp.MAPBOX_ACCESS_TOKEN}
                            onLoad={() => {
                                dispatch(MarkAction.getFreeMarks(() => {
                                    dispatch(messageQueueAction.addMessage(null, "success", "Свободные метки загружены!"));
                                }))
                            }}
                            onDblClick={(e) => {
                                //resetQuestBlock();
                            }}
                        >
                            {
                                markSelector.freeMarks.map((value, index) => {
                                    return (
                                        <>
                                            <Fragment
                                                key={value.id}
                                            >
                                                <Marker
                                                    longitude={Number(value.lng)}
                                                    latitude={Number(value.lat)}
                                                    color="#FF0000"
                                                    onClick={clickMarkerHandler}
                                                >
                                                </Marker>
                                                <Source
                                                    id={String(value.id)}
                                                    type="geojson" data={
                                                        {
                                                            type: 'FeatureCollection',
                                                            features: [
                                                                {
                                                                    type: 'Feature',
                                                                    geometry: {
                                                                        type: 'Point',
                                                                        coordinates: [Number(value.lng), Number(value.lat)]
                                                                    },
                                                                    properties: null
                                                                }
                                                            ]
                                                        }
                                                    }
                                                >
                                                    <Layer
                                                        {
                                                        ...{
                                                            key: (String(value.id) + "-layer"),
                                                            id: String(value.id),
                                                            type: 'circle',
                                                            paint: {
                                                                'circle-radius': (((value.lat === selectMark.lat) &&
                                                                    (value.lng === selectMark.lng))
                                                                    ? 0
                                                                    : 50) * scaleFactor,
                                                                'circle-color': findQuestByLatLng(value.lat, value.lng) >= 0
                                                                    ? "#00FF00"
                                                                    : "#0000FF",
                                                                'circle-stroke-width': 1,
                                                                'circle-stroke-color': findQuestByLatLng(value.lat, value.lng) >= 0
                                                                    ? "#000000"
                                                                    : "#FFFFFF",
                                                                'circle-opacity': 0.5
                                                            }
                                                        }
                                                        } />
                                                </Source>
                                            </Fragment>
                                        </>
                                    );
                                })
                            }

                            {
                                selectMark.lat !== 0 && selectMark.lng !== 0 && (
                                    <Source
                                        key={String(selectMark.id) + "-source"}
                                        id={String(selectMark.id)}
                                        type="geojson"
                                        data={
                                            {
                                                type: 'FeatureCollection',
                                                features: [
                                                    {
                                                        type: 'Feature',
                                                        geometry: {
                                                            type: 'Point',
                                                            coordinates: [Number(selectMark.lng), Number(selectMark.lat)]
                                                        },
                                                        properties: null
                                                    }
                                                ]
                                            }
                                        }
                                    >
                                        <Layer {
                                            ...{
                                                id: String(selectMark.lat) + "-current",
                                                type: 'circle',
                                                paint: {
                                                    'circle-radius': 50 * scaleFactor,
                                                    'circle-color': "#000000",
                                                    'circle-stroke-width': 1,
                                                    'circle-stroke-color': "#FF0000",
                                                    'circle-opacity': 0.5
                                                }
                                            }
                                        } />
                                    </Source>
                                )}

                            {
                                selectMark.lat !== 0 &&
                                selectMark.lng !== 0 &&
                                dataQuest && (
                                    <Source
                                        key={String(selectMark.id) + "-source"}
                                        id={String(selectMark.id)}
                                        type="geojson"
                                        data={
                                            {
                                                type: 'FeatureCollection',
                                                features: [
                                                    {
                                                        type: 'Feature',
                                                        geometry: {
                                                            type: 'Point',
                                                            coordinates: [Number(selectMark.lng), Number(selectMark.lat)]
                                                        },
                                                        properties: null
                                                    }
                                                ]
                                            }
                                        }
                                    >
                                        <Layer {
                                            ...{
                                                id: selectMark.lat + "-dcm",
                                                type: 'circle',
                                                paint: {
                                                    'circle-radius': dataQuest.radius * scaleFactor,
                                                    'circle-color': "#00FF00",
                                                    'circle-stroke-width': 1,
                                                    'circle-stroke-color': "#00FF00",
                                                    'circle-opacity': 0.5
                                                }
                                            }
                                        } />
                                    </Source>
                                )}
                        </Map>
                    </div>
                    <QuestParams
                        ref={questEditorRef}
                        dataQuest={dataQuest}
                        setDataQuest={setDataQuest}
                        selectMark={selectMark}
                        clearSelectMark={clearSelectMark}
                        clearDataQuest={clearDataQuest}
                    />
                </div>
            </div>

            {
                markSelector.isLoading && <Loader />
            }
        </>
    );
};

export default QuestEditor;
