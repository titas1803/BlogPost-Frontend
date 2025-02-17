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

export interface IFetchedUserDetails {
  _id: string;
  name: string;
  userName: string;
  email: string;
  phone: string;
  photo: string;
  gender: string;
  dob: string;
  role: "USER" | "ADMIN";
  noOfSubscribers: number;
  noOfSubscriberedTo: number;
}

export interface IUserState extends IFetchedUserDetails {
  isLoading: boolean;
  hasError: boolean;
  isFetched: boolean;
}

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

export type ProfileContextValueType = {
  hasId?: boolean;
  userDetails?: IFetchedUserDetails;
  userid?: string;
  setUserDetails: React.Dispatch<
    React.SetStateAction<IFetchedUserDetails | undefined>
  >;
  setUserId: React.Dispatch<React.SetStateAction<string | undefined>>;
};

export interface ILoginState {
  loggedIn: boolean;
  loading: boolean;
  message: string;
  "auth-token": string | undefined;
  username: string | undefined;
  userid: string | undefined;
  role: "ADMIN" | "USER" | undefined;
  error: string | undefined;
}

export interface ILoginPayload {
  username: string;
  password: string;
}

export interface IAuthorDetails {
  _id: string;
  name: string;
  userName: string;
  photo?: string;
}

export interface IPost {
  _id: string;
  title: string;
  content: string;
  authorId: string;
  tags: string[];
  categories: string[];
  image: string[];
  likedBy: string[];
  isPublished: "true" | "false";
  commentsCount: number;
  authorDetails: IAuthorDetails;
}

export interface IComments {
  _id: string;
  authorDetails: IAuthorDetails;
  authorId: string;
  commentText: string;
  createdAt: string;
  updatedAt: string;
  likedBy: string[];
  postId: string;
}

export interface ISubscribedToUsers {
  userName: string;
  id: string;
  photo: string;
  isSubscribedByLoggedInUser: boolean;
}

export interface IDetailsFormValues {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  gender: "male" | "female";
  dob: Date;
}

export interface IUpdateDetailsValues extends Omit<IDetailsFormValues, "dob"> {
  dob: string;
}
