import { Gender } from "App/Enums/Gender";

export interface UserInput {
  fullName?: string;
  gender?: Gender;
  phone?: string;
  clinicName?: string;
  clinicPhone?: string;
  email?: string;
  password?: string;
  password_confirmation?: string;
}
