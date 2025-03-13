import React from "react";
import { Navbar, Container, Nav } from "react-bootstrap";
import logo from "/src/assets/logo/BlogPost-transparent.png";
import { HeaderStyle } from "./styles";
import { HeaderSearch } from "@/components/SearchComps";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/slices/loginSlice";
import { AppState } from "@/store/store";
import {
  Avatar,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { processProfilePhotoPath } from "@/Utilities/utilities";
import { FaUser } from "react-icons/fa";
import { IoArrowForwardCircleOutline } from "react-icons/io5";
import { IoMdLogOut } from "react-icons/io";

export const Header: React.FC = () => {
  const { loggedIn, username } = useSelector((state: AppState) => state.login);
  const { photo } = useSelector((state: AppState) => state.user);
  const [drawerState, setDrawerState] = React.useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      setDrawerState(open);
    };

  const gotoProfile = (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === "keydown" &&
      (event as React.KeyboardEvent).key !== "Enter" &&
      (event as React.KeyboardEvent).key !== " "
    ) {
      return;
    }
    navigate("/profile");
    setDrawerState(false);
  };

  return (
    <HeaderStyle>
      <Navbar expand="lg" className="bg-body-tertiary py-2">
        <Container className="position-relative">
          <Navbar.Brand>
            <Link to="/">
              <img src={logo} alt="BlogPost logo" />
            </Link>
          </Navbar.Brand>
          <Nav className="w-100 d-flex flex-row align-items-center justify-content-between justify-content-lg-end">
            {loggedIn ? (
              <>
                <Nav.Item>
                  <HeaderSearch />
                </Nav.Item>
                <Nav.Item className="text-end">
                  <IconButton
                    aria-label="options"
                    onClick={toggleDrawer(true)}
                    sx={{
                      position: { xs: "absolute", md: "static" },
                      top: "10px",
                      right: "10px",
                    }}
                  >
                    <Avatar
                      alt={username}
                      src={processProfilePhotoPath(photo)}
                    />
                  </IconButton>
                  <Drawer
                    anchor="right"
                    open={drawerState}
                    onClose={toggleDrawer(false)}
                  >
                    <List sx={{ width: 250 }}>
                      <ListItem disablePadding divider>
                        <ListItemButton
                          onClick={toggleDrawer(false)}
                          sx={{ width: "20%", fontSize: "1.5em" }}
                        >
                          <ListItemIcon>
                            <IoArrowForwardCircleOutline color="black" />
                          </ListItemIcon>
                        </ListItemButton>
                      </ListItem>
                      <ListItem disablePadding divider>
                        <ListItemButton>
                          <ListItemAvatar>
                            <Avatar
                              alt={username}
                              src={processProfilePhotoPath(photo)}
                            />
                          </ListItemAvatar>
                          <ListItemText primary={`Hi, ${username}`} />
                        </ListItemButton>
                      </ListItem>
                      <ListItem disablePadding>
                        <ListItemButton onClick={gotoProfile}>
                          <ListItemIcon>
                            <FaUser />
                          </ListItemIcon>
                          <ListItemText>Profile</ListItemText>
                        </ListItemButton>
                      </ListItem>
                      <ListItem disablePadding>
                        <ListItemButton
                          onClick={() => {
                            dispatch(logout());
                          }}
                        >
                          <ListItemIcon>
                            <IoMdLogOut />
                          </ListItemIcon>
                          <ListItemText primary="Logout" />
                        </ListItemButton>
                      </ListItem>
                    </List>
                  </Drawer>
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
