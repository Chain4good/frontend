// src/components/DonationChart/index.jsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format, parseISO, subDays } from "date-fns";

const DonationChart = ({ data, summary, symbol = "ETH" }) => {
  const getLast7DaysData = () => {
    const today = new Date();
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(today, i);
      return format(date, "dd/MM/yyyy");
    }).reverse();

    const formattedData = data
      .map((item) => ({
        ...item,
        date: format(parseISO(item.date), "dd/MM/yyyy"),
        total_amount: Number(item.total_amount.toFixed(4)),
      }))
      .slice(-7);

    const dataMap = formattedData.reduce((acc, item) => {
      acc[item.date] = item.total_amount;
      return acc;
    }, {});

    return last7Days.map((date) => ({
      date,
      total_amount: dataMap[date] || 0,
    }));
  };

  const formattedData = getLast7DaysData();

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background/95 p-3 rounded-lg border shadow-sm">
          <p className="font-medium">{`Ngày: ${label}`}</p>
          <p className="text-primary">{`Số lượng: ${payload[0].value} ${symbol}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Thống kê quyên góp</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={formattedData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                interval={0}
                angle={-45}
                textAnchor="end"
                height={50}
              />
              <YAxis
                tickFormatter={(value) => `${value}`}
                tick={{ fontSize: 12 }}
                width={40}
              />
              <Tooltip content={<CustomTooltip />} />
              <CartesianGrid strokeDasharray="3 3" />
              <Bar
                name="Số lượng ETH"
                dataKey="total_amount"
                fill="hsl(var(--primary))"
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-4 text-center text-sm">
          <div className="bg-muted rounded-lg p-2">
            <div className="text-muted-foreground">Tổng lượt</div>
            <div className="font-bold">{summary.totalDonations}</div>
          </div>
          <div className="bg-muted rounded-lg p-2">
            <div className="text-muted-foreground">Tổng tiền</div>
            <div className="font-bold">
              {summary.totalAmount} {symbol}
            </div>
          </div>
          <div className="bg-muted rounded-lg p-2">
            <div className="text-muted-foreground">Trung bình</div>
            <div className="font-bold">
              {summary.averageAmount.toFixed(8)} {symbol}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DonationChart;
