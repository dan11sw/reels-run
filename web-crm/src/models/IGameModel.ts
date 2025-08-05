import { IQuestGameModel } from "./IQuestModel";

export interface IGameId {
  info_games_id: number;
}

export interface IGameModel {
  id?: number;
  info_games_id?: number;
  title: string;
  location: string;
}

export interface ICreateGameModel extends IGameModel {
  quests: IQuestGameModel[];
}
