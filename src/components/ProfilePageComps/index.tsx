import { ProfilePageStyle } from "@/pages/ProfilePage/style";
import React, { useEffect, useState, useTransition } from "react";
import { LoadingCircle } from "../Loading";
import { ProfileCard } from "./ProfileCard";
import { ProfilePageBanner } from "./ProfilePageBanner";
import { SubscribedToCarousel } from "./SubscribedToCarousel";
import { UsersPosts } from "./UsersPosts";
import { AppDispatch, AppState } from "@/store/store";
import { IUserState } from "@/Utilities/Types";
import { socket } from "@/Utilities/utilities";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useProfileContext } from "@/hooks/profileCtxHook";
import { Helmet } from "react-helmet-async";

const ProfilePage: React.FC = () => {
  const { hasId, userDetails, setUserDetails, setUserId } = useProfileContext();
  const { userid } = useParams<{ userid?: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const [isPending, startTransition] = useTransition();
  const [isError, setIsError] = useState(false);

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
        setIsError(false);
      } catch {
        setIsError(true);
        setUserDetails(undefined);
      }
    };
    startTransition(() => {
      if (!hasId && loggedInUserDetails.isFetched) {
        setIsError(false);
        setUserDetails(loggedInUserDetails);
        return;
      }
      if (hasId) {
        fetchUserDetails();
      }
    });

    return () => {
      source.cancel();
    };
  }, [authToken, userid, dispatch, hasId, loggedInUserDetails, setUserDetails]);

  useEffect(() => {
    setUserId(userid ?? loggedInUserDetails._id);
    // Join the profile room when visiting a user's profile
    if (userid) {
      socket.emit("join_profile", userid);
    }
    return () => {
      socket.emit("leave_profile", userid);
    };
  }, [loggedInUserDetails._id, setUserId, userid]);

  return (
    <>
      <Helmet>
        <title>BlogPost Author | {userDetails?.name ?? "Not found"}</title>
        <meta
          name="description"
          content={`View details about ${userDetails?.name}`}
        />
        <meta
          property="og:title"
          content={`BlogPost Author | ${userDetails?.name ?? "Not found"}`}
        />
        <meta
          property="og:description"
          content={`View details about ${userDetails?.name}`}
        />
      </Helmet>
      <ProfilePageStyle className="profile-page br-10 p-2 p-md-3">
        <LoadingCircle isFetching={isPending} />
        {userDetails !== undefined && (
          <>
            <ProfilePageBanner />
            <ProfileCard />
            <SubscribedToCarousel />
            <UsersPosts />
          </>
        )}
        {isError && <p>404 User not found</p>}
      </ProfilePageStyle>
    </>
  );
};

export default ProfilePage;
