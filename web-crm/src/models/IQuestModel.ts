import { IMarkModel } from "./IMarkModel";

export interface IQuestModel {
  id: number;
  location: string;
  lat: number;
  lng: number;
  task: string;
  action: string;
  radius: number;
  hint: string;
  marks_id: number;
}

export interface IQuestDataModel {
  id?: number;
  task: string;
  action: string;
  radius: number;
  hint: string;
}

export interface IQuestData extends IQuestDataModel {
  mark: IMarkModel;
}

export interface IQuestGameModel {
  task: string;
  action: string;
  radius: number;
  hint: string;
  marks_id: number;
}
