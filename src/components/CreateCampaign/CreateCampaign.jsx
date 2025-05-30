import React, { useState } from "react";
import { ethers } from "ethers";
import { useCharityDonation } from "@/hooks/useCharityDonation";

const CreateCampaign = () => {
  const { createCampaign } = useCharityDonation();

  const [title, setTitle] = useState("");
  const [tokenAddress, setTokenAddress] = useState(
    "0x0000000000000000000000000000000000000000"
  ); // Default ETH
  const [goal, setGoal] = useState("");
  const [duration, setDuration] = useState("");
  const [isNoLimit, setIsNoLimit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    try {
      const parsedGoal = ethers.parseEther(goal); // goal in ETH or tokens
      const parsedDuration = parseInt(duration) * 60; // assume duration in minutes

      await createCampaign(
        title,
        tokenAddress,
        parsedGoal,
        parsedDuration,
        isNoLimit
      );
      setSuccess("Chiến dịch đã được tạo thành công!");
    } catch (err) {
      console.error(err);
      alert(err?.message || "Có lỗi xảy ra");
    }
    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 border rounded shadow-md max-w-md mx-auto"
    >
      <h2 className="text-xl font-bold mb-4">Tạo chiến dịch từ thiện</h2>

      <label className="block mb-2">
        Tiêu đề:
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border px-2 py-1 rounded mt-1"
          required
        />
      </label>

      <label className="block mb-2">
        Địa chỉ Token (0x0 cho ETH):
        <input
          type="text"
          value={tokenAddress}
          onChange={(e) => setTokenAddress(e.target.value)}
          className="w-full border px-2 py-1 rounded mt-1"
          required
        />
      </label>

      <label className="block mb-2">
        Mục tiêu (ví dụ: 1.5):
        <input
          type="number"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          className="w-full border px-2 py-1 rounded mt-1"
          required
          step="any"
        />
      </label>

      <label className="block mb-2">
        Thời hạn (phút):
        <input
          type="number"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          className="w-full border px-2 py-1 rounded mt-1"
          required
        />
      </label>

      <label className="flex items-center mb-4">
        <input
          type="checkbox"
          checked={isNoLimit}
          onChange={(e) => setIsNoLimit(e.target.checked)}
          className="mr-2"
        />
        Không giới hạn (bỏ qua mục tiêu)
      </label>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Đang tạo..." : "Tạo chiến dịch"}
      </button>

      {success && <p className="text-green-600 mt-3">{success}</p>}
    </form>
  );
};

export default CreateCampaign;
