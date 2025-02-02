import React from "react";
import BannerImage from "@/assets/profile-banner-image.jpeg";
import { ProfilePageBannerStyle } from "./style";

type Props = {
  bannerImage?: string;
};
export const ProfilePageBanner: React.FC<Props> = ({
  bannerImage = BannerImage,
}) => {
  return (
    <ProfilePageBannerStyle>
      <img src={bannerImage} alt="cover image" />
    </ProfilePageBannerStyle>
  );
};
