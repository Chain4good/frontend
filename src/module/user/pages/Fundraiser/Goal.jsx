import { Input } from "@/components/ui/input";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Label } from "@/components/ui/label";
import { useFormContext } from "react-hook-form";
import useCampaign from "@/hooks/useCampaign";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  CalendarIcon,
  Target,
  TrendingUp,
  DollarSign,
  Coins,
  RefreshCw,
  Info,
  Calendar,
  Clock,
} from "lucide-react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { useLocation } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { motion } from "framer-motion";

const Goal = () => {
  const [vnd, setVnd] = useState("");
  const [goal, setGoal] = useState(0);
  const [eth, setEth] = useState(0);
  const [exchangeRate, setExchangeRate] = useState(0);
  const [isLoadingRate, setIsLoadingRate] = useState(true);
  const { newCampaign, changeCampaignValue } = useCampaign();
  const location = useLocation();
  const error = location.state?.error;

  // Lấy tỷ giá ETH-VND từ API
  const fetchExchangeRate = async () => {
    setIsLoadingRate(true);
    try {
      const response = await axios.get(
        "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=vnd"
      );
      setExchangeRate(response.data.ethereum.vnd);
    } catch (error) {
      console.error("Error fetching exchange rate:", error);
    } finally {
      setIsLoadingRate(false);
    }
  };

  useEffect(() => {
    fetchExchangeRate();
  }, []);

  const formatVND = (value) => {
    const number = value.replace(/\D/g, "");
    if (number === "") return "";
    return parseInt(number).toLocaleString("vi-VN");
  };

  const handleChange = (e) => {
    const rawValue = e.target.value;
    const numericValue = rawValue.replace(/\D/g, "");

    setVnd(formatVND(rawValue));
    setGoal(Number(numericValue));
    if (numericValue === "") {
      setEth(0);
    } else {
      const number = parseFloat(numericValue);
      setEth(number / exchangeRate);
    }
  };

  useEffect(() => {
    changeCampaignValue("goal", goal);
  }, [goal, changeCampaignValue]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="container mx-auto px-6 md:px-10 py-8"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* Header Section */}
      <motion.div variants={item} className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-sm mb-4">
          <Target className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">
            Thiết lập mục tiêu
          </span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent mb-2">
          Đặt mục tiêu cho chiến dịch
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Xác định mục tiêu quyên góp và thời gian để tạo động lực cho cộng đồng
        </p>
      </motion.div>

      {/* Error Alert */}
      {error && (
        <motion.div variants={item}>
          <Alert
            variant="destructive"
            className="mb-6 border-destructive/50 bg-destructive/10"
          >
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Có lỗi xảy ra</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </motion.div>
      )}

      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
        {/* Deadline Section */}
        <motion.div variants={item} className="space-y-4">
          <div className="relative p-6 bg-gradient-to-br from-white to-gray-50/50 rounded-2xl border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
            {/* Icon decoration */}
            <div className="absolute top-4 right-4">
              <motion.div
                className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <Calendar className="w-5 h-5 text-primary" />
              </motion.div>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                <Clock className="w-4 h-4 text-primary" />
              </div>
              <Label className="text-lg font-semibold text-gray-900">
                Thời gian kết thúc chiến dịch
              </Label>
            </div>

            <Popover>
              <PopoverTrigger asChild>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal h-12 border-2 hover:border-primary/50 transition-colors",
                      !newCampaign.deadline && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="w-4 h-4 mr-2 text-primary" />
                    {newCampaign.deadline ? (
                      format(newCampaign.deadline, "dd/MM/yyyy")
                    ) : (
                      <span>Chọn ngày kết thúc</span>
                    )}
                  </Button>
                </motion.div>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={newCampaign.deadline}
                  onSelect={(value) => changeCampaignValue("deadline", value)}
                  initialFocus
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>

            {newCampaign.deadline && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-3 p-3 bg-primary/5 rounded-lg border border-primary/20"
              >
                <div className="flex items-center gap-2 text-sm text-primary">
                  <Info className="w-4 h-4" />
                  <span>
                    Chiến dịch sẽ kết thúc vào{" "}
                    {format(newCampaign.deadline, "dd/MM/yyyy")}
                  </span>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Goal Amount Section */}
        <motion.div variants={item} className="space-y-4">
          <div className="relative p-6 bg-gradient-to-br from-white to-gray-50/50 rounded-2xl border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
            {/* Icon decoration */}
            <div className="absolute top-4 right-4">
              <motion.div
                className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <TrendingUp className="w-5 h-5 text-primary" />
              </motion.div>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-primary" />
              </div>
              <Label className="text-lg font-semibold text-gray-900">
                Mục tiêu quyên góp
              </Label>
            </div>

            <div className="relative">
              <Input
                placeholder="0"
                type="text"
                className="w-full text-2xl md:text-3xl h-16 pl-12 pr-16 border-2 hover:border-primary/50 focus:border-primary transition-colors"
                value={vnd}
                onChange={handleChange}
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-gray-500">
                ₫
              </div>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-500 font-medium">
                VNĐ
              </div>
            </div>

            {/* ETH Conversion */}
            {eth > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl border border-primary/20"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Coins className="w-5 h-5 text-primary" />
                    <span className="text-lg font-semibold text-primary">
                      ≈ {eth.toFixed(6)} ETH
                    </span>
                  </div>
                  <motion.button
                    onClick={fetchExchangeRate}
                    className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={isLoadingRate}
                  >
                    <RefreshCw
                      className={cn(
                        "w-4 h-4 text-primary",
                        isLoadingRate && "animate-spin"
                      )}
                    />
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Exchange Rate Info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Tỷ giá ETH/VNĐ:</span>
                <div className="flex items-center gap-2">
                  {isLoadingRate ? (
                    <div className="flex items-center gap-2">
                      <RefreshCw className="w-3 h-3 animate-spin text-primary" />
                      <span className="text-primary">Đang cập nhật...</span>
                    </div>
                  ) : (
                    <span className="font-semibold text-gray-900">
                      {exchangeRate
                        ? exchangeRate.toLocaleString("vi-VN")
                        : "Không có dữ liệu"}{" "}
                      VNĐ
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Tips Section */}
      <motion.div
        variants={item}
        className="max-w-4xl mx-auto mt-8 p-6 bg-gradient-to-r from-blue-50 to-primary/5 rounded-2xl border border-blue-200/50"
      >
        <div className="flex items-start gap-4">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
            <Info className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">
              Mẹo thiết lập mục tiêu hiệu quả
            </h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Đặt mục tiêu thực tế và có thể đạt được</li>
              <li>• Tính toán chi phí cụ thể để xác định số tiền cần thiết</li>
              <li>• Thời gian chiến dịch nên từ 30-90 ngày để tạo momentum</li>
              <li>• Mục tiêu rõ ràng sẽ thu hút nhiều người quyên góp hơn</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Goal;
