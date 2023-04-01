export interface IText {
  id: number;
  title: string;
  text: string;
  language: string;
  idUser: number;
  login?: string;
}

export interface IUser {
  id: number;
  login: string;
  email: string;
  isAdmin: boolean;
  password: string;
}

export interface ITranslation {
  id: number;
  sectionId: number;
  translatedText: string;
  language: string;
  idText: number;
  idUser: number;
  title?: string;
  textLanguage?: string;
  login?: string;
}

export interface IRating {
  id: number;
  rating: number;
  idUser: number;
  idTranslation: number;
  idText: number;
}

export interface ILanguage {
  value: string;
  label: string;
}
