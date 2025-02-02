import { createContext } from "react";
import { SignupContextValueType } from "@/Utilities/Types";

export const SignUpContext = createContext<SignupContextValueType | null>(null);
