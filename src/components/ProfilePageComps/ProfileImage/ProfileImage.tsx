import { fetchInitialuserDetails } from "@/slices/userSlice";
import { AppDispatch, AppState } from "@/store/store";
import axios from "axios";
import React, { useMemo, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import toast from "react-hot-toast";
import { AiOutlineDelete } from "react-icons/ai";
import { RiImageEditLine } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { UpdateImageModal } from "../ProfileImage/UpdateImageModal";
import { processProfilePhotoPath } from "@/Utilities/utilities";

type Props = {
  image: string;
  alt: string;
  userId: string;
};

export const ProfileImage: React.FC<Props> = ({ image, alt, userId }) => {
  const [modalShow, setModalShow] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const { "auth-token": authToken, userid: loggedInId } = useSelector(
    (state: AppState) => state.login
  );

  const dispatch = useDispatch<AppDispatch>();

  const removeImage = async () => {
    try {
      await axios.patch(
        import.meta.env.BLOGPOST_FRONTEND_API_URL + "/user/update/remove-photo",
        undefined,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      toast.success("Profile Image removed");
      dispatch(fetchInitialuserDetails());
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(`Error occurred, ${error.response?.data.message}`);
      } else {
        toast.error("An unknown error occurred");
      }
    }
  };

  const profilePhoto = useMemo(() => {
    const photo = processProfilePhotoPath(image);
    return photo;
  }, [image]);

  const modalHide = () => {
    setModalShow(false);
    setShowEditModal(false);
  };
  const showModal = () => setModalShow(true);

  return (
    <>
      <Button
        onClick={showModal}
        className="p-0 m-0 border-0 profile-image-modal"
      >
        <img src={profilePhoto} alt={alt} className="profile-photo-img" />
      </Button>
      <Modal
        show={modalShow}
        onHide={modalHide}
        contentClassName="profile-image-modal-content"
      >
        <Modal.Header closeButton />
        <Modal.Body className="d-flex justify-content-center">
          <img
            src={profilePhoto}
            alt={alt}
            className="profile-image-lg"
            width={200}
            height={200}
          />
        </Modal.Body>
        {userId === loggedInId && (
          <Modal.Footer className="justify-content-evenly">
            <Button
              className="d-flex border-0 align-items-center"
              title="Update image"
              onClick={() => setShowEditModal(true)}
            >
              <RiImageEditLine />
              <span className="d-none d-lg-block ms-1">Edit</span>
            </Button>
            {image.length > 0 && (
              <Button
                className="d-flex border-0 align-items-center"
                title="Remove image"
                onClick={removeImage}
              >
                <AiOutlineDelete fill="white" />
                <span className="d-none d-lg-block ms-1">Delete</span>
              </Button>
            )}
          </Modal.Footer>
        )}
      </Modal>
      <UpdateImageModal show={showEditModal} onHide={modalHide} />
    </>
  );
};
