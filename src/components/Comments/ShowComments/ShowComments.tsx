import React from "react";
import axios from "axios";
import { logout } from "@/slices/loginSlice";
import { AppDispatch, AppState } from "@/store/store";
import { useSelector, useDispatch } from "react-redux";
import { IComments } from "@/Utilities/Types";
import { Comment } from "./Comment";
import { ShowCommentsStyle } from "./styles";
import { useQuery } from "@tanstack/react-query";
import { LoadingCircle } from "@/components/Loading";

type Props = {
  postid: string;
};

const FETCHCOMMENTSURL =
  import.meta.env.BLOGPOST_FRONTEND_API_URL + "/comment/seeAllComments/";

const fetchComments = async (
  postid: string,
  authToken: string
): Promise<IComments[]> => {
  const response = await axios.get(FETCHCOMMENTSURL + postid, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
  return response.data.comments;
};

export const ShowComments: React.FC<Props> = ({ postid }) => {
  const authToken = useSelector((state: AppState) => state.login["auth-token"]);
  const dispatch = useDispatch<AppDispatch>();

  const verifyAuthTokenAndFetch = async () => {
    if (!authToken) {
      dispatch(logout());
      throw new Error("Please login");
    }
    return fetchComments(postid, authToken as string);
  };

  const {
    data: comments,
    isError,
    isFetching,
  } = useQuery({
    queryKey: ["comments", postid, authToken],
    queryFn: verifyAuthTokenAndFetch,
    retry: 1,
  });

  return (
    <ShowCommentsStyle className="py-1">
      <LoadingCircle isFetching={isFetching} />
      {!isError && comments && comments.length ? (
        <>
          <div>comments</div>
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
