import React from "react";
import { Link } from "react-router-dom";
import { NotFoundStyle } from "./styels";

export const NotFound: React.FC = () => {
  return (
    <NotFoundStyle>
      <h1>404!</h1>
      <p>Sorry. The page you are trying to visit is not found.</p>
      <p>
        Click here to visit <Link to="/">homepage</Link>.
      </p>
    </NotFoundStyle>
  );
};
