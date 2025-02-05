import { yupResolver } from "@hookform/resolvers/yup";
import React, { useState } from "react";
import { Button, FloatingLabel, Form } from "react-bootstrap";
import { SubmitHandler, useForm } from "react-hook-form";
import { object as yupObject, string as yupString, ref as yupRef } from "yup";
import { FormError } from "@components/FormError";
import { FaEye } from "react-icons/fa";
import { LuEyeClosed } from "react-icons/lu";
import { useSignUpContext, useViewPassword } from "@/hooks";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { useNavigate, useSearchParams } from "react-router-dom";
import { LoadingModal } from "@components/LoadingModal";
import axios from "axios";
import { passwordRegex } from "@/Utilities/constants";
import toast from "react-hot-toast";

const schema = yupObject().shape({
  password: yupString()
    .required("Please enter a password")
    .matches(
      passwordRegex,
      "⚠️ At least 8 characters long<br />⚠️ Contains at least one uppercase letter (A-Z)<br />⚠️ Contains at least one lowercase letter (a-z)<br />⚠️ Contains at least one digit (0-9)<br />⚠️ Contains at least one special character"
    ),
  confirmPassword: yupString()
    .required("Please confirm your password")
    .matches(
      passwordRegex,
      "⚠️ At least 8 characters long<br />⚠️ Contains at least one uppercase letter (A-Z)<br />⚠️ Contains at least one lowercase letter (a-z)<br />⚠️ Contains at least one digit (0-9)<br />⚠️ Contains at least one special character"
    )
    .oneOf([yupRef("password")], "Passwords must match"),
});

type PasswordFormDataType = {
  password: string;
  confirmPassword: string;
};

export const PasswordForm: React.FC = () => {
  const { details, setActiveFormIndex } = useSignUpContext();
  const [isSubmitting, setIsSubmitting] = useState({
    isSubmitting: false,
    message: "Submitting details...",
    className: "",
  });
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const {
    fieldType: passwordFieldType,
    changeFieldType: changePasswordFieldType,
  } = useViewPassword();
  const {
    fieldType: confirmPasswordFieldType,
    changeFieldType: changeConfirmPasswordFieldType,
  } = useViewPassword();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordFormDataType>({
    mode: "all",
    reValidateMode: "onChange",
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<PasswordFormDataType> = async (data) => {
    setIsSubmitting({
      isSubmitting: true,
      message: "Submitting details...",
      className: "submitting",
    });
    const formData = {
      name: details.firstName + " " + details.lastName,
      userName: details.username,
      email: details.email,
      phone: details.phone,
      dob: details.dob,
      gender: details.gender,
      password: data.password,
    };
    try {
      const response = await axios.post(
        import.meta.env.BLOGPOST_FRONTEND_API_URL + "/user/createUser",
        formData
      );
      toast.success(`Welcome to BlogPost! ${response.data.username}`);
      reset();
      navigate(`/login?${searchParams}`);
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        toast.error(`Error occurred, ${error.response?.data.message}`);
      } else {
        toast.error("An unknown error occurred");
      }
      console.log(error);
    } finally {
      setActiveFormIndex(0);
      setIsSubmitting({
        isSubmitting: false,
        message: "",
        className: "",
      });
    }
  };

  return (
    <>
      <Button onClick={() => setActiveFormIndex(0)} className="back-btn mb-3">
        <span className="btn-text-one">
          <IoArrowBackCircleOutline color="white" />
        </span>
        <span className="btn-text-two">
          <strong>Go back</strong>
        </span>
      </Button>
      <LoadingModal
        show={isSubmitting.isSubmitting}
        message={isSubmitting.message}
        className={isSubmitting.className}
      />
      <h2 className="form-heading password-form-heading">Set a password</h2>
      <Form onSubmit={handleSubmit(onSubmit)} className="password-form my-3">
        <div className="form-fields">
          <div className="mb-3">
            <div className="d-flex">
              <FloatingLabel
                controlId="password"
                className="d-flex w-100"
                label={
                  <>
                    Password<span className="required-asterisk">*</span>
                  </>
                }
                as="label"
              >
                <Form.Control
                  type={passwordFieldType}
                  placeholder="Enter a password."
                  {...register("password")}
                />
                <Button
                  onClick={changePasswordFieldType}
                  variant="outline-light"
                  className="show-password"
                >
                  {passwordFieldType === "password" ? (
                    <FaEye fill="black" />
                  ) : (
                    <LuEyeClosed fill="black" />
                  )}
                </Button>
              </FloatingLabel>
            </div>
            <FormError fieldError={errors.password} />
          </div>
          <div className="mb-3">
            <div className="d-flex">
              <FloatingLabel
                controlId="confirmPassword"
                className="d-flex w-100"
                label={
                  <>
                    Confirm password<span className="required-asterisk">*</span>
                  </>
                }
                as="label"
              >
                <Form.Control
                  type={confirmPasswordFieldType}
                  placeholder="Confirm your password."
                  {...register("confirmPassword")}
                />
                <Button
                  onClick={changeConfirmPasswordFieldType}
                  variant="outline-light"
                  className="show-password"
                >
                  {confirmPasswordFieldType === "password" ? (
                    <FaEye fill="black" />
                  ) : (
                    <LuEyeClosed fill="black" />
                  )}
                </Button>
              </FloatingLabel>
            </div>
            <FormError fieldError={errors.confirmPassword} />
          </div>
        </div>
        <Button
          type="submit"
          className="submit"
          disabled={isSubmitting.isSubmitting}
        >
          Complete sign up
        </Button>
      </Form>
    </>
  );
};
