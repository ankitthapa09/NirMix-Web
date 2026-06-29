import type { Metadata } from "next";
import { ProfilePage } from "@/features/dashboard/ProfilePage";

export const metadata: Metadata = {
  title: "My Profile",
  description: "View and edit your NirMix profile, professional details and verification.",
};

export default function ProfileRoute() {
  return <ProfilePage />;
}
