/* Библиотеки */
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

/* Контекст */
import messageQueueReducer from "./reducers/MessageQueueSlice";
import authReducer from "./reducers/AuthSlice";
import markReducer from "./reducers/Map/MarkSlice";
import iCreatorReducer from "./reducers/Creator/internal/ICreatorSlice";
import eCreatorReducer from "./reducers/Creator/external/ECreatorSlice";

/* Константы */
import ConfigApp from "src/config/config.app";

/* Главный Reducer */
const rootReducer = combineReducers({
  messageQueueReducer,
  authReducer,
  markReducer,
  iCreatorReducer,
  eCreatorReducer
});

// Конфигурация Persist
const persistConfig = {
  key: ConfigApp.MAIN_STORE_KEY,
  storage,
  blacklist: [
    "messageQueueReducer",
    "markReducer",
    "iCreatorReducer",
    "eCreatorReducer"
  ],
};

// Создание Persist Reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Конфигурирование общего хранилища
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

const setupStore = () => {
  return store;
};

export const persistor = persistStore(store);
export default store;

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore["dispatch"];
