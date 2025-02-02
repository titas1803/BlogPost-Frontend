import { ILoginState } from "@/Utilities/Types";
import React, { useMemo } from "react";
import { useSelector } from "react-redux";

type Props = {
  userid?: string;
};
export const UsersPosts: React.FC<Props> = ({ userid }) => {
  const { userid: loggedInUserId } = useSelector(
    (state: { login: ILoginState }) => state.login
  );
  const profileUserId = useMemo(() => {
    return userid ?? loggedInUserId;
  }, [loggedInUserId, userid]);

  return profileUserId ? (
    <div>UsersPosts {profileUserId}</div>
  ) : (
    <div>Not found</div>
  );
};
