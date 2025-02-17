import { IPost } from "@/Utilities/Types";
import axios from "axios";
import React, { useEffect, useMemo, useState, useTransition } from "react";
import { useSelector } from "react-redux";
import { LoadingModal } from "../LoadingModal";
import { ListOfPosts } from "../Posts";
import { Button } from "react-bootstrap";
import { AddPostModal } from "../Posts/AddPost/AddPostModal";
import { AppState } from "@/store/store";
import { socket } from "@/Utilities/utilities";
import { useProfileContext } from "@/hooks/profileCtxHook";

export const UsersPosts: React.FC = () => {
  const { userid } = useProfileContext();
  const [showAddModal, setShowModal] = useState(false);
  const [postsFound, setPostsFound] = useState<IPost[]>();
  const { userid: loggedInUserId, "auth-token": authToken } = useSelector(
    (state: AppState) => state.login
  );
  const [isPending, startTransition] = useTransition();

  const profileUserId = useMemo(() => {
    return userid ?? loggedInUserId;
  }, [loggedInUserId, userid]);

  useEffect(() => {
    // Listen for new posts in this profile room
    socket.on("new_post", (newPost: IPost) => {
      setPostsFound((prevPosts) => [newPost, ...(prevPosts ?? [])]);
    });

    // Listen for new posts in this profile room
    socket.on("update_post_inprofile", (updatedPost) => {
      setPostsFound((prevPosts) => {
        const updatedPostsArray = prevPosts?.map((post) =>
          post._id === updatedPost._id ? updatedPost : post
        );
        return updatedPostsArray;
      });
    });

    // Listen for new posts in this profile room
    socket.on("delete_post_inprofile", (deletedPostId: string) => {
      setPostsFound((prevPosts) =>
        prevPosts?.filter((post) => post._id !== deletedPostId)
      );
    });

    return () => {
      socket.off("update_post_inprofile"); // Cleanup on unmount
      socket.off("new_post"); // Cleanup on unmount
      socket.off("delete_post_inprofile"); // Cleanup on unmount
    };
  }, [profileUserId]);

  useEffect(() => {
    const source = axios.CancelToken.source();
    const fetchPosts = async () => {
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
      } catch {
        setPostsFound(undefined);
      }
    };
    startTransition(() => {
      fetchPosts();
    });
    return () => {
      source.cancel();
    };
  }, [authToken, profileUserId]);

  const onModalHide = () => setShowModal(false);

  return (
    <>
      {isPending ? (
        <LoadingModal show message="Posts loading" />
      ) : (
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
          {postsFound && postsFound.length ? (
            <ListOfPosts listOfPosts={postsFound} />
          ) : (
            <div>No Post found</div>
          )}
        </>
      )}
    </>
  );
};
