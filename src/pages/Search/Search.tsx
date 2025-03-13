import React, { ChangeEvent, KeyboardEvent, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SearchPageStyle } from "./styles";
import { Button, FormControl, InputGroup } from "react-bootstrap";
import { SearchResult } from "@/components/SearchComps";
import { FaSearch } from "react-icons/fa";
import { Helmet } from "react-helmet-async";

export const Search: React.FC = () => {
  const [searchParams] = useSearchParams();
  const searchKeyWord = searchParams.get("keyword");
  const [finalSearchKeyword, setFinalSeachKeyword] = useState(
    searchKeyWord ?? ""
  );

  const [fieldError, setFieldError] = useState({
    hasError: false,
    errorMessage: "",
  });

  const inputRef = useRef<HTMLInputElement>(null);

  const inputFieldOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length < 4) {
      setFieldError({
        hasError: true,
        errorMessage: "Enter atleast 3 character",
      });
    } else {
      setFieldError({
        hasError: false,
        errorMessage: "",
      });
    }
  };

  const searchButtonClick = () => {
    if (inputRef.current && inputRef.current.value.length > 3) {
      setFinalSeachKeyword(inputRef.current.value);
    } else {
      setFieldError({
        hasError: true,
        errorMessage: "Enter atleast 3 character",
      });
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      searchButtonClick();
    }
  };

  return (
    <>
      <Helmet>
        <title>BlogPost | Search for Post or people</title>
        <meta
          name="description"
          content="BlogPost is a small social media site where you can share your thoughts, experience and opinios to other"
        />
        <meta property="og:title" content="BlogPost | Post your mind" />
        <meta
          property="og:description"
          content="BlogPost is a small social media site where you can share your thoughts, experience and opinios to other"
        />
      </Helmet>
      <SearchPageStyle className="p-4">
        <InputGroup className="mb-3">
          <FormControl
            type="text"
            autoComplete="off"
            name="search by keyword"
            defaultValue={searchKeyWord ?? ""}
            aria-label="search users or posts"
            aria-describedby="search-button"
            placeholder="Search user or post by keyword"
            ref={inputRef}
            onChange={inputFieldOnChange}
            onKeyDown={handleKeyDown}
          />
          <Button
            id="search-button"
            variant="outline-light"
            onClick={searchButtonClick}
            disabled={fieldError.hasError}
            className="d-flex align-items-center"
          >
            <FaSearch fill="white" />
          </Button>
        </InputGroup>
        {fieldError.hasError && <small>{fieldError.errorMessage}</small>}
        {finalSearchKeyword && <SearchResult keyword={finalSearchKeyword} />}
      </SearchPageStyle>
    </>
  );
};
