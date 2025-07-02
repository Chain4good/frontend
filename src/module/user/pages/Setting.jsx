import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Bell,
  Globe,
  KeyRound,
  Lock,
  Mail,
  Moon,
  Shield,
  Sun,
  Trash2,
  User,
  Loader2,
  Laptop,
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import useUserStore from "@/hooks/useUserStore";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import { useTheme } from "@/components/theme-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const SettingCard = ({ icon: Icon, title, description, children }) => {
  return (
    <Card className="overflow-hidden border-border/50">
      <CardHeader className="space-y-1">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="w-5 h-5 text-primary" />}
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};

const Setting = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    weekly: true,
  });
  const navigate = useNavigate();
  const { user } = useUserStore();
  const { theme, setTheme } = useTheme();

  const handleDeleteAccount = async () => {
    try {
      setIsDeleting(true);
      // Call API to delete account here
      //   await deleteAccount(user.id);
      toast.success("Tài khoản đã được xóa thành công");
      navigate("/logout");
    } catch (error) {
      toast.error("Không thể xóa tài khoản: " + error.message);
    } finally {
      setIsDeleting(false);
      setIsDialogOpen(false);
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="container max-w-4xl py-6 md:py-10 px-4 md:px-6">
      <motion.div
        initial="hidden"
        animate="show"
        variants={container}
        className="space-y-8"
      >
        <motion.div variants={item}>
          <h1 className="text-4xl font-bold">Cài đặt tài khoản</h1>
          <p className="text-muted-foreground mt-2">
            Quản lý tài khoản và cài đặt hệ thống của bạn
          </p>
        </motion.div>

        <motion.div variants={item} className="grid gap-6">
          <SettingCard
            icon={User}
            title="Thông tin cá nhân"
            description="Cập nhật thông tin cá nhân của bạn"
          >
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Tên hiển thị</Label>
                <Input id="name" defaultValue={user?.name} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue={user?.email} />
              </div>
              <Button>Lưu thay đổi</Button>
            </div>
          </SettingCard>

          <SettingCard
            icon={Bell}
            title="Thông báo"
            description="Quản lý cách bạn nhận thông báo"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Thông báo email</Label>
                  <p className="text-sm text-muted-foreground">
                    Nhận thông báo qua email
                  </p>
                </div>
                <Switch
                  checked={notifications.email}
                  onCheckedChange={(checked) =>
                    setNotifications((prev) => ({ ...prev, email: checked }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Thông báo đẩy</Label>
                  <p className="text-sm text-muted-foreground">
                    Nhận thông báo trên trình duyệt
                  </p>
                </div>
                <Switch
                  checked={notifications.push}
                  onCheckedChange={(checked) =>
                    setNotifications((prev) => ({ ...prev, push: checked }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Tổng kết tuần</Label>
                  <p className="text-sm text-muted-foreground">
                    Nhận email tổng kết hoạt động hàng tuần
                  </p>
                </div>
                <Switch
                  checked={notifications.weekly}
                  onCheckedChange={(checked) =>
                    setNotifications((prev) => ({ ...prev, weekly: checked }))
                  }
                />
              </div>
            </div>
          </SettingCard>

          <SettingCard
            icon={Globe}
            title="Ngôn ngữ & Giao diện"
            description="Quản lý ngôn ngữ và giao diện hiển thị"
          >
            <div className="space-y-6">
              <div className="grid gap-2">
                <Label>Ngôn ngữ</Label>
                <Select defaultValue="vi">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vi">Tiếng Việt</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Chế độ giao diện</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between"
                    >
                      <div className="flex items-center gap-2">
                        {theme === "light" && <Sun className="h-4 w-4" />}
                        {theme === "dark" && <Moon className="h-4 w-4" />}
                        {theme === "system" && <Laptop className="h-4 w-4" />}
                        <span>
                          {theme === "light" && "Sáng"}
                          {theme === "dark" && "Tối"}
                          {theme === "system" && "Theo hệ thống"}
                        </span>
                      </div>
                      <span className="sr-only">Chọn chế độ giao diện</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[200px]">
                    <DropdownMenuItem
                      onClick={() => setTheme("light")}
                      className="flex items-center gap-2"
                    >
                      <Sun className="h-4 w-4" />
                      <span>Sáng</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setTheme("dark")}
                      className="flex items-center gap-2"
                    >
                      <Moon className="h-4 w-4" />
                      <span>Tối</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setTheme("system")}
                      className="flex items-center gap-2"
                    >
                      <Laptop className="h-4 w-4" />
                      <span>Theo hệ thống</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <p className="text-sm text-muted-foreground">
                  Chọn chế độ giao diện phù hợp với bạn
                </p>
              </div>
            </div>
          </SettingCard>

          <SettingCard
            icon={Shield}
            title="Bảo mật"
            description="Bảo vệ tài khoản của bạn"
          >
            <div className="space-y-4">
              <Button variant="outline" className="w-full justify-start gap-2">
                <KeyRound className="w-4 h-4" />
                Đổi mật khẩu
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <Lock className="w-4 h-4" />
                Xác thực hai yếu tố
              </Button>
            </div>
          </SettingCard>

          <Card className="border-destructive/50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Trash2 className="w-5 h-5 text-destructive" />
                <CardTitle className="text-lg text-destructive">
                  Vùng nguy hiểm
                </CardTitle>
              </div>
              <CardDescription>
                Các thao tác trong vùng này có thể gây ra những thay đổi không
                thể hoàn tác
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="destructive" className="gap-2">
                    <Trash2 className="w-4 h-4" />
                    Xóa tài khoản
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      Bạn có chắc chắn muốn xóa tài khoản?
                    </DialogTitle>
                    <DialogDescription>
                      Hành động này không thể hoàn tác. Điều này sẽ xóa vĩnh
                      viễn tài khoản và tất cả dữ liệu của bạn khỏi hệ thống.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button
                      variant="ghost"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Hủy
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleDeleteAccount}
                      disabled={isDeleting}
                    >
                      {isDeleting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Đang xóa...
                        </>
                      ) : (
                        "Xóa tài khoản"
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Setting;
