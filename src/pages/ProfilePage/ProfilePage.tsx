import React from "react";
import Profile from "@/components/ProfilePageComps";
import { ProfileProvider } from "@/components/ProfilePageComps/context/ProfileProvider";

type Props = {
  hasId?: boolean;
};

export const ProfilePage: React.FC<Props> = ({ hasId = false }) => {
  return (
    <ProfileProvider hasId={hasId}>
      <Profile />
    </ProfileProvider>
  );
};
