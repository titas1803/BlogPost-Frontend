import { yupResolver } from "@hookform/resolvers/yup";
import React, { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { FieldErrors, SubmitHandler, useForm } from "react-hook-form";
import { FiCamera } from "react-icons/fi";
import { mixed, object as yupObject } from "yup";
import { FormError } from "../FormError";
import axios from "axios";
import { ILoginState } from "@/Utilities/Types";
import { useSelector } from "react-redux";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB
const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/png"];

const validationSchema = yupObject().shape({
  photo: mixed<FileList>()
    .required("Photo is required")
    .test("required", "Image is required", (value) => value && value.length > 0)
    .test("fileSize", "File size must be less than 2MB", (value) =>
      value && value[0] ? value[0].size <= MAX_FILE_SIZE : true
    )
    .test("fileFormat", "Only JPEG or PNG images are allowed", (value) =>
      value && value[0] ? SUPPORTED_FORMATS.includes(value[0].type) : true
    ),
});

type ImageFormFields = {
  photo: FileList;
};

export const UpdateProfileImage: React.FC = () => {
  const [showUpdateDPModal, setShowUpdateDPModal] = useState(false);
  const updatePhotoBtnClick = () => {
    setShowUpdateDPModal(true);
  };

  const { "auth-token": authToken } = useSelector(
    (state: { login: ILoginState }) => state.login
  );

  const onModalHide = () => {
    setShowUpdateDPModal(false);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ImageFormFields>({
    mode: "all",
    reValidateMode: "onChange",
    resolver: yupResolver(validationSchema),
  });

  const onUpdateImage: SubmitHandler<ImageFormFields> = async (data) => {
    console.log("in submit", data);

    // const newData = {
    //   photo: data.photo[0],
    // };

    const formData = new FormData();
    formData.append("photo", data.photo[0]);

    try {
      const response = await axios.patch(
        import.meta.env.BLOGPOST_FRONTEND_API_URL + "/user/update/update-photo",
        formData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        setShowUpdateDPModal(false);
      }
    } catch (error) {
      console.error("Error occured", error);
    }
  };

  const onError = (error: FieldErrors<ImageFormFields>) => {
    console.log(error);
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
            <Form onSubmit={handleSubmit(onUpdateImage, onError)}>
              <Form.Group controlId="profile-picture-update" className="mb-3">
                <Form.Control
                  type="file"
                  accept="image/*"
                  capture="user"
                  multiple={false}
                  {...register("photo")}
                />
                <FormError fieldError={errors.photo} />
              </Form.Group>
              <Button type="submit">Submit</Button>
            </Form>
          </Modal.Body>
        </Modal.Dialog>
      </Modal>
    </>
  );
};
