import { yupResolver } from "@hookform/resolvers/yup";
import React, { FormEvent } from "react";
import { FloatingLabel, Button } from "react-bootstrap";
import {
  SubmitHandler,
  FieldErrors,
  useForm,
  UseFormSetError,
} from "react-hook-form";
import { Form } from "react-bootstrap";
import { object as yupObject, string as yupString, date as yupDate } from "yup";
import { useSignUpContext } from "@/hooks/signupHook";
import { FormError } from "@components/FormError";
import axios from "axios";
import { MdOutlineNavigateNext } from "react-icons/md";

const usernameAvailabilityApiCall = async (
  username: string,
  setError?: UseFormSetError<DetailsFormValuesType>
) => {
  const isAvailable = await axios
    .get(
      import.meta.env.BLOGPOST_FRONTEND_API_URL +
        "/user/username-available/" +
        username
    )
    .then((res) => (res.status === 200 ? res.data.available : false))
    .catch(() => {
      return false;
    });
  if (!isAvailable && setError)
    setError("username", {
      type: "notAvailable",
      message: "Username not available. Please choose something else",
    });
  return isAvailable;
};

const usernameAvailabilityCheck = async (delay = 1000) => {
  let timeOut: NodeJS.Timeout;
  return async (
    username: string,
    setError?: UseFormSetError<DetailsFormValuesType>
  ) => {
    clearTimeout(timeOut);
    if (username && username.length > 4) {
      timeOut = setTimeout(async () => {
        await usernameAvailabilityApiCall(username, setError);
      }, delay);
    }
  };
};

const usernameInputDebounce = await usernameAvailabilityCheck();

const schema = yupObject().shape({
  firstName: yupString().required("Please enter your first name."),
  lastName: yupString().required("Please enter your last name."),
  username: yupString()
    .required("Please enter a unique username")
    .matches(
      /^[a-z][a-z\d]{4,14}$/,
      "<ul><li>Usernamme can't contain any special charater or capitalized letter</li><li>it should start with a alphabet only</li><li>length should be between 5 and 15</li></ul>"
    ),
  email: yupString()
    .required("Please enter your email")
    .email("Please enter a valid email"),
  phone: yupString()
    .required("Please enter your phone number.")
    .matches(/^\d{10}$/, "Please enter a valid phone number."),
  gender: yupString()
    .oneOf(["male", "female"], "Please select a gender.")
    .required("Please specfiy your gender."),
  dob: yupDate()
    .typeError("Please select a date")
    .required("Please enter your dob.")
    .max(new Date(), "your date of birth can't be in the future.")
    .transform((value, originalValue) =>
      originalValue === "" ? "No date selected" : value
    ),
});

type DetailsFormValuesType = {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  gender: "male" | "female";
  dob: Date;
};

export const DetailsForm: React.FC = () => {
  const { setDetails, setActiveFormIndex } = useSignUpContext();

  const userNameHandler = async (e: FormEvent) => {
    const value = (e.target as HTMLInputElement).value;
    if (value.length > 4) {
      await usernameInputDebounce(
        (e.target as HTMLInputElement).value,
        setError
      );
    }
  };

  const onSubmitDetails: SubmitHandler<DetailsFormValuesType> = async (
    data
  ) => {
    const dobMonth = data.dob.getMonth();
    const dobMonthString = (dobMonth < 9 ? "0" : "") + (dobMonth + 1);
    const dobString =
      dobMonthString + "-" + data.dob.getDate() + "-" + data.dob.getFullYear();
    console.log(
      "signupdata: ",
      data,
      dobMonthString + "-" + data.dob.getDate() + "-" + data.dob.getFullYear()
    );
    setDetails({
      ...data,
      dob: dobString,
    });
    setActiveFormIndex(1);
  };

  const onError = (error: FieldErrors<DetailsFormValuesType>) => {
    console.log(error);
  };

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<DetailsFormValuesType>({
    mode: "all",
    reValidateMode: "onChange",
    resolver: yupResolver(schema),
  });

  return (
    <>
      <h2 className="form-heading details-form-heading">Create Account</h2>
      <Form
        onSubmit={handleSubmit(onSubmitDetails, onError)}
        className="details-form"
      >
        <div className="d-block d-lg-flex flex-fields-wrapper">
          <FloatingLabel
            controlId="firstName"
            className="form-field mb-2"
            label={
              <>
                First name<span className="required-asterisk">*</span>
              </>
            }
          >
            <Form.Control
              type="text"
              placeholder="first name"
              {...register("firstName")}
            />
            <FormError fieldError={errors.firstName} />
          </FloatingLabel>
          <FloatingLabel
            controlId="lastName"
            className="form-field mb-2"
            label={
              <>
                Last name<span className="required-asterisk">*</span>
              </>
            }
          >
            <Form.Control
              type="text"
              placeholder="last name"
              {...register("lastName")}
            />
            <FormError fieldError={errors.lastName} />
          </FloatingLabel>
        </div>
        <FloatingLabel
          controlId="userName"
          className="form-field mb-2"
          label={
            <>
              Username<span className="required-asterisk">*</span>
            </>
          }
        >
          <Form.Control
            type="text"
            placeholder="username"
            {...register("username")}
            onInput={async (e) => await userNameHandler(e)}
            onBlur={async (e) => await userNameHandler(e)}
          />
          <FormError fieldError={errors.username} />
        </FloatingLabel>
        <div className="d-block d-lg-flex flex-fields-wrapper">
          <FloatingLabel
            controlId="email"
            className="form-field mb-2"
            label={
              <>
                Email id<span className="required-asterisk">*</span>
              </>
            }
          >
            <Form.Control
              type="email"
              placeholder="email"
              {...register("email")}
            />
            <FormError fieldError={errors.email} />
          </FloatingLabel>
          <FloatingLabel
            controlId="phone"
            className="form-field mb-2"
            label={
              <>
                Phone number<span className="required-asterisk">*</span>
              </>
            }
          >
            <Form.Control
              type="text"
              placeholder="phone number"
              {...register("phone")}
            />
            <FormError fieldError={errors.phone} />
          </FloatingLabel>
        </div>
        <div className="d-block d-lg-flex flex-fields-wrapper">
          <FloatingLabel
            controlId="gender"
            className="form-field mb-2"
            label={
              <>
                Gender<span className="required-asterisk">*</span>
              </>
            }
          >
            <Form.Select
              aria-label="Gender"
              defaultValue=""
              {...register("gender")}
            >
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </Form.Select>
            <FormError fieldError={errors.gender} />
          </FloatingLabel>
          <FloatingLabel
            controlId="dob"
            className="form-field mb-2"
            label={
              <>
                Date of birth<span className="required-asterisk">*</span>
              </>
            }
          >
            <Form.Control
              placeholder="select date of birth"
              type="date"
              {...register("dob")}
              min={new Date("1900-01-01").toISOString().split("T")[0]}
              max={new Date().toISOString().split("T")[0]}
            />
            <FormError fieldError={errors.dob} />
          </FloatingLabel>
        </div>
        <Button type="submit" className="submit">
          Continue <MdOutlineNavigateNext />
        </Button>
      </Form>
    </>
  );
};
