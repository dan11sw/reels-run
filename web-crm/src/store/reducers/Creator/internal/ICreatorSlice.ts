import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import ConfigApp from "src/config/config.app";
import { IQuestData } from "src/models/IQuestModel";
import { isUndefinedOrNull } from "src/types/void_null";

export interface ICreatorSlice_i {
  quests: IQuestData[];
}

// Базовое состояние слайса
const initialState: ICreatorSlice_i = {
  quests: [],
};

/**
 * Создание слайса для авторизации пользователя
 */
export const iCreatorSlice = createSlice({
  name: "internal_creator_slice",
  initialState,
  reducers: {
    clear(state) {
      state.quests = [];
    },

    setQuests(state, action: PayloadAction<IQuestData[]>) {
      state.quests = action.payload;
    },

    addQuest(state, action: PayloadAction<IQuestData>) {
      const clone = Object.assign(new Array<IQuestData>(), state.quests);
      clone.push(action.payload);

      state.quests = clone;
    },

    updateQuest(state, action: PayloadAction<IQuestData>) {
      const clone = Object.assign(new Array<IQuestData>(), state.quests);

      const index = clone.findIndex((value) => {
        return value.id === action.payload.id && !isUndefinedOrNull(value.id);
      });

      if (index >= 0) {
        clone[index] = action.payload;
      }

      state.quests = clone;
    },

    removeQuest(state, action: PayloadAction<number>) {
      const clone = Object.assign(new Array<IQuestData>(), state.quests);

      const index = clone.findIndex((value) => {
        return value.id === action.payload;
      });

      if (index >= 0) {
        clone.splice(index, 1);
      }

      state.quests = clone;
    },
  },
});

export default iCreatorSlice.reducer;
