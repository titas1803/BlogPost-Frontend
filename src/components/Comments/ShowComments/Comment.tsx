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
import axios from "axios";
import toast from "react-hot-toast";
import { EditComment } from "./EditComment";

type Props = {
  comment: IComments;
};

export const Comment: React.FC<Props> = ({ comment }) => {
  const { userid, "auth-token": authToken } = useSelector(
    (state: AppState) => state.login
  );
  const [showEdit, setShowEdit] = useState(false);

  const [commentText, setCommentText] = useState<string>(comment.commentText);
  const [liked, setLiked] = useState<boolean>(
    userid ? comment.likedBy.includes(userid) : false
  );

  const [likedByLength, setLikedByLength] = useState<number>(
    comment.likedBy.length
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

  const likeAComment = async () => {
    setLiked(true);
    try {
      const response = await axios.put(
        import.meta.env.BLOGPOST_FRONTEND_API_URL +
          `/comment/${comment._id}/like`,
        undefined,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      if (response.status === 200) {
        setLikedByLength(response.data.likeCount);
      }
    } catch {
      toast("Some error occured");
      setLiked(false);
    }
  };

  const unLikeAComment = async () => {
    setLiked(false);
    try {
      const response = await axios.put(
        import.meta.env.BLOGPOST_FRONTEND_API_URL +
          `/comment/${comment._id}/unlike`,
        undefined,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      if (response.status === 200) {
        setLikedByLength(response.data.likeCount);
      }
    } catch {
      toast("Some error occured");
      setLiked(true);
    }
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
                setShowEdit(true);
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
      <div>
        {showEdit ? (
          <EditComment
            commentText={commentText}
            setCommentText={setCommentText}
            setShowEdit={setShowEdit}
          />
        ) : (
          <p>{commentText}</p>
        )}
      </div>
      <div className="d-flex justify-content-start">
        <div>
          <Button
            variant="outline-light"
            onClick={liked ? unLikeAComment : likeAComment}
          >
            {liked ? <FaThumbsUp color="blue" /> : <SlLike fill="blue" />}
          </Button>{" "}
          <span>liked by {likedByLength} people</span>
        </div>
      </div>
    </CommentStyle>
  );
};
