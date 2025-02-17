import { ProfileContext } from "@/components/ProfilePageComps/context/ProfileContext";
import { useContext } from "react";

export const useProfileContext = () => {
  const context = useContext(ProfileContext);
  if (!context)
    throw new Error("You can't use context values outside it's provider");
  return context;
};
