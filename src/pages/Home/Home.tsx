import React from "react";
import { HomeAddPost, ViewPost } from "@components/Posts";
import { HomeStyle } from "./styles";

const demoPost = {
  id: "123141",
  title: "Post title",
  content:
    "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Similique nihil laboriosam vero nesciunt autem error. Dolor asperiores excepturi eaque qui, cum doloremque impedit odit mollitia iusto expedita voluptatibus at consequuntur.",
  authorId: "abcd",
  authorName: "abcd efgh",
  tags: ["#adventure, #travel"],
  categories: [],
  image: [],
  likedBy: ["cdef", "shg", "asdff"],
  commentsCount: 20,
  isPublished: true,
  authorDetails: {
    _id: "67993d0a7b28b3ee2fff64b6",
    name: "titas",
    userName: "titas1803",
  },
};

export const Home: React.FC = () => {
  return (
    <HomeStyle className="mx-auto">
      <HomeAddPost />
      <ViewPost post={demoPost} />
    </HomeStyle>
  );
};
