import React, { useEffect, useState } from "react";
import { AddPostStyles } from "./styles";
import { Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { processProfilePhotoPath } from "@/Utilities/utilities";
import { AppState } from "@/store/store";
import { AddPostModal } from "./AddPostModal";

export const HomeAddPost: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [userPhoto, setUserPhoto] = useState<string>("");

  const { username } = useSelector((state: AppState) => state.login);

  const { isFetched, photo } = useSelector((state: AppState) => state.user);

  useEffect(() => {
    if (isFetched) {
      setUserPhoto(processProfilePhotoPath(photo));
      return;
    }
  }, [isFetched, photo]);

  const modalShow = () => {
    setShowModal(true);
  };
  const modalHide = () => {
    setShowModal(false);
  };

  return (
    <AddPostStyles className="my-3">
      <div className="py-3 px-3 w-100 add-btn-container br-10 d-flex justify-content-between align-items-center">
        <div className="profile-link me-2">
          <Link to="/profile" title={username}>
            <img
              src={userPhoto}
              alt="profile photo"
              width={50}
              height={50}
              aria-label={username}
            />
          </Link>
        </div>
        <Button
          onClick={modalShow}
          className="w-100 on-your-mind-btn text-start px-3 px-lg-5"
        >
          What's on your mind? {username}
        </Button>
      </div>
      <AddPostModal show={showModal} onHide={modalHide} />
    </AddPostStyles>
  );
};
