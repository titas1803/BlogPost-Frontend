import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { AppDispatch, AppState } from "@/store/store";
import { logout } from "@/slices/loginSlice";
import { getCookie } from "@/Utilities/utilities";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";

type Props = {
  requiredRole?: "ADMIN" | "USER";
};

const verifyToken = async (userid: string | undefined) => {
  const TOKENVERIFYURL =
    import.meta.env.BLOGPOST_FRONTEND_API_URL + "/jwt/verify";

  if (!getCookie("auth-token")) throw new Error();
  const response = await axios.get(TOKENVERIFYURL, {
    headers: {
      Authorization: `Bearer ${getCookie("auth-token")}`,
    },
  });

  if (response.status === 200 && response.data.userid === userid) {
    return true;
  }
  return false;
};

export const ProtectedRoute: React.FC<Props> = ({ requiredRole = "USER" }) => {
  const [verified, setVerified] = useState(true);
  const location = useLocation();

  const {
    userid,
    loggedIn,
    role: userRole,
  } = useSelector((state: AppState) => state.login);

  const dispatch = useDispatch<AppDispatch>();

  const { data, isError, isFetching } = useQuery({
    queryKey: [userid],
    queryFn: async () => verifyToken(userid),
    enabled: !!userid,
    retry: 1,
  });

  useEffect(() => {
    if (!isFetching && data) {
      setVerified(data);
    } else if (isError) {
      console.log("in Error");
      dispatch(logout());
      toast.remove();
      toast.error("Please login");
      setVerified(false);
    }
  }, [data, dispatch, isError, isFetching]);

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
