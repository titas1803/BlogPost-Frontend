import React, { useEffect, useState } from "react";
import { LoginTab } from "@components/Account/LoginForm";
import { Tab, Tabs } from "react-bootstrap";
import { SignupForm } from "@components/Account/SignupForm";
import { useNavigate, useSearchParams } from "react-router-dom";
import { LoginOrSignupStyle } from "./styles";
import { Toaster } from "react-hot-toast";

type Props = {
  activePath: "login" | "signup";
};
export const LoginOrSignup: React.FC<Props> = ({ activePath }) => {
  const [tabKey, setTabKey] = useState<"login" | "signup">(activePath);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    setTabKey(activePath);
  }, [activePath]);

  const handleTabChange = (k: string | null) => {
    if (k === "login") {
      setTabKey("login");
      navigate(`/login?${searchParams}`);
    } else if (k === "signup") {
      setTabKey("signup");
      navigate(`/signup?${searchParams}`);
    } else {
      return;
    }
  };

  return (
    <LoginOrSignupStyle className="d-flex">
      <Toaster />
      <div className="w-100">
        <Tabs
          activeKey={tabKey}
          onSelect={handleTabChange}
          fill
          justify
          className="form-tabs"
        >
          <Tab eventKey="login" title="Login">
            <LoginTab />
          </Tab>
          <Tab eventKey="signup" title="Sign up">
            <SignupForm />
          </Tab>
        </Tabs>
      </div>
    </LoginOrSignupStyle>
  );
};
