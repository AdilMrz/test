import { Title, Loading } from "react-admin";
import { Card } from "@mui/material";
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { useGetList } from "react-admin";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#4B0082",
];

interface Product {
  id: number;
  name: string;
  description?: string;
}

interface Purchase {
  id: number;
  product_id: number;
  customer_id: number;
  price: number;
  purchase_date: string;
}

interface ProductPurchase {
  id: number;
  name: string;
  value: number;
}

interface ProductRevenue {
  name: string;
  revenue: number;
}

interface Customer {
  id: number;
  fullname: string;
}

interface RecentPurchase {
  id: number;
  customer_name: string;
  product_name: string;
  price: number;
  purchase_date: string;
}

export const Dashboard = () => {
  const { data: products, isLoading: isLoadingProducts } = useGetList<Product>(
    "products",
    {
      pagination: { page: 1, perPage: 50 },
      sort: { field: "id", order: "ASC" },
    },
  );

  const { data: purchases, isLoading: isLoadingPurchases } =
    useGetList<Purchase>(
      "purchases",
      {
        pagination: { page: 1, perPage: 1000 },
        sort: { field: "purchase_date", order: "DESC" },
      },
      {
        refetchInterval: 60000, // Refetch every minute
        refetchOnWindowFocus: true, // Refetch when window regains focus
        refetchOnMount: true, // Refetch when component mounts
      },
    );

  const { data: customers, isLoading: isLoadingCustomers } =
    useGetList<Customer>("customers", {
      pagination: { page: 1, perPage: 1000 },
      sort: { field: "id", order: "ASC" },
    });

  if (isLoadingProducts || isLoadingPurchases || isLoadingCustomers)
    return <Loading />;
  if (!products || !purchases || !customers) return null;

  const productPurchases: ProductPurchase[] = products.reduce(
    (acc: ProductPurchase[], product) => {
      const count = purchases.filter((p) => p.product_id === product.id).length;
      acc.push({
        id: product.id,
        name: product.name || "Unnamed Product",
        value: count,
      });
      return acc;
    },
    [],
  );

  const productRevenue: ProductRevenue[] = products.reduce(
    (acc: ProductRevenue[], product) => {
      const revenue = purchases
        .filter((p) => p.product_id === product.id)
        .reduce((sum, purchase) => sum + (Number(purchase.price) || 0), 0);
      acc.push({
        name: product.name || "Unnamed Product",
        revenue: Number(revenue.toFixed(2)),
      });
      return acc;
    },
    [],
  );

  const recentPurchases: RecentPurchase[] = purchases
    ? purchases
        .sort(
          (a, b) =>
            new Date(b.purchase_date).getTime() -
            new Date(a.purchase_date).getTime(),
        )
        .slice(0, 5)
        .map((purchase) => ({
          id: purchase.id,
          customer_name:
            customers?.find((c) => c.id === purchase.customer_id)?.fullname ||
            "Unknown",
          product_name:
            products?.find((p) => p.id === purchase.product_id)?.name ||
            "Unknown",
          price: purchase.price,
          purchase_date: purchase.purchase_date,
        }))
    : [];

  return (
    <div className="container mx-auto p-2 sm:p-4 max-w-[2000px]">
      <Title title="Dashboard" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-2 sm:p-4 shadow-lg rounded-lg bg-gray-800">
          <div className="w-full h-[300px] sm:h-[400px] lg:h-[500px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={productPurchases}
                  cx="40%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value, percent }) =>
                    percent > 0.03 ? `${name}: ${value}` : ""
                  }
                  outerRadius="45%"
                  fill="#8884d8"
                  dataKey="value"
                  isAnimationActive={false}
                >
                  {productPurchases.map((entry: ProductPurchase) => (
                    <Cell
                      key={`cell-${entry.id}`}
                      fill={
                        COLORS[productPurchases.indexOf(entry) % COLORS.length]
                      }
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "none",
                    borderRadius: "0.375rem",
                    color: "#F3F4F6",
                  }}
                />
                <Legend
                  verticalAlign="middle"
                  align="right"
                  layout="vertical"
                  wrapperStyle={{
                    paddingLeft: "20px",
                    fontSize: "12px",
                    color: "#E5E7EB",
                    maxHeight: "100%",
                    overflowY: "auto",
                    right: 20,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-2 sm:p-4 shadow-lg rounded-lg bg-gray-800">
          <div className="w-full h-[300px] sm:h-[400px] lg:h-[500px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={productRevenue}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 65,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#E5E7EB", fontSize: 12 }}
                  tickLine={{ stroke: "#4B5563" }}
                  axisLine={{ stroke: "#4B5563" }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis
                  tick={{ fill: "#E5E7EB", fontSize: 12 }}
                  tickLine={{ stroke: "#4B5563" }}
                  axisLine={{ stroke: "#4B5563" }}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip
                  cursor={{ fill: "rgba(55, 65, 81, 0.3)" }}
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "none",
                    borderRadius: "0.375rem",
                    color: "#F3F4F6",
                  }}
                  formatter={(value) => [`$${value}`, "Revenue"]}
                />
                <Legend
                  wrapperStyle={{
                    paddingTop: "10px",
                    color: "#E5E7EB",
                  }}
                />
                <Bar dataKey="revenue" radius={[4, 4, 0, 0]} maxBarSize={60}>
                  {productRevenue.map((entry, index) => (
                    <Cell
                      key={`cell-${entry.name}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="mt-4 p-2 sm:p-4 shadow-lg rounded-lg bg-gray-800">
        <div className="overflow-x-auto shadow-sm rounded-lg border border-gray-700">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-100 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-100 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-100 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-4 sm:px-6 py-3 text-right text-xs font-semibold text-gray-100 uppercase tracking-wider">
                  Price
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {recentPurchases.map((purchase) => (
                <tr
                  key={purchase.id}
                  className="hover:bg-gray-700 transition-colors duration-200"
                >
                  <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-300">
                    {new Date(purchase.purchase_date).toLocaleDateString(
                      undefined,
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      },
                    )}
                  </td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-300">
                    {purchase.customer_name}
                  </td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-300">
                    {purchase.product_name}
                  </td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-300 text-right font-medium">
                    ${purchase.price.toFixed(2)}
                  </td>
                </tr>
              ))}
              {recentPurchases.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 sm:px-6 py-3 sm:py-4 text-center text-sm text-gray-400"
                  >
                    No recent purchases found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
