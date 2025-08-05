import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IInfoGameModel, IMarkInfo } from "src/models/ICreatorModel";

export interface ICreatorSlice_e {
  isLoading: boolean;
  games: IInfoGameModel[];
  marks: IMarkInfo[],
  editGame?: IInfoGameModel | null;
}

// Базовое состояние слайса
const initialState: ICreatorSlice_e = {
  isLoading: false,
  games: [],
  marks: [],
  editGame: null,
};

/**
 * Создание слайса для авторизации пользователя
 */
export const eCreatorSlice = createSlice({
  name: "external_creator_slice",
  initialState,
  reducers: {
    loadingStart(state) {
      state.isLoading = true;
    },

    loadingEnd(state) {
      state.isLoading = false;
    },

    clear(state) {
      state.isLoading = false;
      state.games = [];
      state.editGame = null;
    },

    setMarks(state, action: PayloadAction<IMarkInfo[]>) {
      state.marks = action.payload;
    },

    setGames(state, action: PayloadAction<IInfoGameModel[]>) {
      state.games = action.payload;
    },

    setEditGame(state, action: PayloadAction<IInfoGameModel>) {
      state.editGame = action.payload;
    },
  },
});

export default eCreatorSlice.reducer;
