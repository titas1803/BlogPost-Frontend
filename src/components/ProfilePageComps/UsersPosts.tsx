import { IPost } from "@/Utilities/Types";
import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { ListOfPosts } from "../Posts";
import { Button } from "react-bootstrap";
import { AddPostModal } from "../Posts/AddPost/AddPostModal";
import { AppState } from "@/store/store";
import { socket } from "@/Utilities/utilities";
import { useProfileContext } from "@/hooks/profileCtxHook";
import { useQuery } from "@tanstack/react-query";
import { LoadingCircle } from "../Loading";

const fetchPosts = async (
  profileUserId: string,
  authToken: string
): Promise<IPost[]> => {
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
  return posts;
};

export const UsersPosts: React.FC = () => {
  const { userid } = useProfileContext();
  const [showAddModal, setShowModal] = useState(false);
  const { userid: loggedInUserId, "auth-token": authToken } = useSelector(
    (state: AppState) => state.login
  );

  const profileUserId = useMemo(() => {
    return userid ?? loggedInUserId;
  }, [loggedInUserId, userid]);

  const {
    data: postsFound,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["posts", profileUserId, authToken],
    queryFn: async () => fetchPosts(profileUserId!, authToken!),
  });

  const [posts, setPosts] = useState<IPost[]>([]);

  useEffect(() => {
    if (!isLoading && !isError) setPosts(postsFound ?? []);
  }, [isError, isLoading, postsFound]);

  useEffect(() => {
    // Listen for new posts in this profile room
    socket.on("new_post", (newPost: IPost) => {
      setPosts((prevPosts) => [newPost, ...(prevPosts ?? [])]);
    });

    // Listen for new posts in this profile room
    socket.on("update_post_inprofile", (updatedPost) => {
      setPosts((prevPosts) => {
        const updatedPostsArray = prevPosts?.map((post) =>
          post._id === updatedPost._id ? updatedPost : post
        );
        return updatedPostsArray;
      });
    });

    // Listen for new posts in this profile room
    socket.on("delete_post_inprofile", (deletedPostId: string) => {
      setPosts((prevPosts) =>
        prevPosts?.filter((post) => post._id !== deletedPostId)
      );
    });

    return () => {
      socket.off("update_post_inprofile"); // Cleanup on unmount
      socket.off("new_post"); // Cleanup on unmount
      socket.off("delete_post_inprofile"); // Cleanup on unmount
    };
  }, [profileUserId]);

  const onModalHide = () => setShowModal(false);

  return (
    <>
      {
        <>
          <div className="d-flex justify-content-between w-100">
            <h3 className="px-4">
              Posts{" "}
              <span className="noOfPosts">({postsFound?.length ?? 0})</span>
            </h3>
            {loggedInUserId === profileUserId && (
              <>
                <Button
                  id="add-post-profile"
                  onClick={() => setShowModal(true)}
                >
                  Add BlogPost
                </Button>
              </>
            )}
          </div>
          <AddPostModal show={showAddModal} onHide={onModalHide} />
          <hr />
          <LoadingCircle isLoading={isLoading} />
          {posts && posts.length ? (
            <ListOfPosts listOfPosts={posts} />
          ) : (
            <div>No Post found</div>
          )}
          {isError && <div>Some Error occured. Please refresh the page.</div>}
        </>
      }
    </>
  );
};
