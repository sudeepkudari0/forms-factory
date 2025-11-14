"use client";
import { getCurrentUserDetails } from "@/actions/users";
import { ProfileForm } from "@/components/user-account-profile";
import { useQuery } from "@tanstack/react-query";

const ProfilePage = () => {
  const { data: userData } = useQuery({
    queryKey: ["userData"],
    queryFn: async () => {
      return await getCurrentUserDetails();
    },
  });
  return (
    <div className="flex w-full items-center justify-center">
      <div className="w-full md:w-1/2">
        {userData && <ProfileForm user={userData} />}
      </div>
    </div>
  );
};

export default ProfilePage;
