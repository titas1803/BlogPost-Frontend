import React, { useState } from "react";
import { ViewPostStyles } from "./styles";
import { AddComment } from "@components/Comments";
import { Button } from "react-bootstrap";
import { SlLike } from "react-icons/sl";
import { FaThumbsUp } from "react-icons/fa";
import { PostCarousel } from "./PostCarousel";

type Props = {
  postid: string;
};

const demoPost = {
  title: "Post title",
  content:
    "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Similique nihil laboriosam vero nesciunt autem error. Dolor asperiores excepturi eaque qui, cum doloremque impedit odit mollitia iusto expedita voluptatibus at consequuntur.",
  authorId: "abcd",
  authorName: "abcd efgh",
  tags: ["#adventure, #travel"],
  image: [
    "https://images.pexels.com/photos/4753649/pexels-photo-4753649.jpeg",
    "https://images.pexels.com/photos/6588412/pexels-photo-6588412.jpeg",
  ],
  likedBy: ["cdef", "shg", "asdff"],
  commentsCount: "20",
};

export const ViewPost: React.FC<Props> = ({ postid }) => {
  const [liked, setLiked] = useState(false);
  return (
    <ViewPostStyles className="d-block d-md-flex p-4 br-10">
      <PostCarousel
        images={demoPost.image}
        imageHeight={400}
        imageWidth={400}
        className="me-3 d-none d-md-block"
      />
      <div>
        <article>
          <section>
            <p>
              <strong>{demoPost.authorName}</strong>
            </p>
            <h3>{demoPost.title}</h3>
            <p>{demoPost.content}</p>
          </section>
          <PostCarousel
            images={demoPost.image}
            imageHeight={250}
            imageWidth={250}
            className="mt-2 mx-auto d-block d-md-none"
          />
          <div className="d-flex justify-content-between">
            <div>
              <Button variant="outline-light" onClick={() => setLiked(!liked)}>
                {liked ? <FaThumbsUp color="blue" /> : <SlLike fill="blue" />}
              </Button>{" "}
              <span>liked by {demoPost.likedBy.length} people</span>
            </div>
            <p>
              <Button variant="link">
                {parseInt(demoPost.commentsCount)} comments
              </Button>
            </p>
          </div>
        </article>
        <section>
          <div>comments</div>
          <AddComment postid={postid} />
        </section>
      </div>
    </ViewPostStyles>
  );
};
