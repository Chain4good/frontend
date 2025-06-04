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
import { format, parseISO } from "date-fns";
import { vi } from "date-fns/locale";

const DonationChart = ({ data, summary }) => {
  const formattedData = data.map((item) => ({
    ...item,
    rawDate: item.date,
    date: format(parseISO(item.date), "dd/MM/yyyy"),
    total_amount: Number(item.total_amount.toFixed(4)), // Round to 4 decimal places for ETH
  }));

  // Add custom tooltip formatter for better display
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background/95 p-3 rounded-lg border shadow-sm">
          <p className="font-medium">{`Ngày: ${label}`}</p>
          <p className="text-primary">{`Số lượng: ${payload[0].value} ETH`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Thống kê quyên góp</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="day" className="space-y-4">
          <TabsList>
            <TabsTrigger value="day">Ngày</TabsTrigger>
            <TabsTrigger value="week">Tuần</TabsTrigger>
            <TabsTrigger value="month">Tháng</TabsTrigger>
          </TabsList>

          <TabsContent value="day" className="space-y-4">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={formattedData}>
                  <XAxis dataKey="date" />
                  <YAxis tickFormatter={(value) => `${value} ETH`} />
                  <Tooltip content={<CustomTooltip />} />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Bar
                    name="Số lượng ETH"
                    dataKey="total_amount"
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Tổng số lượt quyên góp
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {summary.totalDonations}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Tổng số tiền
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {summary.totalAmount} ETH
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Trung bình mỗi lượt
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {summary.averageAmount} ETH
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tương tự cho week và month */}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DonationChart;
