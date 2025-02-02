import { IPost } from "@/Utilities/Types";
import React from "react";
import { ViewPost } from "./ViewPost";

type Props = {
  listOfPosts: IPost[];
};
export const ListOfPosts: React.FC<Props> = ({ listOfPosts }) => {
  return (
    <div>
      {listOfPosts.map((post, index) => (
        <ViewPost post={post} key={index} />
      ))}
    </div>
  );
};
