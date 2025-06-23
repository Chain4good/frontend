import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, Loader2 } from "lucide-react";
import { memo } from "react";

const ProfileHeader = memo(({ user, loading, onCoverUpload }) => {
  return (
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
        onChange={onCoverUpload}
        disabled={loading.cover}
      />

      <Label htmlFor="cover-upload" className="absolute inset-0 cursor-pointer">
        {loading.cover && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
          </div>
        )}
      </Label>

      <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <Camera className="h-6 w-6 text-white" />
      </div>
    </div>
  );
});

ProfileHeader.displayName = "ProfileHeader";

export default ProfileHeader;
