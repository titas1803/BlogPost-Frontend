import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { ILoginState } from "../Utilities/Types";

type Props = {
  requiredRole?: "ADMIN" | "USER";
};
export const ProtectedRoute: React.FC<Props> = ({ requiredRole = "USER" }) => {
  const location = useLocation();

  const { loggedIn, role: userRole } = useSelector(
    (state: { login: ILoginState }) => state.login
  );

  console.log(
    loggedIn,
    location.pathname,
    location.pathname.split("/", 2).pop(),
    userRole
  );

  if (!loggedIn) {
    return (
      <Navigate to={`/login?from=${location.pathname.split("/", 2).pop()}`} />
    );
  } else if (requiredRole && requiredRole !== userRole) {
    return <Navigate to="/not-allowed" />;
  } else {
    return <Outlet />;
  }
};
