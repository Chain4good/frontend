import React from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Separator } from "@/components/ui/separator";
import FacebookSvg from "@/components/Icons/FacebookSvg";
import GoogleIconSvg from "@/components/Icons/GoogleIconSvg";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { signin } from "@/services/authService";
import { toast } from "sonner";
import { Loader2, Wallet } from "lucide-react";
import useUserStore from "@/hooks/useUserStore";
import { useWallet } from "@/hooks/useWallet";

const formSchema = z.object({
  email: z.string().email({ message: "Email không hợp lệ" }),
  password: z.string().min(6, { message: "Mật khẩu ít nhất 6 ký tự" }),
});

const SignInPage = () => {
  const navigate = useNavigate();
  const { handleWeb3Login, isConnected } = useWallet();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(formSchema),
  });

  const mutation = useMutation({
    mutationFn: (data) => signin(data),
    onSuccess: ({ data }) => {
      toast.success("Đăng nhập thành công!");
      navigate("/");
    },
    onError: (error) => {
      console.log(error);
      toast.error(error.message?.message || "Đăng nhập không thành cóng!");
    },
  });

  const onSubmit = async (data) => {
    mutation.mutate(data);
  };

  const handleLoginWithGoogle = () => {
    window.location.href = "http://localhost:3000/auth/google";
  };

  const handleLoginWithFacebook = () => {
    window.location.href = "http://localhost:3000/auth/facebook";
  };

  return (
    <div
      className="flex w-screen h-screen items-center justify-center"
      style={{ backgroundImage: "url(/desktop.jpg)" }}
    >
      <div className="w-[480px] bg-white rounded-3xl shadow-md flex gap-4 flex-col items-center p-8">
        <div>
          <img src="/logo.png" alt="" className="w-[120px]" />
        </div>
        <div className="w-full flex flex-col items-center">
          <div className="text-xl font-semibold">Welcome</div>
          <p>Đăng nhập vào Chain4Good hoặc đăng ký để tiếp tục.</p>
        </div>
        <div className="w-full space-y-3">
          <Button
            variant="outline"
            size="lg"
            className="w-full h-11 font-medium bg-gradient-to-r from-primary/10 to-primary/5 hover:from-primary/20 hover:to-primary/10 border-primary/20 hover:border-primary/30 transition-all duration-300"
            onClick={() => handleWeb3Login()}
          >
            <div className="flex items-center justify-center gap-3">
              <Wallet className="h-5 w-5 text-primary" strokeWidth={2} />
              <span className="text-sm">
                {isConnected ? "Đăng nhập bằng ví" : "Kết nối với ví"}
              </span>
            </div>
          </Button>

          {/* Social Logins */}
          <div className="space-y-2">
            <Button
              variant="outline"
              size="lg"
              className="w-full h-11 flex items-center justify-center gap-3"
              onClick={handleLoginWithGoogle}
            >
              <GoogleIconSvg className="h-5 w-5" />
              <span>Đăng nhập với Google</span>
            </Button>

            {/* <Button
              variant="outline"
              size="lg"
              className="w-full h-11 flex items-center justify-center gap-3"
              onClick={handleLoginWithFacebook}
            >
              <FacebookSvg className="h-5 w-5" />
              <span>Đăng nhập với Facebook</span>
            </Button> */}
          </div>
        </div>
        <Separator />
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-2 w-full max-w-sm"
        >
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Mật khẩu</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register("password")}
            />
            <Link
              className="text-xs text-muted-foreground"
              to={"/forgot-password"}
            >
              Quên mật khâu?
            </Link>
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>
          <div className="mt-2">
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Đang đăng nhập...
                </div>
              ) : (
                "Đăng nhập"
              )}
            </Button>
          </div>
        </form>
        <div className="text-md text-muted-foreground">
          <span>Bạn chưa có tài khoản? </span>
          <Link className="underline text-primary" to="/sign-up">
            Đăng ký ngay
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
