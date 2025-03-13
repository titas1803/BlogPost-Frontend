import React from "react";
import { Link } from "react-router-dom";
import { NotFoundStyle } from "./styels";
import { Helmet } from "react-helmet-async";

export const NotFound: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>BlogPost | 404 page Not Found</title>
        <meta
          name="description"
          content="BlogPost is a small social media site where you can share your thoughts, experience and opinios to other"
        />
        <meta property="og:title" content="BlogPost | 404 page Not Found" />
        <meta
          property="og:description"
          content="BlogPost is a small social media site where you can share your thoughts, experience and opinios to other"
        />
      </Helmet>
      <NotFoundStyle>
        <h1>404!</h1>
        <p>Sorry. The page you are trying to visit is not found.</p>
        <p>
          Click here to visit <Link to="/">homepage</Link>.
        </p>
      </NotFoundStyle>
    </>
  );
};
