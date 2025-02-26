import { CircularProgress } from "@mui/material";
import React from "react";

type Props = {
  isFetching: boolean;
};
export const LoadingCircle: React.FC<Props> = ({ isFetching }) => {
  return isFetching ? (
    <div className="d-flex justify-content-center">
      <CircularProgress />
    </div>
  ) : (
    <></>
  );
};
