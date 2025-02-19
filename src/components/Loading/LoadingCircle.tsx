import { CircularProgress } from "@mui/material";
import React from "react";

type Props = {
  isLoading: boolean;
};
export const LoadingCircle: React.FC<Props> = ({ isLoading }) => {
  return isLoading ? (
    <div className="d-flex justify-content-center">
      <CircularProgress />
    </div>
  ) : (
    <></>
  );
};
