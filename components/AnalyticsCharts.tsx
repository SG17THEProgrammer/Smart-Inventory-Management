"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

export default function AnalyticsCharts({ data }: any) {
  console.log("AnalyticsCharts data:", data);
  return (
    <div className="space-y-6">

      {/* Demand Trend */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h3 className="font-semibold mb-2">Demand Trend</h3>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data?.trend}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="demand" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Sales vs Purchases */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h3 className="font-semibold mb-2">Stock Flow</h3>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={[
              { name: "Sales", value: data?.sales },
              { name: "Purchases", value: data?.purchases },
            ]}
          >
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {/* Profit */}
        <div className="bg-green-50 p-4 rounded-xl">
          <h3 className="font-semibold">Estimated Profit</h3>
          <p className="text-xl font-bold">
            ₹ {data?.profitEstimate}
          </p>
        </div>

        {/* Cash Flow */}
        <div className={`p-4 rounded-xl ${data.cashFlow >= 0 ? "bg-green-50" : "bg-red-50"
          }`}>
          <h3 className="font-semibold">Cash Flow</h3>
          <p className="text-xl font-bold">
            ₹ {data.cashFlow}
          </p>
        </div>

        {/* Stock out Loss */}
        <div className="bg-red-50 p-4 rounded-xl">
          <h3 className="font-semibold">Stockout Loss</h3>
          <p className="text-xl font-bold">
            {data.stockoutLoss} units missed
          </p>
        </div>
      </div>



      {/* classification */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h3 className="font-semibold mb-2">
          Inventory Health
        </h3>

        {data.classification.map((p: any, i: number) => (
          <div key={i} className="flex justify-between text-sm">
            <span>{p.name}</span>
            <span
              className={
                p.status === "fast-moving"
                  ? "text-green-600"
                  : p.status === "dead-stock"
                    ? "text-red-600"
                    : "text-yellow-600"
              }
            >
              {p.status}
            </span>
          </div>
        ))}
      </div>

    </div>
  );
}