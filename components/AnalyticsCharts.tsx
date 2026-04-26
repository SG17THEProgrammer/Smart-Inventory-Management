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
  if (!data) return null;

  const topProducts =
    data?.highDemand?.map(([name, value]: any) => ({
      name,
      value,
    })) || [];

  const chartWidth = Math.max(300, topProducts.length * 80);

  return (
    <div className="space-y-6">

      {/* 📈 DEMAND TREND */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h3 className="font-semibold mb-2">Demand Trend</h3>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data?.trend}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="value" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 🟢 HIGH DEMAND PRODUCTS */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h3 className="font-semibold mb-4">Top Selling Products</h3>

        <div className="overflow-x-auto">
          <div
            style={{
              width: `${chartWidth}px`,
              margin: "0 auto",
            }}
          >
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={topProducts}>
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />

                <Bar
                  dataKey="value"
                  radius={[8, 8, 0, 0]}
                  maxBarSize={40} // 🔥 KEY FIX
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 📊 KEY METRICS */}
      <div className="grid grid-cols-3 gap-3">

        {/* Orders */}
        <div className="bg-blue-50 p-4 rounded-xl">
          <h3 className="font-semibold">Total Orders</h3>
          <p className="text-xl font-bold">
            {data.metrics.totalOrders}
          </p>
        </div>

        {/* Revenue */}
        <div className="bg-green-50 p-4 rounded-xl">
          <h3 className="font-semibold">Revenue</h3>
          <p className="text-[11px]">(Dummy as price is not taken under consideration right now)</p>
          <p className="text-xl font-bold">
            ₹ {data.metrics.totalRevenue}
          </p>
        </div>

        {/* Stockouts */}
        <div className="bg-red-50 p-4 rounded-xl">
          <h3 className="font-semibold">Stockouts</h3>
          <p className="text-xl font-bold">
            {data.metrics.stockouts}
          </p>
        </div>
      </div>

      {/* 📦 INVENTORY HEALTH */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h3 className="font-semibold mb-3">Inventory Health</h3>

        {/* 🔴 Dead Stock */}
        <div className="mb-3">
          <h4 className="text-red-600 font-medium">Dead Stock</h4>
          {data.deadStock.map((p: any) => (
            <div key={p._id} className="text-sm">
              {p.name}
            </div>
          ))}
        </div>

        {/* 🟡 Slow Stock */}
        <div>
          <h4 className="text-yellow-600 font-medium">Slow Moving</h4>
          {data.slowStock.map((p: any) => (
            <div key={p._id} className="text-sm">
              {p.name}
            </div>
          ))}
        </div>
      </div>

      {/* 🔴 LOW STOCK ALERT */}
      <div className="bg-red-50 p-4 rounded-xl shadow">
        <h3 className="font-semibold mb-2 text-red-600">
          Low Stock Alerts
        </h3>

        {data.lowStock.map((p: any) => (
          <div key={p._id} className="text-sm">
            {p.name} → {p.stock}
          </div>
        ))}
      </div>

    </div>
  );
}