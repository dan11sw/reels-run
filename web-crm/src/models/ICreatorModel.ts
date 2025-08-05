import { IMarkModel } from "./IMarkModel";

// Описание игры
export interface IInfoGameModel {
  id: number;
  title?: string;
  location: string;
  created_at: string;
  updated_at: string;
  count_quests: number;
  users_id: number;
  quests?: IQuestInfo[];
}

// Описание квеста
export interface IQuestInfo {
  id: number;
  task: string;
  hint: string;
  action: string;
  radius: number;
  created_at: string;
  updated_at: string;
  mark: IMarkModel;
}

export interface IMarkInfo {
  id: number;
  title: string;
  description: string;
  lat: number;
  lng: number;
  location: string;
}