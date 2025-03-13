import React, { useMemo } from "react";
import { ProfileCardStyle } from "./style";
import { UpdateProfileImage } from "./ProfileImage/UpdateProfileImage";
import { useSelector } from "react-redux";
import { ProfileImage } from "./ProfileImage/ProfileImage";
import { AppState } from "@/store/store";
import { ProfileDetails } from "./ProfileDetails/ProfileDetails";
import { useProfileContext } from "@/hooks/profileCtxHook";
import { Button } from "@mui/material";
import { IoMdPersonAdd } from "react-icons/io";
import { useSubscribe, useUnSubscribe } from "@/hooks/subscribeHooks";
import { IoPersonRemoveSharp } from "react-icons/io5";

export const ProfileCard: React.FC = () => {
  const { userDetails } = useProfileContext();
  const loggedInUserid = useSelector((state: AppState) => state.login.userid);
  const loggedInSubscribedToList = useSelector(
    (state: AppState) => state.user.noOfSubscribers.subscribedTo
  );
  const profilePhoto = useMemo(() => {
    const photo = userDetails?.photo
      ? userDetails.photo.replaceAll("\\", "/")
      : "";

    return photo;
  }, [userDetails?.photo]);

  const subscribeToUser = useSubscribe();
  const unSubscribeToUser = useUnSubscribe();

  return (
    <>
      {userDetails ? (
        <ProfileCardStyle className="profile-card py-2 py-md-3 px-3 px-md-0 position-relative mx-md-auto">
          <div className="profile-photo mx-3 mx-md-auto position-relative">
            <div className="img-div">
              <ProfileImage
                image={profilePhoto}
                alt={userDetails.userName ?? ""}
                userId={userDetails._id ?? ""}
              />
              {loggedInUserid === (userDetails._id ?? "") && (
                <UpdateProfileImage />
              )}
            </div>
          </div>
          <ProfileDetails />
          {loggedInUserid !== userDetails._id &&
            (loggedInSubscribedToList?.includes(userDetails._id ?? "") ===
            false ? (
              <Button
                className="d-lg-flex mx-lg-auto mx-3"
                variant="contained"
                endIcon={<IoMdPersonAdd />}
                onClick={() => subscribeToUser(userDetails._id)}
              >
                Subscribe
              </Button>
            ) : (
              <Button
                className="d-lg-flex mx-lg-auto mx-3"
                variant="contained"
                endIcon={<IoPersonRemoveSharp />}
                onClick={() => unSubscribeToUser(userDetails._id)}
              >
                Unsubscribe
              </Button>
            ))}
        </ProfileCardStyle>
      ) : (
        <p>No data found</p>
      )}
    </>
  );
};
