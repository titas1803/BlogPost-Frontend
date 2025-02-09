import { AppState } from "@/store/store";
import axios from "axios";
import React from "react";
import { Button } from "react-bootstrap";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

type Props = {
  postid: string;
  children?: React.ReactNode;
  className?: string;
};
export const DeletePostBtn: React.FC<Props> = ({
  children = "delete",
  postid,
  className = "",
}) => {
  const { "auth-token": authToken } = useSelector(
    (state: AppState) => state.login
  );

  const deletePost = async () => {
    const DELETEURL =
      import.meta.env.BLOGPOST_FRONTEND_API_URL + `/post/${postid}`;
    try {
      const response = await axios.delete(DELETEURL, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (response.data.success) {
        toast.success("Post deleted successfully");
        window.location.reload();
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(`Error occurred, ${error.response?.data.message}`);
      } else {
        toast.error("An unknown error occurred");
      }
    }
  };

  return (
    <Button
      className={`d-flex align-items-center ${className}`}
      onClick={deletePost}
    >
      {children}
    </Button>
  );
};
