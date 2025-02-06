import React, { useEffect, useState } from "react";
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
import { Button } from "react-bootstrap";
import { AddPostModal } from "@/components/Posts/AddPost/AddPostModal";

type Props = {
  hasId?: boolean;
};

export const ProfilePage: React.FC<Props> = ({ hasId = false }) => {
  const [userDetails, setUserDetails] = useState<IFetchedUserDetails>();
  const [showAddModal, setShowModal] = useState(false);
  const { userid } = useParams<{ userid?: string }>();
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch<AppDispatch>();

  const authToken = useSelector(
    (state: { login: ILoginState }) => state.login["auth-token"]
  );
  const loggedInUserDetails = useSelector(
    (state: { user: IUserState }) => state.user
  );

  useEffect(() => {
    if (!hasId && loggedInUserDetails.isFetched) {
      setUserDetails(loggedInUserDetails);
      setLoading(false);
      return;
    }

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
      } finally {
        setLoading(false);
      }
    };

    if (hasId) {
      setLoading(true);
      fetchUserDetails();
    } else if (!loggedInUserDetails.isFetched) {
      dispatch(fetchInitialuserDetails());
      setLoading(false);
    }

    return () => {
      source.cancel("Fetching user details cancelled");
    };
  }, [authToken, userid, dispatch, hasId, loggedInUserDetails]);

  const onModalHide = () => setShowModal(false);

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
          {(!hasId || (hasId && loggedInUserDetails.id === userid)) && (
            <>
              <Button id="add-post-profile" onClick={() => setShowModal(true)}>
                Add BlogPost
              </Button>
              <AddPostModal show={showAddModal} onHide={onModalHide} />
            </>
          )}
          <UsersPosts userid={userid} />
        </>
      )}
    </ProfilePageStyle>
  );
};
