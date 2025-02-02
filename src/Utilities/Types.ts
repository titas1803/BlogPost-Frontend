import React from "react";

export type UserDetailsType = {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  gender: string;
  dob: string;
};

export type FetchedUserDetailsType = {
  name: string;
  username: string;
  email: string;
  phone: string;
  photo: string;
  gender: string;
  dob: string;
  noOfSubscribers: number;
  noOfSubscriberedTo: number;
};

export type PasswordType = {
  password: string;
};

export type SignupContextValueType = {
  details: UserDetailsType;
  setDetails: React.Dispatch<React.SetStateAction<UserDetailsType>>;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  activeFormIndex: number;
  setActiveFormIndex: React.Dispatch<React.SetStateAction<number>>;
  fromUrl: string | null;
};

export interface ILoginState {
  loggedIn: boolean;
  loading: boolean;
  message: string;
  "auth-token": string | undefined;
  username: string | undefined;
  userid: string | undefined;
  role: "ADMIN" | "USER" | undefined;
}

export interface ILoginPayload {
  username: string;
  password: string;
}
