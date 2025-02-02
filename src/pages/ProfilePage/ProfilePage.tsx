import React, { useEffect, useRef, useState } from "react";
import { ProfilePageStyle } from "./style";
import {
  ProfileCard,
  ProfilePageBanner,
  UsersPosts,
} from "@/components/ProfilePageComps";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FetchedUserDetailsType, ILoginState } from "@/Utilities/Types";
import { useSelector } from "react-redux";

export const ProfilePage: React.FC = () => {
  const [userDetails, setuserDetails] = useState<FetchedUserDetailsType>();
  const { userId } = useParams<{ userId: string }>();
  const { "auth-token": authToken } = useSelector(
    (state: { login: ILoginState }) => state.login
  );
  const isMounted = useRef(false);

  useEffect(() => {
    if (isMounted.current) return;
    isMounted.current = true;
    const fetchUrl =
      import.meta.env.BLOGPOST_FRONTEND_API_URL +
      "/user/getuser" +
      (userId ? `/${userId}` : "");
    const fetuserDetails = async () => {
      console.log("Called");
      try {
        const response = await axios.get(fetchUrl, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        if (response.data.success === true) {
          setuserDetails(response.data.user);
          console.log("found", response.data.user);
        } else {
          setuserDetails(undefined);
        }
      } catch (error) {
        console.log("Some error occured", error);
      }
    };
    fetuserDetails();
  }, [authToken, userId]);

  return (
    <ProfilePageStyle className="profile-page br-10 p-2 p-md-3">
      {!userDetails ? (
        <p>404. Details not found.</p>
      ) : (
        <>
          <ProfilePageBanner />
          <ProfileCard userDetails={userDetails} />
          <UsersPosts userid={userId} />
        </>
      )}
    </ProfilePageStyle>
  );
};
