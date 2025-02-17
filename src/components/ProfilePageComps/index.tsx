import { ProfilePageStyle } from "@/pages/ProfilePage/style";
import React, { useEffect, useTransition } from "react";
import { LoadingModal } from "../LoadingModal";
import { ProfileCard } from "./ProfileCard";
import { ProfilePageBanner } from "./ProfilePageBanner";
import { SubscribedToCarousel } from "./SubscribedToCarousel";
import { UsersPosts } from "./UsersPosts";
import { fetchInitialuserDetails } from "@/slices/userSlice";
import { AppDispatch, AppState } from "@/store/store";
import { IUserState } from "@/Utilities/Types";
import { socket } from "@/Utilities/utilities";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useProfileContext } from "@/hooks/profileCtxHook";

const ProfilePage: React.FC = () => {
  const { hasId, userDetails, setUserDetails, setUserId } = useProfileContext();
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
  }, [authToken, userid, dispatch, hasId, loggedInUserDetails, setUserDetails]);

  useEffect(() => {
    setUserId(userid);
    // Join the profile room when visiting a user's profile
    if (userid) {
      socket.emit("join_profile", userid);
    }
    return () => {
      socket.emit("leave_profile", userid);
    };
  }, [setUserId, userid]);

  return (
    <ProfilePageStyle className="profile-page br-10 p-2 p-md-3">
      {isPending ? (
        <LoadingModal show message="Loading.." />
      ) : !userDetails ? (
        <p>404. Details not found.</p>
      ) : (
        <>
          <ProfilePageBanner />
          <ProfileCard />
          <SubscribedToCarousel />
          <UsersPosts />
        </>
      )}
    </ProfilePageStyle>
  );
};

export default ProfilePage;
