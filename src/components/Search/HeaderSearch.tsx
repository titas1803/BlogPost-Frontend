import React from "react";
import { InputGroup, Form } from "react-bootstrap";
import { IoSearch } from "react-icons/io5";

export const HeaderSearch: React.FC = () => {
  return (
    <div>
      <div>
        <InputGroup className="searchbox">
          <Form.Control
            placeholder="Search for persons or post"
            aria-label="Search"
            aria-describedby="search-label"
          />
          <InputGroup.Text id="search-label">
            <IoSearch />
          </InputGroup.Text>
        </InputGroup>
      </div>
    </div>
  );
};
