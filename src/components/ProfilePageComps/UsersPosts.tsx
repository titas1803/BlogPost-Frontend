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
    const source = axios.CancelToken.source();
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
            cancelToken: source.token,
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
    return () => {
      source.cancel("Fetching Users posts cancelled");
    };
  }, [authToken, profileUserId]);

  return (
    <>
      {loading ? (
        <LoadingModal show message="Posts loading" />
      ) : postsFound && postsFound.length ? (
        <>
          <h3 className="px-4">
            Posts <span className="noOfPosts">({postsFound.length})</span>
          </h3>
          <hr />
          <ListOfPosts listOfPosts={postsFound} />
        </>
      ) : (
        <div>No Post found</div>
      )}
    </>
  );
};
