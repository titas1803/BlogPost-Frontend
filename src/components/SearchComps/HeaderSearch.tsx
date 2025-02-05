import React, { useRef } from "react";
import { InputGroup, Form, Button } from "react-bootstrap";
import { IoSearch } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

export const HeaderSearch: React.FC = () => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const headerSearchClick = () => {
    const value = inputRef.current?.value;
    console.log("value;: ", value);
    if (value && value.length) {
      console.log("in if");
      navigate(`/search?keyword=${encodeURIComponent(value)}`);
    } else {
      console.log("in else");
    }
  };
  return (
    <div>
      <div>
        <InputGroup className="searchbox">
          <Form.Control
            type="text"
            placeholder="Search for persons or post"
            aria-label="Search"
            aria-describedby="search-label"
            ref={inputRef}
          />
          <Button
            id="search-label"
            variant="outline-light"
            onClick={headerSearchClick}
            className="d-flex"
          >
            <IoSearch />
          </Button>
        </InputGroup>
      </div>
    </div>
  );
};
