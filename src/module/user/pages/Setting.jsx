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
import { Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import useUserStore from "@/hooks/useUserStore";

const Setting = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  const { user } = useUserStore();

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

  return (
    <div className="container py-6 md:py-10 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-6">Cài đặt tài khoản</h1>

      <div className="grid gap-6">
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Vùng nguy hiểm</CardTitle>
            <CardDescription>
              Các thao tác trong vùng này có thể gây ra những thay đổi không thể
              hoàn tác
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
                    Hành động này không thể hoàn tác. Điều này sẽ xóa vĩnh viễn
                    tài khoản và tất cả dữ liệu của bạn khỏi hệ thống.
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
      </div>
    </div>
  );
};

export default Setting;
