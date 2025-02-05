import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { FiCamera } from "react-icons/fi";
import { UpdateImageModal } from "./UpdateImageModal";

export const UpdateProfileImage: React.FC = () => {
  const [showUpdateDPModal, setShowUpdateDPModal] = useState(false);
  const updatePhotoBtnClick = () => {
    setShowUpdateDPModal(true);
  };

  const onModalHide = () => {
    setShowUpdateDPModal(false);
  };

  return (
    <>
      <Button
        className="update-image-btn position-absolute p-2 d-flex align-items-center"
        onClick={updatePhotoBtnClick}
      >
        <FiCamera fill="black" />
      </Button>
      <UpdateImageModal show={showUpdateDPModal} onHide={onModalHide} />
    </>
  );
};
