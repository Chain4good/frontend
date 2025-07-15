import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import {
  Check,
  CalendarDays,
  Mail,
  MapPin,
  Phone,
  Camera,
  Loader2,
} from "lucide-react";
import { memo } from "react";
import { formatDate } from "@/lib/utils";
import EditProfileForm from "../EditProfileForm";

const ProfileInfo = memo(
  ({
    user,
    onUpdateProfile,
    isUpdatingProfile,
    loading,
    onAvatarUpload,
    showAvatar = true,
  }) => {
    const renderField = (icon, label, value) => {
      if (!value) return null;
      return (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors"
        >
          <div className="p-2 rounded-full bg-muted">{icon}</div>
          <div>
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="font-medium">{value}</p>
          </div>
        </motion.div>
      );
    };

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-8"
      >
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-start gap-6"
          >
            {showAvatar && (
              <div className="relative">
                <Input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={onAvatarUpload}
                  disabled={loading?.avatar}
                />
                <Label htmlFor="avatar-upload" className="cursor-pointer">
                  <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-background ring-2 ring-primary/10 group">
                    <AvatarImage src={user?.image} />
                    <AvatarFallback className="text-3xl md:text-4xl bg-gradient-to-br from-primary/20 to-primary/10">
                      {user?.name?.charAt(0)}
                    </AvatarFallback>
                    <motion.div
                      whileHover={{ opacity: 1 }}
                      className="absolute inset-0 bg-black/60 rounded-full opacity-0 transition-opacity flex items-center justify-center"
                    >
                      {loading?.avatar ? (
                        <Loader2 className="h-8 w-8 text-white animate-spin" />
                      ) : (
                        <Camera className="h-8 w-8 text-white" />
                      )}
                    </motion.div>
                  </Avatar>
                </Label>
              </div>
            )}
            <div className="space-y-4">
              <div className="space-y-2">
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                  {user?.name}
                </h2>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="px-3 py-1">
                    {user?.roleId === 2 ? "User" : "Admin"}
                  </Badge>
                  {user?.isVerified && (
                    <Badge variant="secondary" className="gap-1.5 px-3 py-1">
                      <Check className="h-3.5 w-3.5" />
                      Email đã xác minh
                    </Badge>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Huy hiệu đạt được
                </h3>
                <div className="flex flex-wrap gap-3">
                  {user?.UserBadge?.map((userBadge) => {
                    // Determine badge variant based on badge type or name
                    const getBadgeVariant = (badge) => {
                      const name = badge.name.toLowerCase();
                      if (name.includes("premium")) return "premium";
                      if (name.includes("achievement")) return "achievement";
                      if (name.includes("special")) return "special";
                      if (name.includes("diamond")) return "diamond";
                      if (name.includes("royal")) return "royal";
                      return "special"; // default to special variant
                    };

                    return (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                        whileHover={{ scale: 1.05 }}
                        className="cursor-pointer"
                      >
                        <Badge
                          key={userBadge.id}
                          variant={getBadgeVariant(userBadge.badge)}
                          size="badge"
                          className="group hover:shadow-2xl transition-all duration-300 ease-in-out border-2 border-white/20 backdrop-blur-sm"
                        >
                          <img
                            src={userBadge.badge.iconUrl}
                            alt={userBadge.badge.name}
                            className="h-6 w-6 mr-3 group-hover:scale-110 transition-transform duration-200 drop-shadow-sm"
                          />
                          <div className="flex flex-col items-start">
                            <span className="font-semibold text-sm leading-tight">
                              {userBadge.badge.name}
                            </span>
                            <span
                              className="text-xs opacity-80 leading-tight"
                              title={`Được trao ngày ${new Date(
                                userBadge.awardedAt
                              ).toLocaleDateString("vi-VN")}`}
                            >
                              {new Date(userBadge.awardedAt).toLocaleDateString(
                                "vi-VN"
                              )}
                            </span>
                          </div>
                        </Badge>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>

          <EditProfileForm
            user={user}
            onSubmit={onUpdateProfile}
            isLoading={isUpdatingProfile}
          />
        </div>

        {user?.bio && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3 p-4 rounded-xl bg-muted/50"
          >
            <h3 className="font-semibold">Bio</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {user.bio}
            </p>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid gap-4 md:grid-cols-2"
        >
          {renderField(<Mail className="h-4 w-4" />, "Email", user?.email)}
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
        </motion.div>
      </motion.div>
    );
  }
);

ProfileInfo.displayName = "ProfileInfo";

export default ProfileInfo;
