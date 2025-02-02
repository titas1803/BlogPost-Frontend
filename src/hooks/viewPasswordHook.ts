import { useState } from "react";

export const useViewPassword = () => {
  const [fieldType, setFieldType] = useState<"text" | "password">("password");
  const changeFieldType = () => {
    setFieldType((prev) => (prev === "password" ? "text" : "password"));
  };

  return { fieldType, changeFieldType };
};
