import { Gender } from './enum';

export type ProfileFormVal = {
  gender: Gender | null;
  familyName: string | null;
  givenName: string | null;
  birthday: string | null;
  createdUtc: string | null;
  updatedUtc: string | null;
}

export type Profile = {
  id: string;
} & ProfileFormVal;
