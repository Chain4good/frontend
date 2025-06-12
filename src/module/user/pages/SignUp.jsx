import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import useUserStore from "@/hooks/useUserStore";
import { connectWallet } from "@/lib/contract";
import { signup } from "@/services/authService";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import * as z from "zod";

const formSchema = z
  .object({
    email: z.string().email({ message: "Email không hợp lệ" }),
    name: z.string({ message: "Vui lòng nhập tên" }),
    password: z.string().min(6, { message: "Mật khẩu ít nhất 6 ký tự" }),
    retypePassword: z
      .string()
      .min(6, { message: "Vui lòng nhập lại mật khẩu" }),
    address: z.string({ message: "Vui lòng kết nối với Metamask" }),
  })
  .refine((data) => data.password === data.retypePassword, {
    message: "Mật khẩu không khớp",
    path: ["retypePassword"],
  });

const SignUpPage = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    getValues,
    watch,
  } = useForm({
    resolver: zodResolver(formSchema),
  });

  const mutation = useMutation({
    mutationFn: (data) => signup(data),
    onSuccess: ({ data }) => {
      // useUserStore.getState().setUserData(data.data);
      toast.success("Đăng ký thành công! Vui lòng xác thực email.");
      navigate("/verify-email");
    },
    onError: (error) => {
      toast.error(error.message || "Có lỗi xảy ra!");
    },
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  const handleConnectWallet = async () => {
    try {
      const result = await connectWallet();
      if (!result) {
        throw new Error("Wallet connection failed!");
      }
      const { address, provider, signer } = result;
      setValue("address", address);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const address = watch("address");

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      const handleAccountsChanged = (accounts) => {
        if (accounts.length === 0) {
          setValue("address", null);
        } else {
          setValue("address", accounts[0]);
        }
      };
      window.ethereum.on("accountsChanged", handleAccountsChanged);
      return () => {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
      };
    }
  }, [setValue]);

  return (
    <div
      className="w-screen h-screen flex items-center justify-center bg-cover"
      style={{ backgroundImage: "url(/desktop.jpg)" }}
    >
      <div className="w-[480px] bg-white rounded-3xl shadow-md flex gap-4 flex-col items-center p-8">
        <div>
          <img
            src="/logo.png"
            width={120}
            height={120}
            alt=""
            className="w-[120px]"
          />
        </div>
        <div className="w-full flex flex-col items-center">
          <div className="text-xl font-semibold">Chào mừng</div>
          <p>Đăng nhập vào ChainGood hoặc đăng ký để tiếp tục.</p>
        </div>
        <div className="space-y-2 w-full">
          {!address && (
            <Button
              variant={"secondary"}
              className="w-full"
              onClick={handleConnectWallet}
            >
              <img
                src="/metamask.png"
                width={20}
                height={20}
                className="w-[20px]"
              />
              Kết nối với ví Metamask
            </Button>
          )}
          {address && (
            <Button variant={"secondary"} className="w-full">
              {address}
            </Button>
          )}
          {errors.address && (
            <p className="text-sm text-red-500">{errors.address.message}</p>
          )}
        </div>
        <Separator />
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-2 w-full max-w-sm"
        >
          <div className="space-y-2">
            <Label htmlFor="name">Tên</Label>
            <Input
              id="name"
              type="name"
              placeholder="Nguyen Van A"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>
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
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="retypePassword">Nhập lại mật khẩu</Label>
            <Input
              id="retypePassword"
              type="password"
              placeholder="••••••••"
              {...register("retypePassword")}
            />
            {errors.retypePassword && (
              <p className="text-sm text-red-500">
                {errors.retypePassword.message}
              </p>
            )}
          </div>
          <div className="mt-2">
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Đang đăng ký..." : "Đăng ký"}
            </Button>
          </div>
        </form>
        <div className="text-md text-muted-foreground">
          <span>Bạn đã có tài khoản? </span>
          <Link className="underline text-primary" to="/sign-in">
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
