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
import { AlertCircle, CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { useLocation } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Goal = () => {
  const [vnd, setVnd] = useState("");
  const [goal, setGoal] = useState(0);
  const [eth, setEth] = useState(0);
  const [exchangeRate, setExchangeRate] = useState(0);
  const { newCampaign, changeCampaignValue } = useCampaign();
  const location = useLocation();
  const error = location.state?.error;

  // Lấy tỷ giá ETH-VND từ API
  const fetchExchangeRate = async () => {
    try {
      const response = await axios.get(
        "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=vnd"
      );
      setExchangeRate(response.data.ethereum.vnd);
    } catch (error) {
      console.error("Error fetching exchange rate:", error);
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

  return (
    <div className="container px-10">
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Lỗi</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="flex flex-col mb-8">
        <Label className={"mb-2 text-lg"}>Thời gian kết thúc chiến dịch</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[240px] justify-start text-left font-normal",
                !newCampaign.deadline && "text-muted-foreground"
              )}
            >
              <CalendarIcon />
              {newCampaign.deadline ? (
                format(newCampaign.deadline, "PPP")
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={newCampaign.deadline}
              onSelect={(value) => changeCampaignValue("deadline", value)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      <div>
        <Label className={"mb-2 text-lg"}>Mục tiêu quyên góp</Label>
        <Input
          placeholder="Nhập mục tiêu quyên góp (VNĐ)"
          type="text"
          className="w-full text-3xl"
          value={vnd}
          onChange={handleChange}
        />
        <div className="text-2xl mt-4">≈ {eth.toFixed(6)} ETH</div>
        <div className="text-sm text-gray-500 mt-2">
          Tỷ giá ETH-VND:{" "}
          {exchangeRate ? exchangeRate.toLocaleString("vi-VN") : "Đang tải..."}
        </div>
      </div>
    </div>
  );
};

export default Goal;
