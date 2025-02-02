import React, { useState } from "react";
import { ViewPostStyles } from "./styles";
import { AddComment } from "@components/Comments";
import { Button } from "react-bootstrap";
import { SlLike } from "react-icons/sl";
import { FaThumbsUp } from "react-icons/fa";
import { PostCarousel } from "./PostCarousel";
import { IPost } from "@/Utilities/Types";
import { Link } from "react-router-dom";

type Props = {
  post: IPost;
};

export const ViewPost: React.FC<Props> = ({ post }) => {
  const [liked, setLiked] = useState(false);
  return (
    <ViewPostStyles className="d-block d-md-flex p-4 br-10">
      {post.image.length ? (
        <PostCarousel
          images={post.image}
          imageHeight={400}
          imageWidth={400}
          className="me-3 d-none d-md-block"
        />
      ) : (
        <></>
      )}
      <div>
        <article>
          <section>
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
            <h3>{post.title}</h3>
            <p>{post.content}</p>
          </section>
          {post.image.length ? (
            <PostCarousel
              images={post.image}
              imageHeight={400}
              imageWidth={400}
              className="me-3 d-block d-md-none"
            />
          ) : (
            <></>
          )}
          <div className="d-flex justify-content-between">
            <div>
              <Button variant="outline-light" onClick={() => setLiked(!liked)}>
                {liked ? <FaThumbsUp color="blue" /> : <SlLike fill="blue" />}
              </Button>{" "}
              <span>liked by {post.likedBy.length} people</span>
            </div>
            <p>
              <Button variant="link">{post.commentsCount} comments</Button>
            </p>
          </div>
        </article>
        <section>
          <div>comments</div>
          <AddComment postid={post.id} />
        </section>
      </div>
    </ViewPostStyles>
  );
};
