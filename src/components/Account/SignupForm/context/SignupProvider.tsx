import React, { useMemo, useState } from "react";
import { SignUpContext } from "./SignupContext";
import { useSearchParams } from "react-router-dom";

type Props = {
  children: React.ReactNode;
};

export const SignupProvider: React.FC<Props> = ({ children }) => {
  const [searchParams] = useSearchParams();

  const [activeFormIndex, setActiveFormIndex] = useState(0);
  const [details, setDetails] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phone: "",
    gender: "",
    dob: "",
  });
  const [password, setPassword] = useState("");

  const ctxvalue = useMemo(() => {
    return {
      details,
      setDetails,
      password,
      setPassword,
      activeFormIndex,
      setActiveFormIndex,
      fromUrl: searchParams.get("from"),
    };
  }, [details, password, searchParams, activeFormIndex]);

  return (
    <SignUpContext.Provider value={ctxvalue}>{children}</SignUpContext.Provider>
  );
};
