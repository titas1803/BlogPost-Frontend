import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { ILoginState } from "../Utilities/Types";
import axios from "axios";
import { AppDispatch } from "@/store/store";
import { logout } from "@/slices/loginSlice";
import { getCookie } from "@/Utilities/utilities";

type Props = {
  requiredRole?: "ADMIN" | "USER";
};
export const ProtectedRoute: React.FC<Props> = ({ requiredRole = "USER" }) => {
  const [verified, setVerified] = useState(true);
  const location = useLocation();

  const { userid } = useSelector(
    (state: { login: ILoginState }) => state.login
  );

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    console.log("in use");
    const verifyToken = async () => {
      const TOKENVERIFYURL =
        import.meta.env.BLOGPOST_FRONTEND_API_URL + "/jwt/verify";

      try {
        const response = await axios.get(TOKENVERIFYURL, {
          headers: {
            Authorization: `Bearer ${getCookie("auth-token")}`,
          },
        });
        if (response.status === 200 && response.data.userid === userid) {
          setVerified(true);
        } else {
          setVerified(false);
          dispatch(logout());
        }
      } catch {
        setVerified(false);
        dispatch(logout());
      }
    };
    if (getCookie("auth-token")) verifyToken();
    else setVerified(false);
  }, [dispatch, userid, location.pathname]);

  const { loggedIn, role: userRole } = useSelector(
    (state: { login: ILoginState }) => state.login
  );

  if (!loggedIn || !verified) {
    return (
      <Navigate to={`/login?from=${location.pathname.split("/", 2).pop()}`} />
    );
  } else if (requiredRole && requiredRole !== userRole) {
    return <Navigate to="/not-allowed" />;
  } else {
    return <Outlet />;
  }
};
