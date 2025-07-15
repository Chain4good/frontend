import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { verifyEmail, resendVerificationEmail } from "@/services/authService";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const VerifyEmail = () => {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const verifyMutation = useMutation({
    mutationFn: verifyEmail,
    onSuccess: () => {
      toast.success("Xác thực email thành công!");
      navigate("/sign-in");
    },
    onError: (error) => {
      toast.error(error.message || "Mã xác thực không đúng!");
    },
  });

  const resendMutation = useMutation({
    mutationFn: resendVerificationEmail,
    onSuccess: () => {
      toast.success("Đã gửi lại mã xác thực!");
    },
    onError: (error) => {
      toast.error(error.message || "Không thể gửi lại mã xác thực!");
    },
  });

  const handleVerify = (e) => {
    e.preventDefault();
    if (!otp) {
      toast.error("Vui lòng nhập mã xác thực!");
      return;
    }
    verifyMutation.mutate(otp);
  };

  const handleResend = () => {
    resendMutation.mutate();
  };

  return (
    <div
      className="w-screen h-screen flex items-center justify-center bg-cover"
      style={{ backgroundImage: "url(/desktop.jpg)" }}
    >
      <div className="w-[480px] bg-white rounded-3xl shadow-md flex gap-4 flex-col items-center p-8">
        <div>
          <img src="/logo.png" alt="Logo" className="w-[120px]" />
        </div>

        <div className="w-full flex flex-col items-center">
          <h1 className="text-xl font-semibold">Xác thực email</h1>
          <p className="text-center text-muted-foreground mt-2">
            Chúng tôi đã gửi mã xác thực đến email của bạn.
            <br />
            Vui lòng kiểm tra và nhập mã xác thực.
          </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-4 w-full max-w-sm">
          <div className="space-y-2">
            <Label htmlFor="otp">Mã xác thực</Label>
            <Input
              id="otp"
              type="text"
              placeholder="Nhập mã xác thực"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={verifyMutation.isPending}
          >
            {verifyMutation.isPending ? "Đang xác thực..." : "Xác thực"}
          </Button>
        </form>

        <div className="text-sm text-muted-foreground">
          Không nhận được mã?{" "}
          <Button
            variant="link"
            className="p-0 h-auto font-normal"
            onClick={handleResend}
            disabled={resendMutation.isPending}
          >
            Gửi lại mã xác thực
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
