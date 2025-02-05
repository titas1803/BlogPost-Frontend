import { yupResolver } from "@hookform/resolvers/yup";
import React from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { FieldErrors, SubmitHandler, useForm } from "react-hook-form";
import { FormError } from "../FormError";
import { mixed, object as yupObject } from "yup";
import { useDispatch, useSelector } from "react-redux";
import { fetchInitialuserDetails } from "@/slices/userSlice";
import { AppDispatch } from "@/store/store";
import { ILoginState } from "@/Utilities/Types";
import { updateProfileImage } from "@/Utilities/utilities";
import toast from "react-hot-toast";
import axios from "axios";

type Props = {
  show: boolean;
  onHide: () => void;
};

type ImageFormFields = {
  photo: FileList;
};

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

export const UpdateImageModal: React.FC<Props> = ({ show, onHide }) => {
  const dispatch = useDispatch<AppDispatch>();

  const { "auth-token": authToken } = useSelector(
    (state: { login: ILoginState }) => state.login
  );

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
    const photoData = new FormData();
    photoData.append("photo", data.photo[0]);

    try {
      const response = await updateProfileImage(photoData, authToken!);

      if (response.status === 200) {
        onHide();
        console.log("updated image");
        dispatch(fetchInitialuserDetails());
      }

      toast.success("Profile picture updated successfully");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(`Error occurred, ${error.response?.data.message}`);
      } else {
        toast.error("An unknown error occurred");
      }
    }
  };

  const onError = (error: FieldErrors<ImageFormFields>) => {
    console.log(error);
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      contentClassName="updateImageContent"
    >
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
  );
};
