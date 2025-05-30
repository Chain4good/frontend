import { useCharityDonation } from "@/hooks/useCharityDonation";
import React, { useEffect, useState } from "react";
import axios from "axios";

const formatNumber = (value) => {
  return parseFloat(value).toLocaleString("vi-VN");
};

const CampaignList = () => {
  const { getCampaign, getCampaignCount, donateETH } = useCharityDonation();
  const [campaigns, setCampaigns] = useState([]);
  const [exchangeRate, setExchangeRate] = useState(0);

  const formatCampaign = (data, id) => ({
    id,
    creator: data[0],
    title: data[1],
    tokenAddress: data[2],
    goal: {
      wei: data[3].toString(),
      eth: formatNumber(Number(data[3]) / 1e18),
      vnd: formatNumber((Number(data[3]) / 1e18) * exchangeRate),
    },
    totalDonated: {
      wei: data[5].toString(),
      eth: formatNumber(Number(data[5]) / 1e18),
      vnd: formatNumber((Number(data[5]) / 1e18) * exchangeRate),
      progress: Math.min((Number(data[5]) / Number(data[3])) * 100, 100),
    },
    deadline: data[4],
    isClosed: data[6],
    isNoLimit: data[7],
  });

  useEffect(() => {
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

    const fetchCampaigns = async () => {
      await fetchExchangeRate();
      const count = await getCampaignCount();
      const list = [];
      for (let i = 0; i < count; i++) {
        const campaign = await getCampaign(i);
        list.push(formatCampaign(campaign, i));
      }
      setCampaigns(list);
    };
    fetchCampaigns();
  }, []);

  return (
    <div>
      <h1>Campaign List</h1>
      {campaigns.map((c) => (
        <div key={c.id}>
          <h2>{c.title}</h2>
          <p>
            Goal: {c.goal.eth} ETH (≈ {c.goal.vnd} VND)
          </p>
          <p>
            Progress: {c.totalDonated.eth} ETH / {c.goal.eth} ETH (
            {c.totalDonated.progress.toFixed(2)}%)
          </p>
          <div
            style={{
              width: "100%",
              height: "20px",
              backgroundColor: "#eee",
              borderRadius: "10px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${c.totalDonated.progress}%`,
                height: "100%",
                backgroundColor: "#4CAF50",
                transition: "width 0.5s ease-in-out",
              }}
            />
          </div>
          <button onClick={() => donateETH(c.id, 0.004)}>
            Donate 0.01 ETH
          </button>
        </div>
      ))}
    </div>
  );
};

export default CampaignList;
