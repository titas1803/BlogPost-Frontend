import React, { useEffect, useState, useTransition } from "react";
import { ProfilePageStyle } from "./style";
import {
  ProfileCard,
  ProfilePageBanner,
  SubscribedToCarousel,
  UsersPosts,
} from "@/components/ProfilePageComps";
import { useParams } from "react-router-dom";
import axios from "axios";
import { IFetchedUserDetails, IUserState } from "@/Utilities/Types";
import { useDispatch, useSelector } from "react-redux";
import { LoadingModal } from "@/components/LoadingModal";
import { fetchInitialuserDetails } from "@/slices/userSlice";
import { AppDispatch, AppState } from "@/store/store";

type Props = {
  hasId?: boolean;
};

export const ProfilePage: React.FC<Props> = ({ hasId = false }) => {
  const [userDetails, setUserDetails] = useState<IFetchedUserDetails>();
  const { userid } = useParams<{ userid?: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const [isPending, startTransition] = useTransition();

  const authToken = useSelector((state: AppState) => state.login["auth-token"]);
  const loggedInUserDetails = useSelector(
    (state: { user: IUserState }) => state.user
  );

  useEffect(() => {
    const source = axios.CancelToken.source();
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.BLOGPOST_FRONTEND_API_URL}/user/getuser/${userid}`,
          {
            headers: { Authorization: `Bearer ${authToken}` },
            cancelToken: source.token,
          }
        );
        setUserDetails(response.data.success ? response.data.user : undefined);
      } catch {
        setUserDetails(undefined);
      }
    };
    startTransition(() => {
      if (!hasId && loggedInUserDetails.isFetched) {
        setUserDetails(loggedInUserDetails);
        return;
      }
      if (hasId) {
        fetchUserDetails();
      } else if (!loggedInUserDetails.isFetched) {
        dispatch(fetchInitialuserDetails());
      }
    });

    return () => {
      source.cancel();
    };
  }, [authToken, userid, dispatch, hasId, loggedInUserDetails]);

  return (
    <ProfilePageStyle className="profile-page br-10 p-2 p-md-3">
      {isPending ? (
        <LoadingModal show message="Loading.." />
      ) : !userDetails ? (
        <p>404. Details not found.</p>
      ) : (
        <>
          <ProfilePageBanner />
          <ProfileCard userDetails={userDetails} />
          <SubscribedToCarousel userid={userid} />
          <UsersPosts userid={userid} />
        </>
      )}
    </ProfilePageStyle>
  );
};
