import React, { useEffect, useRef, useState } from "react";
import { ProfilePageStyle } from "./style";
import {
  ProfileCard,
  ProfilePageBanner,
  UsersPosts,
} from "@/components/ProfilePageComps";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  IFetchedUserDetails,
  ILoginState,
  IUserState,
} from "@/Utilities/Types";
import { useDispatch, useSelector } from "react-redux";
import { LoadingModal } from "@/components/LoadingModal";
import { fetchInitialuserDetails } from "@/slices/userSlice";
import { AppDispatch } from "@/store/store";

type Props = {
  hasId?: boolean;
};

export const ProfilePage: React.FC<Props> = ({ hasId = false }) => {
  const [userDetails, setUserDetails] = useState<IFetchedUserDetails>();
  const { userid } = useParams<{ userid?: string }>();
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch<AppDispatch>();
  const ref = useRef(false);

  const authToken = useSelector(
    (state: { login: ILoginState }) => state.login["auth-token"]
  );
  const loggedIsUserDetails = useSelector(
    (state: { user: IUserState }) => state.user
  );

  useEffect(() => {
    if (!hasId && loggedIsUserDetails.isFetched) {
      setUserDetails(loggedIsUserDetails);
    }
  }, [loggedIsUserDetails, hasId]);

  useEffect(() => {
    const isMounted = ref.current;
    if (isMounted) {
      return;
    }
    ref.current = true;

    const source = axios.CancelToken.source();
    const fetchUserDetails = async () => {
      const response = await axios.get(
        `${import.meta.env.BLOGPOST_FRONTEND_API_URL}/user/getuser/${userid}`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
          cancelToken: source.token,
        }
      );
      setUserDetails(response.data.success ? response.data.user : undefined);
    };

    const getUserDetails = () => {
      if (!hasId) {
        if (!loggedIsUserDetails.isFetched) {
          console.log("profile page");
          dispatch(fetchInitialuserDetails());
        }
        setLoading(false);
        return;
      }

      setLoading(true);
      fetchUserDetails()
        .catch((error) => {
          console.error("Some error occurred", error);
          setUserDetails(undefined);
        })
        .finally(() => {
          setLoading(false);
        });
    };

    getUserDetails();

    return () => {
      source.cancel("Fetching user details cancelled");
    };
  }, [authToken, userid, dispatch, loggedIsUserDetails.isFetched, hasId]);

  return (
    <ProfilePageStyle className="profile-page br-10 p-2 p-md-3">
      {loading ? (
        <LoadingModal show message="Loading.." />
      ) : !userDetails ? (
        <p>404. Details not found.</p>
      ) : (
        <>
          <ProfilePageBanner />
          <ProfileCard userDetails={userDetails} />
          <UsersPosts userid={userid} />
        </>
      )}
    </ProfilePageStyle>
  );
};
