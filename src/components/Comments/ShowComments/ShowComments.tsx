import React, { useEffect, useState, useTransition } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import { logout } from "@/slices/loginSlice";
import { AppDispatch, AppState } from "@/store/store";
import { useSelector, useDispatch } from "react-redux";
import { IComments } from "@/Utilities/Types";
import { Comment } from "./Comment";
import { ShowCommentsStyle } from "./styles";

type Props = {
  postid: string;
};

export const ShowComments: React.FC<Props> = ({ postid }) => {
  const [isPending, startTransition] = useTransition();
  const [comments, setComments] = useState<IComments[]>([]);

  const authToken = useSelector((state: AppState) => state.login["auth-token"]);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (!authToken) dispatch(logout());
  }, [authToken, dispatch]);

  useEffect(() => {
    const source = axios.CancelToken.source();
    const FETCHCOMMENTSURL =
      import.meta.env.BLOGPOST_FRONTEND_API_URL +
      `/comment/seeAllComments/${postid}`;
    const fetchComments = async () => {
      try {
        const response = await axios.get(FETCHCOMMENTSURL, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          cancelToken: source.token,
        });
        if (response.status === 200) {
          setComments(response.data.comments);
        }
      } catch {
        setComments([]);
      }
    };

    startTransition(() => {
      fetchComments();
    });

    return () => {
      source.cancel();
    };
  }, [authToken, postid]);

  return (
    <ShowCommentsStyle>
      {isPending ? (
        <CircularProgress />
      ) : comments.length ? (
        <>
          {comments.map((val) => (
            <Comment comment={val} key={val._id} />
          ))}
        </>
      ) : (
        <p>No comment found</p>
      )}
    </ShowCommentsStyle>
  );
};
