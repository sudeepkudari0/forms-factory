"use client"
import { getCurrentUserDetails } from "@/actions/users";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileForm } from "@/components/user-account-profile";
import { SecurityForm } from "@/components/user-account-security";
import { useQuery } from "@tanstack/react-query";

const ProfilePage = () => {

    const { data: userData } = useQuery({
        queryKey: ["userData"],
        queryFn: async () => {
          return await getCurrentUserDetails()
        }
    })
  return (
    <div className="flex w-full items-center justify-center">
      <Tabs defaultValue="profile" className="w-full md:w-1/2">
            <div className="flex flex-row space-y-4 w-full">
              <TabsList className="w-full">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
              </TabsList>
            </div>
            <div className="">
              <TabsContent value="profile">
                {
                  userData &&
                  <ProfileForm user={userData} />
                }
              </TabsContent>
              <TabsContent value="security">
                {
                  userData &&
                  <SecurityForm user={userData} />
                  }
              </TabsContent>
            </div>
          </Tabs>
    </div>
  )
}

export default ProfilePage;