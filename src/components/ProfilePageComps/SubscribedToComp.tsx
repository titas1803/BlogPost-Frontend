import { ISubscribedToUsers } from "@/Utilities/Types";
import React, { useMemo, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import { SubscibedUserListStyle } from "./style";
import { useSubscribe, useUnSubscribe } from "@/hooks/subscribeHooks";
import toast from "react-hot-toast";
import { processProfilePhotoPath } from "@/Utilities/utilities";

type Props = {
  user: ISubscribedToUsers;
};

export const SubscribedList: React.FC<Props> = ({ user }) => {
  const [modalShow, setModalShow] = useState(false);
  const [subScribed, setSubScribed] = useState(user.isSubscribedByLoggedInUser);
  const subscribe = useSubscribe();
  const unSubscribe = useUnSubscribe();
  const profilePhoto = useMemo(() => {
    const photo = processProfilePhotoPath(user.photo);
    return photo;
  }, [user.photo]);

  const modalHide = () => {
    setModalShow(false);
  };
  const showModal = () => setModalShow(true);

  const subscribetoUser = async () => {
    if (subScribed) {
      toast(`you are already subscribed to ${user.userName}`);
    }
    try {
      await subscribe(user.id);
      toast.success(`you are subscribed to ${user.userName}`);
      setSubScribed(true);
    } catch (error) {
      console.log(error);
      toast.error("Some error occured");
      setSubScribed(user.isSubscribedByLoggedInUser);
    }
  };

  const unSubscribeToUser = async () => {
    if (!subScribed) {
      toast(`you are already unsubscribed to ${user.userName}`);
    }
    try {
      await unSubscribe(user.id);
      toast.success(`you are unsubscribed to ${user.userName}`);
      setSubScribed(false);
    } catch (error) {
      console.log(error);
      toast.error("Some error occured");
      setSubScribed(user.isSubscribedByLoggedInUser);
    }
  };

  return (
    <SubscibedUserListStyle>
      <div className="user-card d-flex flex-column">
        <Button onClick={showModal} className="p-0 m-0 profile-image-btn">
          <img src={profilePhoto} alt={""} className="profile-photo-img" />
        </Button>
        <div className="text-center py-2">
          <Link to={`/profile/${user.id}`}>{user.userName}</Link>
        </div>
        {subScribed ? (
          <Button className="sub-btn" onClick={unSubscribeToUser}>
            Unsubscribe
          </Button>
        ) : (
          <Button className="sub-btn" onClick={subscribetoUser}>
            Subscribe
          </Button>
        )}
      </div>
      <Modal
        show={modalShow}
        onHide={modalHide}
        contentClassName="profile-image-modal-content"
      >
        <Modal.Header closeButton />
        <Modal.Body className=" ">
          <div className="profile-image">
            <img
              src={profilePhoto}
              alt={user.userName}
              className="profile-image-lg"
              width={200}
              height={200}
            />
          </div>
        </Modal.Body>
      </Modal>
    </SubscibedUserListStyle>
  );
};
