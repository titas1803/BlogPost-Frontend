import { IconButton, Stack } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { FaUserEdit } from "react-icons/fa";
import { VscCopy } from "react-icons/vsc";
import { UpdateProfileDetails } from "./UpdateProfileDetails";
import { useProfileContext } from "@/hooks/profileCtxHook";
import { socket } from "@/Utilities/utilities";
import { IFetchedUserDetails } from "@/Utilities/Types";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, AppState } from "@/store/store";
import { logout } from "@/slices/loginSlice";
import toast from "react-hot-toast";

type Props = {
  className?: string;
};

export const ProfileDetails: React.FC<Props> = ({ className = "" }) => {
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const { userDetails, setUserDetails } = useProfileContext();
  const { userid } = useSelector((state: AppState) => state.login);
  const dispatch = useDispatch<AppDispatch>();
  const copyUserName = () => {
    navigator.clipboard.writeText(userDetails!.userName);
    toast("username copied!");
  };

  const sameUser = useMemo(() => {
    if (userDetails?._id && userid) {
      return userDetails?._id === userid;
    }
  }, [userDetails?._id, userid]);

  const dob = useMemo(() => {
    const dobObject = new Date(userDetails!.dob);
    const dob = dobObject.toLocaleDateString("en-GB");

    return dob;
  }, [userDetails]);

  useEffect(() => {
    if (!userid) dispatch(logout());
  }, [dispatch, userid]);

  useEffect(() => {
    socket.on("update_details", (newDetails: IFetchedUserDetails) => {
      setUserDetails(newDetails);
    });
    return () => {
      socket.off("update_details");
    };
  }, [setUserDetails]);

  return (
    <Stack direction="row" spacing={0} className={className}>
      <div className="profile-details p-3 mx-auto">
        <div className="profile-name">
          <h3 className="name-text">{userDetails!.name}</h3>
        </div>
        <div className="profile-username d-flex mb-2 align-items-center">
          <p className="mb-0 me-2">@{userDetails!.userName}</p>
          <IconButton aria-label="Copy Username" onClick={copyUserName}>
            <VscCopy fill="black" />
          </IconButton>
        </div>
        <div className="profle-noOfSubs">
          <p className="mb-0">
            Subscribers:{" "}
            <span className="noOfSubs-text">
              {userDetails!.noOfSubscribers.subscribedBy.length}
            </span>{" "}
          </p>
        </div>
        <div className="profle-noOfSubTo">
          <p className="mb-0">
            Subscribed to:{" "}
            <span className="noOfSubTo-text">
              {userDetails!.noOfSubscribers.subscribedTo.length}
            </span>
          </p>
        </div>
        <div className="profile-dob">
          <p className="mb-0">
            Date of birth: <strong className="dob-text">{dob}</strong>
          </p>
        </div>
      </div>
      {sameUser && (
        <div className="p-3">
          <IconButton
            aria-label="Edit"
            title="Edit details"
            onClick={() => setShowUpdateModal(true)}
          >
            <FaUserEdit fill="#046e94" />
          </IconButton>

          <UpdateProfileDetails
            show={showUpdateModal}
            setShow={setShowUpdateModal}
          />
        </div>
      )}
    </Stack>
  );
};
