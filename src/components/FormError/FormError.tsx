import React from "react";
import { FormText } from "react-bootstrap";
import { FieldError } from "react-hook-form";

type Props = {
  className?: string;
  fieldError: FieldError | undefined;
};
export const FormError: React.FC<Props> = ({ fieldError, className = "" }) => {
  if (!fieldError || !fieldError.message) return "";
  return (
    <FormText
      className={`form-error ${className}`}
      dangerouslySetInnerHTML={{ __html: fieldError.message }}
    />
  );
};
