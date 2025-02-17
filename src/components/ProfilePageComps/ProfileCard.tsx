import React, { useMemo } from "react";
import { ProfileCardStyle } from "./style";
import { UpdateProfileImage } from "./ProfileImage/UpdateProfileImage";
import { useSelector } from "react-redux";
import { ProfileImage } from "./ProfileImage/ProfileImage";
import { AppState } from "@/store/store";
import { ProfileDetails } from "./ProfileDetails/ProfileDetails";
import { useProfileContext } from "@/hooks/profileCtxHook";

export const ProfileCard: React.FC = () => {
  const { userDetails } = useProfileContext();
  const loggedInUserid = useSelector((state: AppState) => state.login.userid);
  const profilePhoto = useMemo(() => {
    const photo = userDetails?.photo
      ? userDetails.photo.replaceAll("\\", "/")
      : "";

    return photo;
  }, [userDetails?.photo]);

  return (
    <ProfileCardStyle className="profile-card py-2 px-3 position-relative">
      <div className="profile-photo mx-3 mx-md-auto position-relative">
        <div className="img-div">
          <ProfileImage
            image={profilePhoto}
            alt={userDetails?.userName ?? ""}
            userId={userDetails?._id ?? ""}
          />
          {loggedInUserid === (userDetails?._id ?? "") && (
            <UpdateProfileImage />
          )}
        </div>
      </div>
      <ProfileDetails />
    </ProfileCardStyle>
  );
};
