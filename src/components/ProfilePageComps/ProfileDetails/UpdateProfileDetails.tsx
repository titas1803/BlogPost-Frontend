import { IUpdateDetailsValues } from "@/Utilities/Types";
import { Avatar, Button, MenuItem, Stack, TextField } from "@mui/material";
import React, { FormEvent, useMemo, useTransition } from "react";
import { Form, Modal } from "react-bootstrap";
import {
  processProfilePhotoPath,
  usernameInputDebounce,
} from "@/Utilities/utilities";
import { object as yupObject, string as yupString } from "yup";
import { FieldErrors, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { MdSend } from "react-icons/md";
import { FormError } from "@/components/FormError";
import axios from "axios";
import { useSelector } from "react-redux";
import { AppState } from "@/store/store";
import toast from "react-hot-toast";
import { useProfileContext } from "@/hooks/profileCtxHook";

type Props = {
  show: boolean;
  setShow: (arg: boolean) => void;
  className?: string;
};

const updateDetailsSchema = yupObject().shape({
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
  dob: yupString()
    .required("Please enter your dob.")
    .test(
      "valid-past-date",
      "your date of birth can't be in the future.",
      (value) => {
        if (!value) return false;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (new Date(value) < today) return true;
        return false;
      }
    ),
});

const UPDATEURL = import.meta.env.BLOGPOST_FRONTEND_API_URL + "/user/update";

export const UpdateProfileDetails: React.FC<Props> = ({
  show,
  setShow,
  className,
}) => {
  const { userDetails } = useProfileContext();
  const [isPending, startTransition] = useTransition();
  const { firstName, lastName } = useMemo(() => {
    const splitName = userDetails!.name.split(" ");
    let firstName = "";
    let lastName = "";
    if (splitName.length > 1) {
      lastName = splitName.pop() ?? "";
    }
    firstName = splitName.join(" ");
    return { firstName, lastName };
  }, [userDetails]);

  const { "auth-token": authToken } = useSelector(
    (state: AppState) => state.login
  );

  const profilePhoto = useMemo(() => {
    return processProfilePhotoPath(userDetails!.photo);
  }, [userDetails]);

  const defaultValue: IUpdateDetailsValues = {
    firstName: firstName,
    lastName: lastName,
    username: userDetails?.userName ?? "",
    email: userDetails?.email ?? "",
    phone: userDetails?.phone ?? "",
    gender: (userDetails?.gender as "male" | "female") ?? "male",
    dob: new Date(userDetails?.dob ?? "").toISOString().split("T")[0],
  };

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<IUpdateDetailsValues>({
    mode: "all",
    reValidateMode: "onBlur",
    resolver: yupResolver(updateDetailsSchema),
    defaultValues: defaultValue,
  });

  const userNameHandler = async (e: FormEvent) => {
    const value = (e.target as HTMLInputElement).value;
    if (value.length > 4) {
      await usernameInputDebounce(
        (e.target as HTMLInputElement).value,
        setError,
        userDetails?.userName
      );
    }
  };

  const onSubmit = async (data: IUpdateDetailsValues) => {
    console.log(data);

    const formData = {
      name: data.firstName + " " + data.lastName,
      userName: data.username,
      email: data.email,
      phone: data.phone,
      dob: data.dob,
      gender: data.gender,
    };
    const updateDetails = async () => {
      try {
        const response = await axios.patch(UPDATEURL, formData, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        if (response.status === 200) {
          console.log(response.data.user);
          toast.success("user details updated successfully");
        }
      } catch {
        toast.error("Error occured, please try again");
      }
    };
    startTransition(() => {
      updateDetails();
    });
  };

  const onError = (error: FieldErrors<IUpdateDetailsValues>) => {
    console.log(error);
  };

  return (
    <Modal
      show={show}
      onHide={() => setShow(false)}
      className={`${className} update-profile-details-modal`}
      centered
    >
      <Modal.Header closeButton>
        <Avatar alt={userDetails?.name ?? "username"} src={profilePhoto} />
        <Modal.Title className="ms-2">Update your details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit(onSubmit, onError)}>
          <Stack direction={"column"} spacing={2} useFlexGap>
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={2}
              useFlexGap
            >
              <TextField
                id="first-name"
                required
                autoFocus
                autoComplete="off"
                error={errors.firstName ? true : false}
                label="First name"
                variant="standard"
                helperText={<FormError fieldError={errors.firstName} />}
                sx={{ width: { md: "48%" } }}
                {...register("firstName")}
              />
              <TextField
                id="last-name"
                label="Last name"
                autoComplete="off"
                error={errors.lastName ? true : false}
                variant="standard"
                helperText={<FormError fieldError={errors.lastName} />}
                sx={{ width: { md: "48%" } }}
                {...register("lastName")}
              />
            </Stack>
            <Stack>
              <TextField
                id="username"
                label="username"
                autoComplete="off"
                error={errors.username ? true : false}
                variant="standard"
                required
                helperText={<FormError fieldError={errors.username} />}
                sx={{ width: "100%" }}
                {...register("username")}
                onInput={async (e) => await userNameHandler(e)}
                onBlur={async (e) => await userNameHandler(e)}
              />
            </Stack>
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={2}
              useFlexGap
            >
              <TextField
                id="email"
                required
                autoComplete="off"
                error={errors.email ? true : false}
                label="Email"
                variant="standard"
                helperText={<FormError fieldError={errors.email} />}
                sx={{ width: { md: "48%" } }}
                {...register("email")}
              />
              <TextField
                id="phone"
                label="Phone"
                autoComplete="off"
                required
                error={errors.phone ? true : false}
                helperText={<FormError fieldError={errors.phone} />}
                variant="standard"
                sx={{ width: { md: "48%" } }}
                {...register("phone")}
              />
            </Stack>
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={2}
              useFlexGap
            >
              <TextField
                id="gender-select"
                select
                label="Gender"
                error={errors.gender ? true : false}
                helperText={<FormError fieldError={errors.gender} />}
                variant="standard"
                required
                sx={{ width: { md: "48%" } }}
                {...register("gender")}
                defaultValue={userDetails?.gender ?? "male"}
              >
                <MenuItem value={"male"}>Male</MenuItem>
                <MenuItem value={"female"}>Female</MenuItem>
              </TextField>
              <TextField
                id="dob"
                type="date"
                label="Date of birth"
                error={errors.dob ? true : false}
                helperText={<FormError fieldError={errors.dob} />}
                variant="standard"
                {...register("dob")}
                required
                sx={{ width: { md: "48%" } }}
              />
            </Stack>
          </Stack>
          <Button
            type="submit"
            endIcon={<MdSend />}
            loading={isPending}
            loadingPosition="end"
            variant="contained"
            className="mt-4"
          >
            Update
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};
