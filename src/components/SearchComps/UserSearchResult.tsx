import { IFetchedUserDetails } from "@/Utilities/Types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { LoadingCircle } from "../Loading";
import {
  Box,
  Card,
  CardContent,
  Typography,
  CardMedia,
  Button,
} from "@mui/material";
import { processProfilePhotoPath } from "@/Utilities/utilities";
import { UserSearchResultStyle } from "./styles";
import { IoMdPersonAdd } from "react-icons/io";
import { AppState } from "@/store/store";
import { IoPersonRemove } from "react-icons/io5";

type Props = {
  keyword: string;
  setActiveSection: (string: "POSTS" | "PEOPLE") => void;
};

const USERSEARCHURL =
  import.meta.env.BLOGPOST_FRONTEND_API_URL + `/user/search`;

const searchUser = async (
  keyword: string,
  loggedIn: boolean,
  authToken?: string
): Promise<IFetchedUserDetails[]> => {
  if (loggedIn && authToken) {
    const response = await axios.get(
      USERSEARCHURL + `?keyword=${encodeURIComponent(keyword)}`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
    return response.data.users;
  }
  throw new Error("You're not logged in");
};

export const UserSearchResult: React.FC<Props> = ({
  keyword,
  setActiveSection,
}) => {
  const {
    userid,
    loggedIn,
    "auth-token": authToken,
  } = useSelector((state: AppState) => state.login);

  const {
    data: userSearchResult,
    isError,
    isFetching,
  } = useQuery({
    queryKey: ["searchusers", keyword, loggedIn, authToken],
    queryFn: async () => searchUser(keyword, loggedIn, authToken),
    retry: 1,
  });

  useEffect(() => {
    if (userSearchResult?.length) {
      setActiveSection("PEOPLE");
    } else {
      setActiveSection("POSTS");
    }
  }, [setActiveSection, userSearchResult]);

  return (
    <UserSearchResultStyle className="result">
      <LoadingCircle isFetching={isFetching} />
      {isError && <p>No result found. Please refine your search</p>}
      {userSearchResult?.map((user, index) => {
        return (
          <Card
            sx={{
              display: { md: "flex" },
              margin: "20px 0",
              padding: "10px",
              width: "100%",
            }}
            key={index}
            className="user-result-card"
          >
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <CardMedia
                component="img"
                sx={{
                  width: 151,
                  aspectRatio: 1,
                  borderRadius: "50%",
                  border: "4px solid #c8c8c8",
                }}
                image={processProfilePhotoPath(user.photo)}
                alt={user.userName}
              />
            </Box>
            <Box
              sx={{
                width: "100%",
                display: { md: "flex" },
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <CardContent sx={{ flex: "1 0 auto" }}>
                <Typography component="div" variant="h5">
                  <Link
                    to={`/profile/${user._id}`}
                    className="text-decoration-none user-details-links"
                  >
                    <strong>{user.name}</strong>
                  </Link>
                </Typography>
                <Typography
                  variant="subtitle1"
                  component="div"
                  sx={{ color: "text.secondary" }}
                >
                  <Link
                    to={`/profile/${user._id}`}
                    className="text-decoration-none user-details-links"
                  >
                    <em>@{user.userName}</em>
                  </Link>
                  <Typography component="p" variant="body1">
                    <strong>Subscribed by: </strong>
                    <span>{user.noOfSubscribers.subscribedBy.length}</span>
                  </Typography>
                  <Typography component="p" variant="body1">
                    <strong>Subscribed to: </strong>
                    <span>{user.noOfSubscribers.subscribedTo.length}</span>
                  </Typography>
                </Typography>
              </CardContent>
              <Box sx={{ alignItems: "center", pl: 1, pb: 1 }}>
                {user._id !== userid &&
                  (user.noOfSubscribers.subscribedBy.includes(userid ?? "") ? (
                    <Button variant="contained" endIcon={<IoPersonRemove />}>
                      Unsubscribe
                    </Button>
                  ) : (
                    <Button variant="contained" endIcon={<IoMdPersonAdd />}>
                      Subscribe
                    </Button>
                  ))}
              </Box>
            </Box>
          </Card>
        );
      })}
    </UserSearchResultStyle>
  );
};
