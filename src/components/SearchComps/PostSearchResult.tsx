import React from "react";
import { ListOfPosts } from "../Posts";
import axios, { AxiosError } from "axios";
import { IPost } from "@/Utilities/Types";
import { useQuery } from "@tanstack/react-query";
import { LoadingCircle } from "../Loading";

type Props = {
  keyword: string;
};

const POSTSEARCHURL =
  import.meta.env.BLOGPOST_FRONTEND_API_URL + `/post/search`;

const searchPost = async (keyword: string): Promise<IPost[]> => {
  if (keyword.length > 3) {
    const response = await axios.get(
      POSTSEARCHURL + `?keyword=${encodeURIComponent(keyword)}`
    );
    return response.data.posts;
  }
  throw new AxiosError("Search keyword should be more than 3 character long.");
};

export const PostSearchResult: React.FC<Props> = ({ keyword }) => {
  const {
    data: postSearchResult,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["searchposts", keyword],
    queryFn: async () => searchPost(keyword),
    retry: false,
  });

  return (
    <div className="result">
      <LoadingCircle isLoading={isLoading} />
      {isError && <p>No result found. Please refine your search</p>}
      {postSearchResult && <ListOfPosts listOfPosts={postSearchResult} />}
    </div>
  );
};
