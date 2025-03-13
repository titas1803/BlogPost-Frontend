import React from "react";
import { HomeAddPost, ViewPost } from "@components/Posts";
import { HomeStyle } from "./styles";
import axios from "axios";
import { IPost } from "@/Utilities/Types";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, AppState } from "@/store/store";
import { HomeCarousel } from "@/components/HomeCarousel";
import { useQuery } from "@tanstack/react-query";
import { logout } from "@/slices/loginSlice";
import { LoadingCircle } from "@/components/Loading";
import { Helmet } from "react-helmet-async";

const fetchAPost = async (authToken: string): Promise<IPost> => {
  const response = await axios.get(
    `${
      import.meta.env.BLOGPOST_FRONTEND_API_URL
    }/post/679feb5ecba2975fb7be4cb9`,
    {
      headers: { Authorization: `Bearer ${authToken}` },
    }
  );
  return response.data.post;
};

export const Home: React.FC = () => {
  const authToken = useSelector((state: AppState) => state.login["auth-token"]);
  const dispatch = useDispatch<AppDispatch>();

  const verifyAuthAndFetch = async () => {
    if (!authToken) {
      dispatch(logout());
      throw new Error("Please login.");
    }
    return fetchAPost(authToken);
  };

  const {
    data: post,
    isError,
    isFetching,
  } = useQuery({
    queryKey: ["homeposts", authToken],
    queryFn: verifyAuthAndFetch,
    retry: 1,
  });

  return (
    <>
      <Helmet>
        <title>BlogPost | Post your mind</title>
        <meta
          name="description"
          content="BlogPost is a small social media site where you can share your thoughts, experience and opinios to other"
        />
        <meta property="og:title" content="BlogPost | Post your mind" />
        <meta
          property="og:description"
          content="BlogPost is a small social media site where you can share your thoughts, experience and opinios to other"
        />
      </Helmet>
      <HomeStyle className="mx-auto">
        <HomeAddPost />
        <HomeCarousel />
        <LoadingCircle isFetching={isFetching} />
        {post ? <ViewPost post={post} /> : !isFetching && <p>No post found</p>}
        {isError && <p>Error occurred. Please reload.</p>}
      </HomeStyle>
    </>
  );
};
