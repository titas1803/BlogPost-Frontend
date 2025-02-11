import React, { useEffect, useState, useTransition } from "react";
import { HomeAddPost, ViewPost } from "@components/Posts";
import { HomeStyle } from "./styles";
import axios from "axios";
import { IPost } from "@/Utilities/Types";
import { useSelector } from "react-redux";
import { AppState } from "@/store/store";

export const Home: React.FC = () => {
  const [post, setPost] = useState<IPost>();
  const [isPending, startTransition] = useTransition();

  const authToken = useSelector((state: AppState) => state.login["auth-token"]);
  useEffect(() => {
    const fetchAPost = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.BLOGPOST_FRONTEND_API_URL
          }/post/679feb5ecba2975fb7be4cb9`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        if (response.status === 200) {
          setPost(response.data.post);
        }
      } catch {
        setPost(undefined);
      }
    };

    startTransition(() => {
      fetchAPost();
    });
  }, [authToken]);
  return (
    <HomeStyle className="mx-auto">
      <HomeAddPost />
      {isPending && <p>Loading..</p>}
      {post ? <ViewPost post={post} /> : <p>No post found</p>}
    </HomeStyle>
  );
};
