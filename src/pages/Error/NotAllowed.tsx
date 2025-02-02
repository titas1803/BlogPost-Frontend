import React from "react";
import { Link } from "react-router-dom";
import { NotAllowedStyle } from "./styels";

export const NotAllowed: React.FC = () => {
  return (
    <NotAllowedStyle>
      <h1>403!</h1>
      <p>Sorry. You don't have required permission to visit the page</p>
      <p>
        Click here to visit <Link to="/">homepage</Link>.
      </p>
    </NotAllowedStyle>
  );
};
