import { IPhoto } from './photo';

export interface IMember {
  id: number;
  userName: string;
  mainPhotoUrl: string;
  age: number;
  knownAs: string;
  created: string;
  lastActive: string;
  gender: string;
  introduction: string;
  lookingFor: string;
  interests: string;
  city: string;
  country: string;
  photos: IPhoto[];

}


