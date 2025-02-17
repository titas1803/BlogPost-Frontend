import React, { useEffect, useState } from "react";
import { ViewPostStyles } from "./styles";
import { AddComment, ShowComments } from "@components/Comments";
import { Button, Col, Container, Row } from "react-bootstrap";
import { SlLike, SlOptions } from "react-icons/sl";
import { FaThumbsUp } from "react-icons/fa";
import { PostCarousel } from "./PostCarousel";
import { IPost } from "@/Utilities/Types";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { MdDeleteOutline, MdOutlineModeEdit } from "react-icons/md";
import { AppDispatch, AppState } from "@/store/store";
import { logout } from "@/slices/loginSlice";
import axios from "axios";
import toast from "react-hot-toast";
import {
  deletePost,
  processProfilePhotoPath,
  socket,
  updatePost,
} from "@/Utilities/utilities";
import {
  Avatar,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
} from "@mui/material";
import { IoIosOptions, IoIosSend } from "react-icons/io";

type Props = {
  post: IPost;
};

export const ViewPost: React.FC<Props> = ({ post }) => {
  const [postToShow, setPostToShow] = useState(post);
  const { userid, "auth-token": authToken } = useSelector(
    (state: AppState) => state.login
  );
  const [liked, setLiked] = useState(
    userid ? postToShow.likedBy.includes(userid) : false
  );

  const [showComments, setShowComments] = useState(false);

  const showCommentClick = () => {
    setShowComments((prev) => !prev);
  };

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (location.pathname.startsWith("/profile") === false) {
      socket.emit("join_post", postToShow._id);
      socket.on("update_post", (updatedPost: IPost) => {
        setPostToShow(updatedPost);
      });
      return () => {
        socket.emit("leave_post", postToShow._id);
        socket.off("update_post");
      };
    }
  }, [postToShow._id]);

  useEffect(() => {
    setPostToShow(post);
  }, [post]);

  useEffect(() => {
    if (!authToken) dispatch(logout());
  }, [authToken, dispatch]);

  const likeAPost = async () => {
    const LIKEURL =
      import.meta.env.BLOGPOST_FRONTEND_API_URL +
      `/post/like/${postToShow._id}`;
    try {
      const response = await axios.put(LIKEURL, undefined, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.status === 200) {
        setLiked(true);
      }
    } catch {
      toast.error("Error occured");
    }
  };

  const unLikeAPost = async () => {
    const UNLIKEURL =
      import.meta.env.BLOGPOST_FRONTEND_API_URL +
      `/post/unlike/${postToShow._id}`;
    try {
      const response = await axios.put(UNLIKEURL, undefined, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.status === 200) {
        setLiked(false);
      }
    } catch {
      toast.error("Error occured");
    }
  };

  const deleteThePost = async () => {
    if (authToken) await deletePost(postToShow._id, authToken);
    else {
      dispatch(logout());
    }
  };

  const publishDraftPost = async () => {
    if (authToken)
      await updatePost(postToShow._id, { isPublished: "true" }, authToken);
    else {
      dispatch(logout());
    }
  };

  return (
    <ViewPostStyles className="p-2 p-md-4 br-10 mb-4">
      <Container>
        <Row>
          {postToShow.image.length > 0 && (
            <Col md={4}>
              <PostCarousel
                images={postToShow.image}
                className="mx-0 me-md-3 d-none d-md-block"
              />
            </Col>
          )}
          <Col md={postToShow.image.length ? 8 : 12}>
            <div className="w-100">
              <article>
                <section>
                  <div className="d-flex justify-content-between">
                    <div className="userdetails d-flex align-items-center gap-2">
                      <div>
                        <Avatar
                          alt={postToShow.authorDetails.userName}
                          src={processProfilePhotoPath(
                            postToShow.authorDetails.photo ?? ""
                          )}
                        />
                      </div>
                      <div>
                        <p className="mb-0">
                          <Link to={`/profile/${postToShow.authorDetails._id}`}>
                            <strong>{postToShow.authorDetails.name}</strong>
                          </Link>
                        </p>
                        <p className="mb-0">
                          <Link to={`/profile/${postToShow.authorDetails._id}`}>
                            <small>@{postToShow.authorDetails.userName}</small>
                          </Link>
                        </p>
                      </div>
                    </div>
                    {userid === postToShow.authorId && (
                      <div>
                        <SpeedDial
                          ariaLabel="Options"
                          FabProps={{
                            className: "post-speeddial-icon-fab",
                          }}
                          icon={
                            <SpeedDialIcon
                              className="post-speeddial-icon"
                              icon={<SlOptions fill="black" />}
                              openIcon={<IoIosOptions fill="black" />}
                              sx={{
                                display: "flex",
                                alignItems: "center",
                              }}
                            />
                          }
                          direction="left"
                          sx={{
                            // position: "static",
                            right: 0,
                          }}
                        >
                          <SpeedDialAction
                            icon={<MdOutlineModeEdit />}
                            tooltipTitle={"Edit"}
                            onClick={() => {
                              console.log("edit", postToShow._id);
                            }}
                          />

                          <SpeedDialAction
                            tooltipTitle={"Delete"}
                            icon={<MdDeleteOutline />}
                            onClick={deleteThePost}
                          />
                          {postToShow.isPublished === "false" && (
                            <SpeedDialAction
                              icon={<IoIosSend />}
                              tooltipTitle={"Publish"}
                              onClick={publishDraftPost}
                            />
                          )}
                        </SpeedDial>
                      </div>
                    )}
                  </div>
                  <h3>{postToShow.title}</h3>
                  <p>{postToShow.content}</p>
                </section>
                {postToShow.image.length > 0 && (
                  <PostCarousel
                    images={postToShow.image}
                    className="mx-0 me-md-3 d-block d-md-none"
                  />
                )}
                <div className="d-flex justify-content-between">
                  <div>
                    <Button
                      variant="outline-light"
                      onClick={liked ? unLikeAPost : likeAPost}
                    >
                      {liked ? (
                        <FaThumbsUp color="blue" />
                      ) : (
                        <SlLike fill="blue" />
                      )}
                    </Button>{" "}
                    <span>liked by {postToShow.likedBy.length} people</span>
                  </div>
                  <p>
                    <Button variant="link" onClick={showCommentClick}>
                      {postToShow.commentsCount} comments
                    </Button>
                  </p>
                </div>
              </article>
              <section>
                <div>comments</div>
                <AddComment postid={postToShow._id} />
                {showComments && <ShowComments postid={postToShow._id} />}
              </section>
            </div>
          </Col>
        </Row>
      </Container>
    </ViewPostStyles>
  );
};
