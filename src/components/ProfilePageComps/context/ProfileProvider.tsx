import React, { useMemo } from "react";
import { ProfileContext } from "./ProfileContext";
import { IFetchedUserDetails } from "@/Utilities/Types";

type Props = {
  hasId?: boolean;
  children: React.ReactNode;
};

export const ProfileProvider: React.FC<Props> = ({ children, hasId }) => {
  const [userid, setUserId] = React.useState<string>();
  const [userDetails, setUserDetails] = React.useState<IFetchedUserDetails>();

  const ctxValue = useMemo(
    () => ({
      hasId,
      userDetails,
      userid,
      setUserDetails,
      setUserId,
    }),
    [hasId, userDetails, userid]
  );
  return (
    <ProfileContext.Provider value={ctxValue}>
      {children}
    </ProfileContext.Provider>
  );
};
