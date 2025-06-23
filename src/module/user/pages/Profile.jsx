import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCharityHearts } from "@/hooks/useNFTContract";
import useUserStore from "@/hooks/useUserStore";
import { updateUser } from "@/services/userService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { toast } from "sonner";
import { useImageUpload } from "../hooks/useImageUpload";
import { useNFTs } from "../hooks/useNFTs";
import NFTGallery from "../components/Profile/NFTGallery";
import ProfileHeader from "../components/Profile/ProfileHeader";
import ProfileInfo from "../components/Profile/ProfileInfo";

const Profile = () => {
  const { user, setUser } = useUserStore();
  const queryClient = useQueryClient();
  const { getUserNFTs } = useCharityHearts();

  // Consolidated update user mutation
  const { mutate: updateUserMutation } = useMutation({
    mutationFn: (data) => updateUser(user.id, data),
    onSuccess: (data) => {
      setUser(data);
      queryClient.invalidateQueries(["user"]);
      toast.success("Cập nhật thành công!");
    },
    onError: () => {
      toast.error("Có lỗi xảy ra khi cập nhật!");
    },
  });

  // Custom hooks
  const { loading, handleCoverUpload, handleAvatarUpload } =
    useImageUpload(updateUserMutation);
  const { nfts, loading: nftsLoading, error: nftsError } = useNFTs(getUserNFTs);

  return (
    <>
      <Helmet>
        <title>
          {user?.name ? `${user.name} | Chain4Good` : "Hồ sơ | Chain4Good"}
        </title>
        <meta
          name="description"
          content={
            user?.bio ||
            "Xem thông tin cá nhân, chiến dịch và lịch sử đóng góp của người dùng trên Chain4Good."
          }
        />
        <meta
          property="og:title"
          content={
            user?.name ? `${user.name} | Chain4Good` : "Hồ sơ | Chain4Good"
          }
        />
        <meta
          property="og:description"
          content={
            user?.bio ||
            "Xem thông tin cá nhân, chiến dịch và lịch sử đóng góp của người dùng trên Chain4Good."
          }
        />
        <meta property="og:image" content={user?.image || ""} />
        <meta property="og:type" content="profile" />
      </Helmet>

      <div className="min-h-screen pb-10">
        <ProfileHeader
          user={user}
          loading={loading}
          onCoverUpload={handleCoverUpload}
        />

        <div className="container px-4 my-6">
          <Card className="pt-8">
            <CardHeader>
              <ProfileInfo
                user={user}
                onUpdateProfile={updateUserMutation}
                isUpdatingProfile={false}
                loading={loading}
                onAvatarUpload={handleAvatarUpload}
              />
            </CardHeader>

            <CardContent>
              <Tabs
                defaultValue="nfts"
                size="md"
                className="w-full bg-gradient-to-r from-indigo-50 via-white to-indigo-50 rounded-lg shadow-lg p-6"
              >
                <TabsList className="bg-white rounded-lg shadow-inner p-1 mb-4">
                  <TabsTrigger
                    value="nfts"
                    className="hover:bg-indigo-100 rounded-md transition-colors duration-200"
                  >
                    NFTs
                  </TabsTrigger>
                  <TabsTrigger
                    value="about"
                    className="hover:bg-indigo-100 rounded-md transition-colors duration-200"
                  >
                    Thông tin
                  </TabsTrigger>
                  <TabsTrigger
                    value="campaigns"
                    className="hover:bg-indigo-100 rounded-md transition-colors duration-200"
                  >
                    Chiến dịch
                  </TabsTrigger>
                  <TabsTrigger
                    value="donations"
                    className="hover:bg-indigo-100 rounded-md transition-colors duration-200"
                  >
                    Đóng góp
                  </TabsTrigger>
                </TabsList>

                <TabsContent
                  value="about"
                  className="bg-white rounded-lg p-6 shadow-md transition-all duration-300 ease-in-out"
                >
                  <ProfileInfo
                    user={user}
                    onUpdateProfile={updateUserMutation}
                    isUpdatingProfile={false}
                    loading={loading}
                    onAvatarUpload={handleAvatarUpload}
                    showAvatar={false}
                  />
                </TabsContent>

                <TabsContent
                  value="campaigns"
                  className="bg-white rounded-lg p-6 shadow-md transition-all duration-300 ease-in-out"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="text-center text-muted-foreground py-10">
                      Chưa có chiến dịch nào
                    </div>
                  </div>
                </TabsContent>

                <TabsContent
                  value="donations"
                  className="bg-white rounded-lg p-6 shadow-md transition-all duration-300 ease-in-out"
                >
                  <div className="space-y-4">
                    <div className="text-center text-muted-foreground py-10">
                      Chưa có đóng góp nào
                    </div>
                  </div>
                </TabsContent>

                <TabsContent
                  value="nfts"
                  className="bg-white rounded-lg p-6 shadow-md transition-all duration-300 ease-in-out"
                >
                  {nftsError ? (
                    <div className="text-center py-10 text-red-500">
                      {nftsError}
                    </div>
                  ) : nftsLoading ? (
                    <div className="text-center py-10">
                      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                      Đang tải NFTs...
                    </div>
                  ) : (
                    <NFTGallery nfts={nfts} />
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Profile;
