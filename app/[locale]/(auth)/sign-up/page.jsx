"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { connectWallet } from "@/lib/contract";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const formSchema = z
  .object({
    email: z.string().email({ message: "Email không hợp lệ" }),
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

  const onSubmit = async (data) => {
    console.log(data);
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
      console.log(error);
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
          console.log("Account changed:", accounts[0]);
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
    <div className="w-[453px] bg-white rounded-lg shadow-md flex gap-4 flex-col items-center p-8">
      <div>
        <Image src="/logo.png" width={120} height={120} alt="" />
      </div>
      <div className="w-full flex flex-col items-center">
        <div className="text-xl font-semibold">Welcome</div>
        <p>Sign in to GoFundMe or sign up to continue.</p>
      </div>
      <div className="space-y-2 w-full">
        {!address && (
          <Button
            variant={"secondary"}
            className="w-full"
            onClick={handleConnectWallet}
          >
            <Image src="/metamask.png" width={20} height={20} />
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
          <Label htmlFor="password">Nhập lại mật khẩu</Label>
          <Input
            id="password"
            type="retypePassword"
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
        <Link className="underline text-primary" href="/sign-in">
          Đăng nhập ngay
        </Link>
      </div>
    </div>
  );
};

export default SignUpPage;
