import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { LoginFormStyle } from "./styles";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store/store";
import { login } from "@/slices/loginSlice";
import { ILoginState } from "@/Utilities/Types";
import { Button, FloatingLabel, Form } from "react-bootstrap";
import { useViewPassword } from "@/hooks/viewPasswordHook";
import { FaEye } from "react-icons/fa";
import { LuEyeClosed } from "react-icons/lu";
import { SubmitHandler, useForm } from "react-hook-form";
import { object as yupObject, string as yupString } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormError } from "@components/FormError";
import { passwordRegex } from "@/Utilities/constants";
import toast from "react-hot-toast";
import { fetchInitialuserDetails } from "@/slices/userSlice";

const schema = yupObject().shape({
  loginUsername: yupString()
    .required("Please enter a username")
    .matches(
      /^[a-z][a-z\d]{4,14}$/,
      "⚠️ Usernamme can't contain any special charater or capitalized letter<br />⚠️ it should start with a alphabet only<br />⚠️ length should be between 5 and 15"
    ),
  loginPassword: yupString()
    .required("Please enter your password")
    .matches(
      passwordRegex,
      "⚠️ At least 8 characters long<br />⚠️ Contains at least one uppercase letter (A-Z)<br />⚠️ Contains at least one lowercase letter (a-z)<br />⚠️ Contains at least one digit (0-9)<br />⚠️ Contains at least one special character"
    ),
});

type FieldType = {
  loginUsername: string;
  loginPassword: string;
};

export const LoginForm: React.FC = () => {
  const { fieldType, changeFieldType } = useViewPassword();
  const [searchParams] = useSearchParams();
  const fromUrl = searchParams.get("from");
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { loggedIn, error } = useSelector(
    (state: { login: ILoginState }) => state.login
  );

  useEffect(() => {
    if (loggedIn) {
      setTimeout(() => {
        navigate(`/${fromUrl ?? ""}`);
      }, 1000);
      toast.success("Login Successfull", {
        removeDelay: 1000,
      });
    } else if (error) {
      toast.error(`Login failed, Verify username or password`);
    }
  }, [fromUrl, loggedIn, navigate, error]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldType>({
    mode: "all",
    reValidateMode: "onChange",
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<FieldType> = (data) => {
    dispatch(
      login({ username: data.loginUsername, password: data.loginPassword })
    )
      .unwrap()
      .then(() => {
        dispatch(fetchInitialuserDetails());
      });
  };

  return (
    <LoginFormStyle className="p-4">
      <h2 className="form-heading login-form">Log in</h2>
      {error && (
        <p className="danger">Login failed, Verify username or password</p>
      )}
      <Form onSubmit={handleSubmit(onSubmit)} className="my-3">
        <div className="mb-3">
          <FloatingLabel
            label={
              <>
                Enter your username<span className="required-asterisk">*</span>
              </>
            }
            controlId="username"
          >
            <Form.Control
              type="text"
              placeholder="username"
              {...register("loginUsername")}
            />
          </FloatingLabel>
          <FormError fieldError={errors.loginUsername} />
        </div>
        <div className="mb-3">
          <FloatingLabel
            label={
              <>
                Enter your password<span className="required-asterisk">*</span>
              </>
            }
            controlId="login-password"
            className="d-flex w-100"
          >
            <Form.Control
              type={fieldType}
              placeholder="password"
              {...register("loginPassword")}
            />
            <Button
              onClick={changeFieldType}
              variant="outline-light"
              className="show-password"
            >
              {fieldType === "password" ? (
                <FaEye fill="black" />
              ) : (
                <LuEyeClosed fill="black" />
              )}
            </Button>
          </FloatingLabel>
          <FormError fieldError={errors.loginPassword} />
        </div>
        <Button type="submit" className="submit">
          Submit
        </Button>
      </Form>
    </LoginFormStyle>
  );
};
