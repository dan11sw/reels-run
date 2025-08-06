export interface IMarkId {
  id: number;
}

export interface IMarkModel {
  id?: number;
  title?: string;
  description?: string;
  lat?: number;
  lng?: number;
  location?: string;
}

export interface IMark {
  title: string;
  description: string;
  lat: number;
  lng: number;
  location: string;
}

export interface IMarkEx extends IMark {
  id: number;
}