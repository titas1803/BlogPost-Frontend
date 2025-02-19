import { ISubscribedToUsers } from "@/Utilities/Types";
import axios from "axios";
import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { SubscribedList } from "./SubscribedToComp";
import { AppState } from "@/store/store";
import { useProfileContext } from "@/hooks/profileCtxHook";
import { useQuery } from "@tanstack/react-query";
import { LoadingCircle } from "../Loading";

const fetchSubscribedTo = async (
  profileId: string,
  userid: string,
  authToken: string
): Promise<ISubscribedToUsers[]> => {
  if (userid === profileId) return [];
  const FETCHURL =
    import.meta.env.BLOGPOST_FRONTEND_API_URL +
    `/sub/getSubscribeTo/${profileId}`;

  const response = await axios.get(FETCHURL, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  return response.data.subscribedTo;
};

export const SubscribedToCarousel: React.FC = () => {
  const { userid } = useProfileContext();

  const { userid: loggedInUserId, "auth-token": authToken } = useSelector(
    (state: AppState) => state.login
  );
  const profileId = useMemo(
    () => userid ?? loggedInUserId,
    [userid, loggedInUserId]
  );

  const {
    data: listOfSubscribedTo,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["subscribedto", profileId, authToken],
    queryFn: async () => fetchSubscribedTo(profileId!, userid!, authToken!),
  });

  return (
    <>
      <LoadingCircle isLoading={isLoading} />
      {!isError && listOfSubscribedTo && listOfSubscribedTo.length > 0 && (
        <div className="d-flex px-3">
          {listOfSubscribedTo.map((author) => (
            <SubscribedList user={author} key={author.id} />
          ))}
        </div>
      )}
    </>
  );
};
