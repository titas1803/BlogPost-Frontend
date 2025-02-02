import { ILoginState, IPost } from "@/Utilities/Types";
import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { LoadingModal } from "../LoadingModal";
import { ListOfPosts } from "../Posts";

type Props = {
  userid?: string;
};
export const UsersPosts: React.FC<Props> = ({ userid }) => {
  const [loading, setLoading] = useState(true);
  const [postsFound, setPostsFound] = useState<IPost[]>();
  const { userid: loggedInUserId, "auth-token": authToken } = useSelector(
    (state: { login: ILoginState }) => state.login
  );
  const profileUserId = useMemo(() => {
    return userid ?? loggedInUserId;
  }, [loggedInUserId, userid]);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          import.meta.env.BLOGPOST_FRONTEND_API_URL +
            "/post/getallposts/" +
            profileUserId,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        const posts: IPost[] = response.data.posts;
        setPostsFound(posts);
        setLoading(false);
      } catch {
        setLoading(false);
        setPostsFound(undefined);
      }
    };
    fetchPosts();
  }, [authToken, profileUserId]);

  return (
    <>
      {loading ? (
        <LoadingModal show message="Posts loading" />
      ) : postsFound && postsFound.length ? (
        <ListOfPosts listOfPosts={postsFound} />
      ) : (
        <div>No Post found</div>
      )}
    </>
  );
};
