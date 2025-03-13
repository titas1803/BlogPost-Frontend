import { useProfileContext } from "@/hooks/profileCtxHook";
import { AppState } from "@/store/store";
import { Box, Button, IconButton, TextField, Tooltip } from "@mui/material";
import axios from "axios";
import React, { ChangeEvent, useState } from "react";
import { Modal } from "react-bootstrap";
import toast from "react-hot-toast";
import { CiEdit } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";
import { useSelector } from "react-redux";

export const UpdateProfileBio: React.FC = () => {
  const { userDetails, setUserDetails } = useProfileContext();
  const [show, setShow] = useState(false);
  const [bioValue, setBioValue] = useState(userDetails?.bio ?? "");
  const { "auth-token": authToken } = useSelector(
    (state: AppState) => state.login
  );

  const inputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setBioValue(e.target.value);
  };

  const handleClose = () => {
    setBioValue(userDetails?.bio ?? "");
    setShow(false);
  };

  const updateBio = async () => {
    const UPDATEBIOURL =
      import.meta.env.BLOGPOST_FRONTEND_API_URL + "/user/update/update-bio";
    try {
      const response = await axios.patch(
        UPDATEBIOURL,
        {
          bio: bioValue.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.status === 200) {
        setUserDetails((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            ...response.data.user,
          };
        });
        setShow(false);
      }
    } catch {
      toast.error("Error occured. Please try again");
    }
  };

  return (
    <>
      <Tooltip title="Update bio">
        <IconButton
          aria-label="update bio"
          className="edit-bio"
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.5)",
            padding: "4px",
            margin: "3px 5px",
          }}
          onClick={() => setShow(true)}
        >
          <CiEdit />
        </IconButton>
      </Tooltip>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton className="py-2">
          <Modal.Title>Update your bio</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Box sx={{ display: "flex", gap: "5px" }}>
            <TextField
              id="bio-field"
              label="Bio"
              variant="standard"
              sx={{ width: "100%" }}
              value={bioValue}
              autoCapitalize="sentences"
              onChange={inputChange}
              autoComplete="off"
              slotProps={{ htmlInput: { maxLength: 70 } }}
            />
            {bioValue.length > 0 && (
              <IconButton
                color="secondary"
                aria-label="Remove"
                onClick={() => {
                  setBioValue("");
                }}
              >
                <IoMdClose />
              </IconButton>
            )}
          </Box>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outlined" onClick={handleClose} className="me-2">
            Close
          </Button>
          <Button
            variant="outlined"
            onClick={updateBio}
            disabled={bioValue === (userDetails?.bio ?? "")}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
