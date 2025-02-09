import React, { useEffect, useState } from "react";
import { ViewPostStyles } from "./styles";
import { AddComment } from "@components/Comments";
import { Button, Col, Container, Row } from "react-bootstrap";
import { SlLike } from "react-icons/sl";
import { FaThumbsUp } from "react-icons/fa";
import { PostCarousel } from "./PostCarousel";
import { IPost } from "@/Utilities/Types";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { DeletePostBtn } from "./DeletePostBtn";
import { MdDeleteOutline } from "react-icons/md";
import { AppDispatch, AppState } from "@/store/store";
import { logout } from "@/slices/loginSlice";
import axios from "axios";
import toast from "react-hot-toast";

type Props = {
  post: IPost;
};

export const ViewPost: React.FC<Props> = ({ post }) => {
  const { userid, "auth-token": authToken } = useSelector(
    (state: AppState) => state.login
  );
  const [liked, setLiked] = useState(
    userid ? post.likedBy.includes(userid) : false
  );

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (!authToken) dispatch(logout());
  }, [authToken, dispatch]);

  const likeAPost = async () => {
    const LIKEURL =
      import.meta.env.BLOGPOST_FRONTEND_API_URL + `/post/like/${post._id}`;
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
      import.meta.env.BLOGPOST_FRONTEND_API_URL + `/post/unlike/${post._id}`;
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

  return (
    <ViewPostStyles className="p-2 p-md-4 br-10 mb-4">
      <Container>
        <Row>
          {post.image.length > 0 && (
            <Col md={4}>
              <PostCarousel
                images={post.image}
                className="mx-0 me-md-3 d-none d-md-block"
              />
            </Col>
          )}
          <Col md={post.image.length ? 8 : 12}>
            <div className="w-100">
              <article>
                <section>
                  <div className="d-flex justify-content-between">
                    <div className="userdetails">
                      <p className="mb-0">
                        <Link to={`/profile/${post.authorDetails._id}`}>
                          <strong>{post.authorDetails.name}</strong>
                        </Link>
                      </p>
                      <p>
                        <Link to={`/profile/${post.authorDetails._id}`}>
                          <small>@{post.authorDetails.userName}</small>
                        </Link>
                      </p>
                    </div>
                    {userid === post.authorId && (
                      <div>
                        <DeletePostBtn postid={post._id}>
                          <MdDeleteOutline />
                        </DeletePostBtn>
                      </div>
                    )}
                  </div>
                  <h3>{post.title}</h3>
                  <p>{post.content}</p>
                </section>
                {post.image.length ? (
                  <PostCarousel
                    images={post.image}
                    className="mx-0 me-md-3 d-block d-md-none"
                  />
                ) : (
                  <></>
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
                    <span>liked by {post.likedBy.length} people</span>
                  </div>
                  <p>
                    <Button variant="link">
                      {post.commentsCount} comments
                    </Button>
                  </p>
                </div>
              </article>
              <section>
                <div>comments</div>
                <AddComment postid={post._id} />
              </section>
            </div>
          </Col>
        </Row>
      </Container>
    </ViewPostStyles>
  );
};
