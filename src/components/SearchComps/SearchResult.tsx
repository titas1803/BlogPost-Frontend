import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import { SearchResultStyle } from "./styles";
import { UserSearchResult } from "./UserSearchResult";
import { AppState } from "@/store/store";
import { PostSearchResult } from "./PostSearchResult";

type Props = {
  keyword: string;
};

export const SearchResult: React.FC<Props> = ({ keyword }) => {
  const [activeSection, setActiveSection] = useState<"POSTS" | "PEOPLE">(
    "POSTS"
  );

  const sectionBtnClick = (section: "POSTS" | "PEOPLE") => {
    return () => {
      setActiveSection(section);
    };
  };

  const { loggedIn } = useSelector((state: AppState) => state.login);

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
            People
          </Button>
        )}
        <Button
          className={`post-btn ${activeSection === "POSTS" ? "active" : ""}`}
          onClick={sectionBtnClick("POSTS")}
        >
          Posts
        </Button>
      </div>
      <div className="result-section">
        {loggedIn && (
          <div
            className={`people-section ${
              activeSection !== "PEOPLE" ? "d-none" : ""
            }`}
          >
            <UserSearchResult keyword={keyword} />
          </div>
        )}
        <div
          className={`posts-section ${
            activeSection !== "POSTS" ? "d-none" : ""
          }`}
        >
          <PostSearchResult keyword={keyword} />
        </div>
      </div>
    </SearchResultStyle>
  );
};
