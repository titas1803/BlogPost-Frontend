import React, { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { FiCamera } from "react-icons/fi";

export const UpdateProfileImage: React.FC = () => {
  const [showUpdateDPModal, setShowUpdateDPgModal] = useState(false);
  const updatePhotoBtnClick = () => {
    setShowUpdateDPgModal(true);
  };

  const onModalHide = () => {
    setShowUpdateDPgModal(false);
  };
  return (
    <>
      <Button
        className="update-image-btn position-absolute p-2 d-flex align-items-center"
        onClick={updatePhotoBtnClick}
      >
        <FiCamera fill="black" />
      </Button>
      <Modal show={showUpdateDPModal} onHide={onModalHide} centered>
        <Modal.Dialog>
          <Modal.Header closeButton>Update profile picture</Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="profile-picture-update" className="mb-3">
                <Form.Control type="file" accept="image/*" capture="user" />
              </Form.Group>
              <Button type="submit">Submit</Button>
            </Form>
          </Modal.Body>
        </Modal.Dialog>
      </Modal>
    </>
  );
};
