import { ProfileContextValueType } from "@/Utilities/Types";
import { createContext } from "react";

export const ProfileContext = createContext<ProfileContextValueType | null>(
  null
);
