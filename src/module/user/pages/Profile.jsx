import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { uploadFile } from "@/services/uploadService";
import { updateUser } from "@/services/userService";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, Mail, Phone, MapPin, Edit, Camera } from "lucide-react";
import useUserStore from "@/hooks/useUserStore";
import { formatDate } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import EditProfileForm from "../components/EditProfileForm";

const Profile = () => {
  const { user, setUser } = useUserStore();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState({
    cover: false,
    avatar: false,
  });

  // Update user mutation
  const { mutate: updateUserMutation } = useMutation({
    mutationFn: (data) => updateUser(user.id, data),
    onSuccess: (data) => {
      setUser(data);
      queryClient.invalidateQueries(["user"]);
      toast.success("Cập nhật thành công!");
    },
    onError: (error) => {
      toast.error("Có lỗi xảy ra khi cập nhật!");
    },
  });

  // Add new mutation for updating profile
  const { mutate: updateProfile, isPending: isUpdatingProfile } = useMutation({
    mutationFn: (data) => updateUser(user.id, data),
    onSuccess: (data) => {
      setUser(data);
      queryClient.invalidateQueries(["user"]);
      toast.success("Cập nhật thông tin thành công!");
    },
    onError: (error) => {
      toast.error("Có lỗi xảy ra khi cập nhật thông tin!");
    },
  });

  const validateImage = (file) => {
    const validTypes = ["image/jpeg", "image/png", "image/gif"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      toast.error("Vui lòng tải lên file ảnh (JPG, PNG, GIF)");
      return false;
    }

    if (file.size > maxSize) {
      toast.error("Kích thước ảnh phải nhỏ hơn 5MB");
      return false;
    }

    return true;
  };

  // Handle cover image upload
  const handleCoverUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!validateImage(file)) return;

    try {
      setLoading((prev) => ({ ...prev, cover: true }));
      const { url } = await uploadFile(file);
      await updateUserMutation({ cover: url });
    } catch (error) {
      console.error("Error uploading cover:", error);
      toast.error("Có lỗi xảy ra khi tải ảnh lên!");
    } finally {
      setLoading((prev) => ({ ...prev, cover: false }));
    }
  };

  // Handle avatar upload using the same pattern
  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!validateImage(file)) return;

    try {
      setLoading((prev) => ({ ...prev, avatar: true }));
      const { url } = await uploadFile(file);
      await updateUserMutation({ image: url });
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast.error("Có lỗi xảy ra khi tải ảnh lên!");
    } finally {
      setLoading((prev) => ({ ...prev, avatar: false }));
    }
  };

  // Handle profile update
  const handleUpdateProfile = (data) => {
    updateProfile(data);
  };

  const renderField = (icon, label, value) => {
    if (!value) return null;
    return (
      <div className="flex items-center gap-2 text-sm">
        {icon}
        <div>
          <p className="text-muted-foreground">{label}</p>
          <p className="font-medium">{value}</p>
        </div>
      </div>
    );
  };

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
        <div
          className="relative h-[200px] md:h-[300px] group cursor-pointer"
          style={
            user?.cover
              ? {
                  backgroundImage: `url(${user.cover})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }
              : {
                  background:
                    "linear-gradient(to right, var(--primary-light), var(--primary-dark))",
                }
          }
        >
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity">
              Bấm để thay đổi ảnh bìa
            </p>
          </div>

          <Input
            type="file"
            id="cover-upload"
            className="hidden"
            accept="image/png,image/jpeg,image/gif"
            onChange={handleCoverUpload}
            disabled={loading.cover}
          />

          <Label
            htmlFor="cover-upload"
            className="absolute inset-0 cursor-pointer"
          >
            {loading.cover && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <Loader2 className="h-8 w-8 animate-spin text-white" />
              </div>
            )}
          </Label>

          {/* Optional: Camera icon indicator */}
          <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="h-6 w-6 text-white" />
          </div>
        </div>

        <div className="container px-4 -mt-20">
          <div className="relative">
            <Input
              type="file"
              id="avatar-upload"
              className="hidden"
              accept="image/*"
              onChange={handleAvatarUpload}
              disabled={loading.avatar}
            />
            <Label htmlFor="avatar-upload" className="cursor-pointer">
              <Avatar className="absolute -top-16 border-4 border-background h-32 w-32 group">
                <AvatarImage src={user?.image} />
                <AvatarFallback className="text-4xl">
                  {user?.name?.charAt(0)}
                </AvatarFallback>
                <div className="absolute inset-0 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  {loading.avatar ? (
                    <Loader2 className="h-6 w-6 text-white animate-spin" />
                  ) : (
                    <Camera className="h-6 w-6 text-white" />
                  )}
                </div>
              </Avatar>
            </Label>

            <Card className="pt-20">
              <CardHeader className="flex flex-row items-start justify-between">
                <div className="space-y-2">
                  <h2 className="text-2xl md:text-3xl font-bold">
                    {user?.name}
                  </h2>
                  <Badge variant="outline">
                    {user?.roleId === 2 ? "User" : "Admin"}
                  </Badge>
                </div>
                <EditProfileForm
                  user={user}
                  onSubmit={handleUpdateProfile}
                  isLoading={isUpdatingProfile}
                />
              </CardHeader>

              <CardContent>
                <Tabs defaultValue="about" className="w-full">
                  <TabsList>
                    <TabsTrigger value="about">Thông tin</TabsTrigger>
                    <TabsTrigger value="campaigns">Chiến dịch</TabsTrigger>
                    <TabsTrigger value="donations">Đóng góp</TabsTrigger>
                  </TabsList>

                  <TabsContent value="about" className="space-y-6">
                    {user?.bio && (
                      <div className="space-y-2">
                        <h3 className="font-semibold">Bio</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {user.bio}
                        </p>
                      </div>
                    )}

                    <div className="grid gap-4 md:grid-cols-2">
                      {renderField(
                        <Mail className="h-4 w-4" />,
                        "Email",
                        user?.email
                      )}
                      {renderField(
                        <Phone className="h-4 w-4" />,
                        "Phone",
                        user?.phoneNumber
                      )}
                      {renderField(
                        <MapPin className="h-4 w-4" />,
                        "Địa chỉ ví",
                        user?.address
                      )}
                      {renderField(
                        <CalendarDays className="h-4 w-4" />,
                        "Tham gia",
                        formatDate(user?.createdAt)
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="campaigns">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {/* Campaign cards will go here */}
                    </div>
                  </TabsContent>

                  <TabsContent value="donations">
                    <div className="space-y-4">
                      {/* Donation history will go here */}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
