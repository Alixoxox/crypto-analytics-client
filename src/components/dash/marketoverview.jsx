import React, { useState, useMemo, useContext } from "react";
import { AreaChart, Area, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card,CardHeader, CardTitle,CardDescription,CardContent} from "@/components/ui/card";
import { ChartContainer,ChartTooltip,ChartTooltipContent,ChartLegend,ChartLegendContent} from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import { UserContext } from "@/context/main";

export default function MarketOverviewChart() {
  const {btc} =useContext(UserContext)
  const [range, setRange] = useState("7d");
  const fullData = useMemo(() => {
  return btc.timestamps.map((ts, i) => ({
    date: new Date(ts),
    price: btc.prices[i],
  })).reverse(); // reverse to have oldest first
}, [btc]);

const visibleData = useMemo(() => {
  if (range === "all") return fullData;
  const count = range === "30d" ? 30 : 7;
  return fullData.slice(-count); // latest N values
}, [range, fullData]);

const formatDate = (date) => {
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
  });
};

  return (
    <Card className="pt-0 bg-[#1a1a1a] text-white border-transparent">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold">
          Bitcoin Market Overview
        </CardTitle>
        <CardDescription>Live BTC snapshot trends</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Buttons */}
        <div className="flex gap-2">
          {["7d", "30d", "all"].map((opt) => (
            <Button
              key={opt}
              variant={range === opt ? "default" : "outline"}
              onClick={() => setRange(opt)}
              className="capitalize"
            >
              {opt === "7d" ? "7 Days" : opt === "30d" ? "1 Month" : "All Time"}
            </Button>
          ))}
        </div>

        {/* Chart */}
        <ChartContainer
          className="w-full h-[280px]"
          config={{
            price: {
              label: "BTC Price",
              color: "var(--chart-1)",
            },
          }}
        >
          <AreaChart data={visibleData}>
            <defs>
              <linearGradient id="fillPrice" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-price)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-price)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
            />
            <YAxis
              domain={["auto", "auto"]}
              tickFormatter={(v) => `$${(v / 1000).toFixed(1)}k`}
              tick={{ fontSize: 10 }}
              tickLine={false}
              axisLine={false}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(label) =>
                    `Time: ${label.toLocaleString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      day: "numeric",
                      month: "short",
                    })}`
                  }
                  valueFormatter={(value) =>
                    `$${Number(value).toLocaleString()}`
                  }
                />
              }
            />
            <Area
              dataKey="price"
              type="monotone"
              fill="url(#fillPrice)"
              stroke="purple"
              strokeWidth={2}
              dot={false}
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
