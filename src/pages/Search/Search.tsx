import React, {
  ChangeEvent,
  KeyboardEvent,
  Suspense,
  useRef,
  useState,
} from "react";
import { useSearchParams } from "react-router-dom";
import { SearchPageStyle } from "./styles";
import { Button, FormControl, InputGroup } from "react-bootstrap";
import { SearchResult } from "@/components/SearchComps";
import { LoadingModal } from "@/components/LoadingModal";
import { FaSearch } from "react-icons/fa";

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
          className="d-flex align-itms-center"
        >
          <FaSearch fill="white" />
        </Button>
      </InputGroup>
      {fieldError.hasError && <small>{fieldError.errorMessage}</small>}
      {finalSearchKeyword && (
        <Suspense fallback={<LoadingModal show message="Searching..." />}>
          <SearchResult keyword={finalSearchKeyword} />
        </Suspense>
      )}
    </SearchPageStyle>
  );
};
