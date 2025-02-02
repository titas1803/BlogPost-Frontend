import React from "react";
import { Col } from "react-bootstrap";
import { LoginSignupRightBlockStyle } from "./style";

type Props = {
  children: React.ReactNode;
  className?: string;
  wrapperClass?: string;
};
export const LoginSignupRightBlock: React.FC<Props> = ({
  children,
  wrapperClass = "",
  className = "",
}) => {
  return (
    <Col md={6} className={`d-md-flex ${wrapperClass}`}>
      <LoginSignupRightBlockStyle className={`m-auto ${className}`}>
        <h1 className="welcome-message mb-4 d-none d-md-block">
          Welcome to BlogPost
        </h1>
        {children}
      </LoginSignupRightBlockStyle>
    </Col>
  );
};
