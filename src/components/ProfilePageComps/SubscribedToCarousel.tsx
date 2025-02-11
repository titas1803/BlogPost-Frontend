import { ISubscribedToUsers } from "@/Utilities/Types";
import axios from "axios";
import React, { useEffect, useMemo, useState, useTransition } from "react";
import { useSelector } from "react-redux";
import { SubscribedList } from "./SubscribedList";
import { AppState } from "@/store/store";

type Props = {
  userid?: string;
};

export const SubscribedToCarousel: React.FC<Props> = ({ userid }) => {
  const [listOfSubscribedTo, setListOfSubscribedTo] =
    useState<ISubscribedToUsers[]>();

  const [isPending, startTransition] = useTransition();

  const { userid: loggedInUserId, "auth-token": authToken } = useSelector(
    (state: AppState) => state.login
  );
  const profileId = useMemo(
    () => userid ?? loggedInUserId,
    [userid, loggedInUserId]
  );

  useEffect(() => {
    const source = axios.CancelToken.source();
    const fetchSubscribedTo = async () => {
      const FETCHURL =
        import.meta.env.BLOGPOST_FRONTEND_API_URL +
        `/sub/getSubscribeTo/${profileId}`;

      try {
        const response = await axios.get(FETCHURL, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          cancelToken: source.token,
        });

        if (response.data) {
          setListOfSubscribedTo(response.data.subscribedTo);
        }
      } catch {
        setListOfSubscribedTo(undefined);
      }
    };
    startTransition(() => {
      fetchSubscribedTo();
    });
    return () => {
      source.cancel();
    };
  }, [authToken, profileId]);

  return (
    <>
      {isPending ? (
        <p>Loading...</p>
      ) : (
        listOfSubscribedTo &&
        listOfSubscribedTo.length > 0 && (
          <div className="d-flex px-3">
            {listOfSubscribedTo.map((author) => (
              <SubscribedList user={author} key={author.id} />
            ))}
          </div>
        )
      )}
    </>
  );
};
