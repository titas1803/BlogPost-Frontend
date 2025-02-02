import React, { useMemo } from "react";
import { ProfileCardStyle } from "./style";
import defaultProfilePhoto from "@/assets/profile-user.png";
import { Button } from "react-bootstrap";
import { VscCopy } from "react-icons/vsc";
import { UpdateProfileImage } from "./UpdateProfileImage";
import { FetchedUserDetailsType } from "@/Utilities/Types";

type Props = {
  userDetails: FetchedUserDetailsType;
};

export const ProfileCard: React.FC<Props> = ({ userDetails }) => {
  const { profilePhoto, dob } = useMemo(() => {
    const photo = userDetails.photo ? userDetails.photo : defaultProfilePhoto;
    const dobObject = new Date(userDetails.dob);
    const dobmonth =
      dobObject.getMonth() + 1 < 9
        ? "0" + (dobObject.getMonth() + 1)
        : dobObject.getMonth() + 1;
    const dob =
      dobObject.getDate() + "/" + dobmonth + "/" + dobObject.getFullYear();

    return {
      profilePhoto: photo,
      dob,
    };
  }, [userDetails]);

  return (
    <ProfileCardStyle className="profile-card py-2 px-3 position-relative">
      <div className="profile-photo mx-3 mx-md-auto position-relative">
        <div className="img-div">
          <img
            src={profilePhoto}
            alt={userDetails.username}
            className="profile-photo-img"
          />
          <UpdateProfileImage />
        </div>
      </div>
      <div className="profile-details p-3 mx-auto">
        <div className="profile-name">
          <h3 className="name-text">{userDetails.name}</h3>
        </div>
        <div className="profile-username d-flex mb-2">
          <p className="mb-0 me-2">@{userDetails.username}</p>
          <Button className="d-flex align-items-center">
            <VscCopy fill="black" />
          </Button>
        </div>
        <div className="profle-noOfSubs">
          <p className="mb-0">
            <span className="noOfSubs-text">{userDetails.noOfSubscribers}</span>{" "}
            Subscribers
          </p>
        </div>
        <div className="profle-noOfSubTo">
          <p className="mb-0">
            Subscribed to{" "}
            <span className="noOfSubTo-text">
              {userDetails.noOfSubscribers}
            </span>
          </p>
        </div>
        <div className="profile-dob">
          <p className="mb-0">
            Date of birth: <span className="dob-text">{dob}</span>
          </p>
        </div>
      </div>
    </ProfileCardStyle>
  );
};
