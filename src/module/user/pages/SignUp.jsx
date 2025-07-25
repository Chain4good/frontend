import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { connectWallet } from "@/lib/contract";
import { signup } from "@/services/authService";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import * as z from "zod";
import {
  Loader2,
  Wallet,
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  ArrowRight,
  Shield,
  Sparkles,
  Star,
  Check,
  CheckCircle,
} from "lucide-react";
import { motion } from "framer-motion";

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
  const [showPassword, setShowPassword] = useState(false);
  const [showRetypePassword, setShowRetypePassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(formSchema),
  });

  const mutation = useMutation({
    mutationFn: (data) => signup(data),
    onSuccess: () => {
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
      const { address } = result;
      setValue("address", address);
      toast.success("Đã kết nối ví thành công!");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const address = watch("address");
  const password = watch("password");
  const retypePassword = watch("retypePassword");

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

  const container = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  const formatAddress = (addr) => {
    if (!addr) return "";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div
      className="relative flex w-screen h-screen items-center justify-center overflow-hidden"
      style={{ backgroundImage: "url(/desktop.jpg)" }}
    >
      {/* Background overlay with blur effect */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]" />

      {/* Floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: 0,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.1, 0.3, 0.1],
              rotate: [0, 360],
            }}
            transition={{
              duration: 15 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 2,
            }}
          >
            {i % 2 === 0 ? (
              <Sparkles className="w-4 h-4 text-white/30" />
            ) : (
              <Star className="w-3 h-3 text-primary/40" />
            )}
          </motion.div>
        ))}
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 w-[520px] mx-4 max-h-[90vh] overflow-y-auto"
      >
        {/* Glass morphism card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8 relative overflow-hidden">
          {/* Decorative gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 pointer-events-none" />

          {/* Top decorative blur */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-400/10 rounded-full blur-3xl" />

          <div className="relative z-10 flex gap-6 flex-col items-center">
            {/* Logo section with animation */}
            <motion.div variants={item} className="relative">
              <motion.div
                className="absolute inset-0 bg-primary/20 rounded-full blur-xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <img
                src="/logo.png"
                alt="Chain4Good"
                className="relative w-[120px] h-auto"
              />
            </motion.div>

            {/* Header text */}
            <motion.div
              variants={item}
              className="w-full flex flex-col items-center text-center"
            >
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-primary to-gray-800 bg-clip-text text-transparent mb-2">
                Tham gia Chain4Good
              </h1>
              <p className="text-gray-600 leading-relaxed">
                Tạo tài khoản để bắt đầu hành trình thiện nguyện của bạn
              </p>
            </motion.div>

            {/* Wallet Connection Section */}
            <motion.div variants={item} className="w-full space-y-3">
              {!address ? (
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full h-12 font-medium bg-gradient-to-r from-primary/10 to-primary/5 hover:from-primary/20 hover:to-primary/10 border-primary/30 hover:border-primary/50 transition-all duration-300 group"
                    onClick={handleConnectWallet}
                  >
                    <div className="flex items-center justify-center gap-3">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      >
                        <Wallet
                          className="h-5 w-5 text-primary"
                          strokeWidth={2}
                        />
                      </motion.div>
                      <span className="text-sm font-medium">
                        Kết nối với ví Metamask
                      </span>
                      <ArrowRight className="h-4 w-4 text-primary/70 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full"
                >
                  <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-green-800">
                        Ví đã kết nối
                      </p>
                      <p className="text-xs text-green-600 font-mono">
                        {formatAddress(address)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {errors.address && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500"
                >
                  {errors.address.message}
                </motion.p>
              )}
            </motion.div>

            {/* Enhanced Separator */}
            <motion.div variants={item} className="w-full relative my-2">
              <Separator className="bg-gray-200" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-white px-4 text-sm text-gray-500 font-medium">
                  thông tin tài khoản
                </span>
              </div>
            </motion.div>

            {/* Enhanced Form */}
            <motion.form
              variants={item}
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4 w-full max-w-sm"
            >
              {/* Name Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="text-sm font-medium text-gray-700 flex items-center gap-2"
                >
                  <User className="w-4 h-4 text-primary" />
                  Họ và tên
                </Label>
                <div className="relative">
                  <Input
                    id="name"
                    type="text"
                    placeholder="Nguyễn Văn A"
                    className="h-12 pl-4 pr-4 border-gray-200 focus:border-primary focus:ring-primary/20 transition-all duration-300 bg-white/80"
                    {...register("name")}
                  />
                </div>
                {errors.name && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-red-500"
                  >
                    {errors.name.message}
                  </motion.p>
                )}
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700 flex items-center gap-2"
                >
                  <Mail className="w-4 h-4 text-primary" />
                  Email
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    className="h-12 pl-4 pr-4 border-gray-200 focus:border-primary focus:ring-primary/20 transition-all duration-300 bg-white/80"
                    {...register("email")}
                  />
                </div>
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-red-500"
                  >
                    {errors.email.message}
                  </motion.p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700 flex items-center gap-2"
                >
                  <Lock className="w-4 h-4 text-primary" />
                  Mật khẩu
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="h-12 pl-4 pr-12 border-gray-200 focus:border-primary focus:ring-primary/20 transition-all duration-300 bg-white/80"
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-red-500"
                  >
                    {errors.password.message}
                  </motion.p>
                )}
              </div>

              {/* Retype Password Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="retypePassword"
                  className="text-sm font-medium text-gray-700 flex items-center gap-2"
                >
                  <Lock className="w-4 h-4 text-primary" />
                  Nhập lại mật khẩu
                  {password &&
                    retypePassword &&
                    password === retypePassword && (
                      <Check className="w-4 h-4 text-green-500" />
                    )}
                </Label>
                <div className="relative">
                  <Input
                    id="retypePassword"
                    type={showRetypePassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="h-12 pl-4 pr-12 border-gray-200 focus:border-primary focus:ring-primary/20 transition-all duration-300 bg-white/80"
                    {...register("retypePassword")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowRetypePassword(!showRetypePassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showRetypePassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.retypePassword && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-red-500"
                  >
                    {errors.retypePassword.message}
                  </motion.p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        >
                          <Loader2 className="h-4 w-4" />
                        </motion.div>
                        Đang đăng ký...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span>Đăng ký tài khoản</span>
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    )}
                  </Button>
                </motion.div>
              </div>
            </motion.form>

            {/* Sign In Link */}
            <motion.div
              variants={item}
              className="text-center pt-4 border-t border-gray-100 w-full"
            >
              <p className="text-gray-600">
                Bạn đã có tài khoản?{" "}
                <Link
                  className="text-primary hover:text-primary/80 font-medium transition-colors"
                  to="/sign-in"
                >
                  Đăng nhập ngay
                </Link>
              </p>
            </motion.div>

            {/* Security Badge */}
            <motion.div
              variants={item}
              className="flex items-center justify-center gap-2 text-xs text-gray-500"
            >
              <Shield className="w-3 h-3" />
              <span>Bảo mật SSL 256-bit</span>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUpPage;
