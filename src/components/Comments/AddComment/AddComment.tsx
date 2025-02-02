import React, { ChangeEvent, FormEvent, useState } from "react";
import { AddCommentStyle } from "./styles";
import { Button, Form } from "react-bootstrap";
import { IoMdSend } from "react-icons/io";

type Props = {
  postid: string;
};

export const AddComment: React.FC<Props> = ({ postid }) => {
  const [comment, setComment] = useState("");
  const onSubmitHandler = (e: FormEvent) => {
    e.preventDefault();
    console.log(e);
    console.log(postid);
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
