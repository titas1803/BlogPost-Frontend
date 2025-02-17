import { IComments } from "@/Utilities/Types";
import React, { useMemo, useState } from "react";
import { CommentStyle } from "./styles";
import { Link } from "react-router-dom";
import {
  Avatar,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
} from "@mui/material";
import { SlLike, SlOptions } from "react-icons/sl";
import { MdOutlineModeEdit } from "react-icons/md";
import { AiOutlineDelete } from "react-icons/ai";
import { IoIosOptions } from "react-icons/io";
import { useSelector } from "react-redux";
import { AppState } from "@/store/store";
import { Button } from "react-bootstrap";
import { FaThumbsUp } from "react-icons/fa";
import { processProfilePhotoPath } from "@/Utilities/utilities";

type Props = {
  comment: IComments;
};
export const Comment: React.FC<Props> = ({ comment }) => {
  const { userid } = useSelector((state: AppState) => state.login);
  const [liked, setLiked] = useState<boolean>(
    userid ? comment.likedBy.includes(userid) : false
  );

  const { timeDifference, unit } = useMemo(() => {
    const createdTime = new Date(comment.createdAt);

    const currentTime = new Date();
    const hourDifference =
      (currentTime.getTime() - createdTime.getTime()) / 3600000;

    const unit = hourDifference > 24 ? "days" : "hour";

    const timeDifference = Math.floor(
      hourDifference > 24 ? hourDifference / 24 : hourDifference
    );
    return { timeDifference, unit };
  }, [comment.createdAt]);

  const likeAComment = () => {
    setLiked(true);
  };

  const unLikeAComment = () => {
    setLiked(false);
  };
  return (
    <CommentStyle className="position-relative my-1">
      <div className="d-flex justify-content-between align-items-center">
        <div className="d-inline-flex align-items-center">
          <Link
            to={`/profile/${comment.authorDetails._id}`}
            className="me-3 text-decoration-none d-inline-flex align-items-center gap-2"
          >
            <Avatar
              component={"span"}
              alt={comment.authorDetails.userName}
              src={processProfilePhotoPath(comment.authorDetails.photo ?? "")}
            />
            <strong>{comment.authorDetails.userName}</strong>
          </Link>
          <small>
            {timeDifference} {unit} ago
          </small>
        </div>
        {userid && userid === comment.authorId && (
          <SpeedDial
            ariaLabel="Options"
            icon={
              <SpeedDialIcon
                className="speed-dial-icon"
                icon={<SlOptions fill="black" />}
                openIcon={<IoIosOptions fill="black" />}
                sx={{ bgcolor: "transparent", p: 0 }}
              />
            }
            direction="left"
            sx={{ position: "absolute", right: 0 }}
          >
            <SpeedDialAction
              icon={<MdOutlineModeEdit />}
              tooltipTitle={"Edit"}
              onClick={() => {
                console.log("edit", comment._id);
              }}
            />
            <SpeedDialAction
              tooltipTitle={"Delete"}
              icon={<AiOutlineDelete />}
              onClick={() => {
                console.log("delete", comment._id);
              }}
            />
          </SpeedDial>
        )}
      </div>
      <p>{comment.commentText}</p>
      <div className="d-flex justify-content-start">
        <div>
          <Button
            variant="outline-light"
            onClick={liked ? unLikeAComment : likeAComment}
          >
            {liked ? <FaThumbsUp color="blue" /> : <SlLike fill="blue" />}
          </Button>{" "}
          <span>liked by {comment.likedBy.length} people</span>
        </div>
      </div>
    </CommentStyle>
  );
};
