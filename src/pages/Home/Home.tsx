import React from "react";
import { AddPost, ViewPost } from "@components/Posts";
import { HomeStyle } from "./styles";

export const Home: React.FC = () => {
  return (
    <HomeStyle className="mx-auto">
      <AddPost />
      <ViewPost postid="abcd" />
    </HomeStyle>
  );
};
