import { IFetchedUserDetails } from "@/Utilities/Types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { LoadingCircle } from "../Loading";

type Props = {
  keyword: string;
};

interface IUserSearchResult
  extends Omit<IFetchedUserDetails, "noOfSubscribers" | "noOfSubscriberedTo"> {
  subscriberDetails: {
    _id: string;
    subscribedBy: string[];
  };
}

const USERSEARCHURL =
  import.meta.env.BLOGPOST_FRONTEND_API_URL + `/user/search`;

const searchUser = async (
  keyword: string,
  loggedIn: boolean,
  authToken?: string
): Promise<IUserSearchResult[]> => {
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

export const UserSearchResult: React.FC<Props> = ({ keyword }) => {
  const { loggedIn, "auth-token": authToken } = useSelector(
    (state: { login: { loggedIn: boolean; "auth-token": string } }) =>
      state.login
  );

  const {
    data: userSearchResult,
    isError,
    isFetching,
  } = useQuery({
    queryKey: ["searchusers", keyword, loggedIn, authToken],
    queryFn: async () => searchUser(keyword, loggedIn, authToken),
    retry: 1,
  });

  return (
    <div className="result">
      <LoadingCircle isFetching={isFetching} />
      {isError && <p>No result found. Please refine your search</p>}
      {userSearchResult?.map((user, index) => {
        return (
          <Link to={`/profile/${user._id}`} key={index}>
            {user.name}
          </Link>
        );
      })}
    </div>
  );
};
