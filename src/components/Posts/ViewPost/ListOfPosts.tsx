import { IPost } from "@/Utilities/Types";
import React, { useEffect, useState } from "react";
import { ViewPost } from "./ViewPost";
import { useLocation } from "react-router-dom";
import { socket } from "@/Utilities/utilities";

type Props = {
  listOfPosts: IPost[];
};

export const ListOfPosts: React.FC<Props> = ({ listOfPosts }) => {
  const [postList, setPostList] = useState(listOfPosts);

  const location = useLocation();

  useEffect(() => {
    if (location.pathname.startsWith("/profile") === false) {
      socket.on("delete_post", (deletedPostId: string) => {
        setPostList((prevPosts) =>
          prevPosts?.filter((post) => post._id !== deletedPostId)
        );
      });
    }

    return () => {
      socket.off("delete_post");
    };
  }, [location.pathname, postList]);

  useEffect(() => {
    setPostList(listOfPosts);
  }, [listOfPosts]);

  return (
    <div>
      {postList.map((post, index) => {
        return <ViewPost post={post} key={index} />;
      })}
    </div>
  );
};
