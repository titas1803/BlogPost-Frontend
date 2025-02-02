import { useContext } from "react";
import { SignUpContext } from "../components/Account/SignupForm/context/SignupContext";

export const useSignUpContext = () => {
  const context = useContext(SignUpContext);
  if (!context)
    throw new Error("You can't use context values outside it's provider");
  return context;
};
