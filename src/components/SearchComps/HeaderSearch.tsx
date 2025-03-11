import React, { useRef } from "react";
import { InputGroup, Form, Button } from "react-bootstrap";
import { IoSearch } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { HeaderSearchStyle } from "./styles";

export const HeaderSearch: React.FC = () => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const headerSearchClick = () => {
    const value = inputRef.current?.value;
    if (value && value.length) {
      navigate(`/search?keyword=${encodeURIComponent(value)}`);
    }
  };
  return (
    <HeaderSearchStyle className="me-0 me-lg-3 mb-0">
      <InputGroup className="searchbox">
        <Form.Control
          type="search"
          placeholder="Search for persons or post"
          aria-label="Search"
          aria-describedby="search-label"
          ref={inputRef}
        />
        <Button
          id="search-label"
          variant="outline-light"
          onClick={headerSearchClick}
          className="d-flex align-items-center"
        >
          <IoSearch fill="black" />
        </Button>
      </InputGroup>
    </HeaderSearchStyle>
  );
};
