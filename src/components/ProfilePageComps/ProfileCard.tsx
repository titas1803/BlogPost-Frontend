import React, { useMemo } from "react";
import { ProfileCardStyle } from "./style";
import { Button } from "react-bootstrap";
import { VscCopy } from "react-icons/vsc";
import { UpdateProfileImage } from "./UpdateProfileImage";
import { IFetchedUserDetails } from "@/Utilities/Types";
import { useSelector } from "react-redux";
import { ProfileImage } from "./ProfileImage";
import { AppState } from "@/store/store";

type Props = {
  userDetails: IFetchedUserDetails;
};

export const ProfileCard: React.FC<Props> = ({ userDetails }) => {
  const loggedInUserid = useSelector((state: AppState) => state.login.userid);
  const { profilePhoto, dob } = useMemo(() => {
    const photo = userDetails.photo
      ? userDetails.photo.replaceAll("\\", "/")
      : "";
    const dobObject = new Date(userDetails.dob);
    const dob = dobObject.toLocaleDateString("en-GB");

    return { profilePhoto: photo, dob };
  }, [userDetails]);

  const copyUserName = () => {
    navigator.clipboard.writeText(userDetails.userName);
  };

  return (
    <ProfileCardStyle className="profile-card py-2 px-3 position-relative">
      <div className="profile-photo mx-3 mx-md-auto position-relative">
        <div className="img-div">
          <ProfileImage
            image={profilePhoto}
            alt={userDetails.userName}
            userId={userDetails.id}
          />
          {loggedInUserid === userDetails.id && <UpdateProfileImage />}
        </div>
      </div>
      <div className="profile-details p-3 mx-auto">
        <div className="profile-name">
          <h3 className="name-text">{userDetails.name}</h3>
        </div>
        <div className="profile-username d-flex mb-2">
          <p className="mb-0 me-2">@{userDetails.userName}</p>
          <Button className="d-flex align-items-center" onClick={copyUserName}>
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
              {userDetails.noOfSubscriberedTo}
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
