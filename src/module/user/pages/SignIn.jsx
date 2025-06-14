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
import { Loader2 } from "lucide-react";
import useUserStore from "@/hooks/useUserStore";

const formSchema = z.object({
  email: z.string().email({ message: "Email không hợp lệ" }),
  password: z.string().min(6, { message: "Mật khẩu ít nhất 6 ký tự" }),
});

const SignInPage = () => {
  const navigate = useNavigate();
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
        {/* <div className="space-y-2">
          <Button variant={"outline"} className="w-full">
            <GoogleIconSvg
              style={{
                fontSize: "20px",
                width: "22px",
                height: "22px",
              }}
            />
            Đăng nhập với Google
          </Button>
          <Button variant={"outline"} className="w-full">
            <FacebookSvg
              style={{
                fontSize: "20px",
                width: "22px",
                height: "22px",
              }}
            />
            Đăng nhập với Facebook
          </Button>
        </div> */}
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
