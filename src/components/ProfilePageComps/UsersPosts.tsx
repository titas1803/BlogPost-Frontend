import { IPost } from "@/Utilities/Types";
import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { LoadingModal } from "../LoadingModal";
import { ListOfPosts } from "../Posts";
import { Button } from "react-bootstrap";
import { AddPostModal } from "../Posts/AddPost/AddPostModal";
import { AppState } from "@/store/store";
import { io } from "socket.io-client";

type Props = {
  userid?: string;
};

const socket = io("http://localhost:3001");

export const UsersPosts: React.FC<Props> = ({ userid }) => {
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowModal] = useState(false);
  const [postsFound, setPostsFound] = useState<IPost[]>();
  const { userid: loggedInUserId, "auth-token": authToken } = useSelector(
    (state: AppState) => state.login
  );
  const profileUserId = useMemo(() => {
    return userid ?? loggedInUserId;
  }, [loggedInUserId, userid]);

  useEffect(() => {
    // Join the profile room when visiting a user's profile
    if (profileUserId) {
      socket.emit("join_profile", profileUserId);
    }

    // Listen for new posts in this profile room
    socket.on("new_post", (newPost: IPost) => {
      console.log(newPost);
      setPostsFound((prevPosts) => [newPost, ...(prevPosts ?? [])]);
    });

    // Listen for new posts in this profile room
    socket.on("update_post", (updatedPost) => {
      setPostsFound((prevPosts) => {
        const updatedPostsArray = prevPosts?.map((post) =>
          post._id === updatedPost._id ? updatedPost : post
        );
        return updatedPostsArray;
      });
    });

    // Listen for new posts in this profile room
    socket.on("delete_post", (deletedPostId: string) => {
      setPostsFound((prevPosts) =>
        prevPosts?.filter((post) => post._id !== deletedPostId)
      );
    });

    return () => {
      socket.off("update_post"); // Cleanup on unmount
      socket.off("new_post"); // Cleanup on unmount
      socket.off("delete_post"); // Cleanup on unmount
    };
  }, [profileUserId]);

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
        console.log(posts);
        setLoading(false);
      } catch {
        setLoading(false);
        setPostsFound(undefined);
      }
    };
    fetchPosts();
    return () => {
      source.cancel();
    };
  }, [authToken, profileUserId]);

  const onModalHide = () => setShowModal(false);

  return (
    <>
      {loading ? (
        <LoadingModal show message="Posts loading" />
      ) : postsFound && postsFound.length ? (
        <>
          <div className="d-flex justify-content-between w-100">
            <h3 className="px-4">
              Posts <span className="noOfPosts">({postsFound.length})</span>
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
          <ListOfPosts listOfPosts={postsFound} />
        </>
      ) : (
        <div>No Post found</div>
      )}
    </>
  );
};
