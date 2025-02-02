import React from "react";
import {
  Navbar,
  Container,
  Nav,
  Button,
  ButtonGroup,
  Dropdown,
} from "react-bootstrap";
import logo from "/src/assets/logo/BlogPost-transparent.png";
import { HeaderStyle } from "./styles";
import { HeaderSearch } from "@components/Search";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ILoginState } from "@/Utilities/Types";
import { IoMdLogOut } from "react-icons/io";
import { logout } from "@/slices/loginSlice";

export const Header: React.FC = () => {
  const { loggedIn, username, userid } = useSelector(
    (state: { login: ILoginState }) => state.login
  );

  const dispatch = useDispatch();

  return (
    <HeaderStyle>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container>
          <Navbar.Brand>
            <Link to="/">
              <img src={logo} alt="BlogPost logo" />
            </Link>
          </Navbar.Brand>
          <Nav>
            {loggedIn ? (
              <>
                <Nav.Item>
                  <HeaderSearch />
                </Nav.Item>
                <Dropdown as={ButtonGroup}>
                  <Button variant="success">Hi, {username}</Button>

                  <Dropdown.Toggle
                    split
                    variant="success"
                    id="dropdown-split-basic"
                  />

                  <Dropdown.Menu>
                    <Dropdown.Item as="li">
                      <Link to={`/profile/${userid}`}>Profile</Link>
                    </Dropdown.Item>
                    <Dropdown.Item
                      as="button"
                      onClick={() => {
                        dispatch(logout());
                      }}
                    >
                      Logout <IoMdLogOut />
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </>
            ) : (
              <>
                <Nav.Item as="button" className="mx-3">
                  <Link to="/login">Login</Link>
                </Nav.Item>
                <Nav.Item as="button">
                  <Link to="/signup">Create account</Link>
                </Nav.Item>
              </>
            )}
          </Nav>
        </Container>
      </Navbar>
    </HeaderStyle>
  );
};
