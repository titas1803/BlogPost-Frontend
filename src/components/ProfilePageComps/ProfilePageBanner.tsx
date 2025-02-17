import React, { useEffect, useMemo } from "react";
import BannerImage from "@/assets/profile-banner-image.jpeg";
import { ProfilePageBannerStyle } from "./style";
import { IconButton, Tooltip } from "@mui/material";
import { CiEdit, CiImageOn } from "react-icons/ci";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "@/store/store";
import { logout } from "@/slices/loginSlice";
import { useProfileContext } from "@/hooks/profileCtxHook";

type Props = {
  bannerImage?: string;
};
export const ProfilePageBanner: React.FC<Props> = ({
  bannerImage = BannerImage,
}) => {
  const { userid } = useProfileContext();
  const { userid: loggedIsUseId, "auth-token": authToken } = useSelector(
    (state: AppState) => state.login
  );

  const isSameUser = useMemo(() => {
    return userid === loggedIsUseId;
  }, [loggedIsUseId, userid]);

  const disatch = useDispatch();

  useEffect(() => {
    if (!loggedIsUseId || !authToken) disatch(logout());
  }, [loggedIsUseId, authToken, disatch]);

  return (
    <ProfilePageBannerStyle className="position-relative">
      <img src={bannerImage} alt="cover image" />
      {isSameUser && (
        <div className="btn-section position-absolute">
          <Tooltip title="Update bio">
            <IconButton
              aria-label="update bio"
              className="edit-bio"
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.5)",
                padding: "4px",
                margin: "3px 5px",
              }}
            >
              <CiEdit />
            </IconButton>
          </Tooltip>
          <Tooltip title="update cover photo">
            <IconButton
              aria-label="Update cover photo"
              className="edit-cover"
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.5)",
                padding: "4px",
                margin: "3px 5px",
              }}
            >
              <CiImageOn />
            </IconButton>
          </Tooltip>
        </div>
      )}
    </ProfilePageBannerStyle>
  );
};
