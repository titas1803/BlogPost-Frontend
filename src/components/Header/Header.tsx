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
import { HeaderSearch } from "@/components/SearchComps";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { IoMdLogOut } from "react-icons/io";
import { logout } from "@/slices/loginSlice";
import { AppState } from "@/store/store";

export const Header: React.FC = () => {
  const { loggedIn, username } = useSelector((state: AppState) => state.login);

  const dispatch = useDispatch();

  return (
    <HeaderStyle>
      <Navbar expand="lg" className="bg-body-tertiary py-2">
        <Container>
          <Navbar.Brand>
            <Link to="/">
              <img src={logo} alt="BlogPost logo" />
            </Link>
          </Navbar.Brand>
          <Nav className="w-100 justify-content-end">
            {loggedIn ? (
              <>
                <Nav.Item>
                  <HeaderSearch />
                </Nav.Item>
                <Nav.Item className="text-end">
                  <Dropdown as={ButtonGroup} className="d-block">
                    <Button variant="success">Hi, {username}</Button>

                    <Dropdown.Toggle
                      split
                      variant="success"
                      id="dropdown-split-basic"
                    />

                    <Dropdown.Menu>
                      <Dropdown.Item as="li">
                        <Link to="/profile">Profile</Link>
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
                </Nav.Item>
              </>
            ) : (
              <div className="d-flex justify-content-end w-100">
                <Nav.Item as="li" className="mx-3">
                  <Link to="/login" className="btn login-btn px-3 py-2">
                    Login
                  </Link>
                </Nav.Item>
                <Nav.Item as="li">
                  <Link to="/signup" className="btn create-btn px-3 py-2">
                    Create account
                  </Link>
                </Nav.Item>
              </div>
            )}
          </Nav>
        </Container>
      </Navbar>
    </HeaderStyle>
  );
};
