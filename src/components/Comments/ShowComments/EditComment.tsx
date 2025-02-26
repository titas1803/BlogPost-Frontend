import { FormError } from "@/components/FormError";
import { yupResolver } from "@hookform/resolvers/yup";
import { IconButton, Stack, TextField, Tooltip } from "@mui/material";
import React, { useMemo } from "react";
import { Form } from "react-bootstrap";
import { SubmitHandler, useForm } from "react-hook-form";
import { IoMdClose } from "react-icons/io";
import { MdSend } from "react-icons/md";
import { object as yupObject, string as yupString } from "yup";

type Props = {
  commentText: string;
  setCommentText: (val: string) => void;
  setShowEdit: (val: boolean) => void;
};

const schema = yupObject().shape({
  commentText: yupString().required("Please enter a comment"),
});

type FormFields = {
  commentText: string;
};

export const EditComment: React.FC<Props> = ({
  commentText,
  setCommentText,
  setShowEdit,
}) => {
  const defaultValues = useMemo(
    () => ({
      commentText,
    }),
    [commentText]
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<FormFields>({
    mode: "all",
    reValidateMode: "onChange",
    resolver: yupResolver(schema),
    defaultValues,
  });

  const closeForm = () => {
    setShowEdit(false);
  };

  const onSubmit: SubmitHandler<FormFields> = (data) => {
    setCommentText(data.commentText);
    closeForm();
  };
  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Stack direction="row" spacing={2} useFlexGap>
        <TextField
          required
          autoFocus
          autoComplete="off"
          multiline
          error={errors.commentText ? true : false}
          variant="standard"
          helperText={<FormError fieldError={errors.commentText} />}
          sx={{ width: { md: "75%" } }}
          {...register("commentText")}
        />
        <Stack direction="row" spacing={2} useFlexGap>
          <Tooltip title="update comment">
            <IconButton
              type="submit"
              className="m-0"
              disabled={!isDirty || isSubmitting}
              aria-label="update comment"
            >
              <MdSend fill={!isDirty || isSubmitting ? "grey" : "blue"} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Close">
            <IconButton
              className="m-0"
              disabled={isSubmitting}
              aria-label="Close"
              onClick={closeForm}
            >
              <IoMdClose fill="red" />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>
    </Form>
  );
};
