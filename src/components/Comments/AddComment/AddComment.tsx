import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { AddCommentStyle } from "./styles";
import { Button, Form } from "react-bootstrap";
import { IoMdSend } from "react-icons/io";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, AppState } from "@/store/store";
import { logout } from "@/slices/loginSlice";
import toast from "react-hot-toast";

type Props = {
  postid: string;
};

const COMMENTURL = import.meta.env.BLOGPOST_FRONTEND_API_URL + `/comment/add/`;

export const AddComment: React.FC<Props> = ({ postid }) => {
  const [comment, setComment] = useState("");
  const authToken = useSelector((state: AppState) => state.login["auth-token"]);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (!authToken) dispatch(logout());
  }, [authToken, dispatch]);

  const onSubmitHandler = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${COMMENTURL}${postid}`,
        {
          commentText: comment,
        },
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      if (response.status === 201) {
        toast.success("Successfully commented");
        setComment("");
      }
    } catch (error) {
      toast.error("Error occured");
      console.log(error);
    }
  };

  const writeComment = (e: ChangeEvent<HTMLInputElement>) => {
    setComment(e.target.value);
  };

  return (
    <AddCommentStyle>
      <Form className="d-flex" onSubmit={onSubmitHandler}>
        <Form.Control
          type="text"
          name="comment"
          placeholder="Write a comment.."
          onChange={writeComment}
          autoComplete="off"
          value={comment}
        />
        <Button
          type="submit"
          variant="outline-dark"
          disabled={comment.length === 0}
        >
          <IoMdSend />
        </Button>
      </Form>
    </AddCommentStyle>
  );
};
