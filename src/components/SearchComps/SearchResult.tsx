import { IFetchedUserDetails, IPost } from "@/Utilities/Types";
import axios, { AxiosError } from "axios";
import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import { ListOfPosts } from "../Posts";
import { SearchResultStyle } from "./styles";

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

const POSTSEARCHURL =
  import.meta.env.BLOGPOST_FRONTEND_API_URL + `/post/search`;
const USERSEARCHURL =
  import.meta.env.BLOGPOST_FRONTEND_API_URL + `/user/search`;

export const SearchResult: React.FC<Props> = ({ keyword }) => {
  const [postSearchResult, setPostSearchResult] = useState<IPost[]>();
  const [userSearchResult, setUserSearchResult] =
    useState<IUserSearchResult[]>();
  const [errorMessage, setErrorMessage] = useState({
    userError: "",
    postError: "",
  });

  const [activeSection, setActiveSection] = useState<"POSTS" | "PEOPLE">(
    "POSTS"
  );

  const sectionBtnClick = (section: "POSTS" | "PEOPLE") => {
    return () => {
      setActiveSection(section);
    };
  };

  const { loggedIn, "auth-token": authToken } = useSelector(
    (state: { login: { loggedIn: boolean; "auth-token": string } }) =>
      state.login
  );

  useEffect(() => {
    const sourcePost = axios.CancelToken.source();
    const sourceUser = axios.CancelToken.source();
    const searchPost = async () => {
      try {
        if (keyword.length > 3) {
          const response = await axios.get(
            POSTSEARCHURL + `?keyword=${encodeURIComponent(keyword)}`,
            { cancelToken: sourcePost.token }
          );
          setPostSearchResult(response.data.posts);
          setErrorMessage((prev) => ({ ...prev, postError: "" }));
        }
      } catch (error: unknown) {
        if ((error as AxiosError).response?.status === 404) {
          setErrorMessage((prev) => ({
            ...prev,
            postError: "No result found, please refine your keyword",
          }));
          setActiveSection(loggedIn ? "PEOPLE" : "POSTS");
        } else {
          setErrorMessage((prev) => ({
            ...prev,
            postError: "Error while fetching search result",
          }));
        }
      }
    };

    const searchUser = async () => {
      if (loggedIn) {
        try {
          const response = await axios.get(
            USERSEARCHURL + `?keyword=${encodeURIComponent(keyword)}`,
            {
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
              cancelToken: sourceUser.token,
            }
          );
          setUserSearchResult(response.data.users);
          setErrorMessage((prev) => ({ ...prev, userError: "" }));
        } catch (error) {
          setUserSearchResult(undefined);
          if ((error as AxiosError).response?.status === 404) {
            setErrorMessage((prev) => ({
              ...prev,
              userError: "No Result found",
            }));
          } else {
            setErrorMessage((prev) => ({
              ...prev,
              userError: "Error while fetching search result",
            }));
          }
        }
      } else {
        setErrorMessage((prev) => ({
          ...prev,
          userError: "Please login!",
        }));
      }
    };
    searchPost();
    searchUser();

    return () => {
      sourcePost.cancel();
      sourceUser.cancel();
    };
  }, [authToken, keyword, loggedIn]);

  return (
    <SearchResultStyle>
      <div className="section-buttons px-4">
        {loggedIn && (
          <Button
            className={`people-btn ${
              activeSection === "PEOPLE" ? "active" : ""
            }`}
            onClick={sectionBtnClick("PEOPLE")}
          >
            People ({userSearchResult?.length ?? 0})
          </Button>
        )}
        <Button
          className={`post-btn ${activeSection === "POSTS" ? "active" : ""}`}
          onClick={sectionBtnClick("POSTS")}
        >
          Posts ({postSearchResult?.length ?? 0})
        </Button>
      </div>
      <div className="result-section">
        {loggedIn && (
          <div
            className={`people-section ${
              activeSection !== "PEOPLE" ? "d-none" : ""
            }`}
          >
            {errorMessage.userError ? (
              <p className="error">{errorMessage.userError}</p>
            ) : (
              <div className="result">
                {userSearchResult?.map((user, index) => {
                  return <p key={index}>{user.name}</p>;
                })}
              </div>
            )}
          </div>
        )}
        <div
          className={`posts-section ${
            activeSection !== "POSTS" ? "d-none" : ""
          }`}
        >
          {errorMessage.postError ? (
            <p className="error">{errorMessage.postError}</p>
          ) : (
            <div className="result">
              {postSearchResult ? (
                <ListOfPosts listOfPosts={postSearchResult} />
              ) : (
                <></>
              )}
            </div>
          )}
        </div>
      </div>
    </SearchResultStyle>
  );
};
