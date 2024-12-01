import { Title, Loading } from "react-admin";
import { Card, useTheme, Divider } from "@mui/material";
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
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";
  const bgColor = isDarkMode ? "#151221" : "#eef2ea";
  const borderColor = isDarkMode ? "#2a2a2a" : "#e5e7eb";

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
        <Card
          sx={{
            backgroundColor: bgColor,
            border: `1px solid ${borderColor}`,
          }}
          elevation={0}
        >
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">
              Product Purchase Distribution
            </h2>
            <Divider sx={{ borderColor }} />
          </div>
          <div className="w-full h-[300px] sm:h-[400px] lg:h-[500px] flex items-center justify-center">
            <ResponsiveContainer
              width="100%"
              height="100%"
              style={{ userSelect: "none" }}
            >
              <PieChart style={{ backgroundColor: bgColor }}>
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
                <Tooltip />
                <Legend
                  verticalAlign="middle"
                  align="right"
                  layout="vertical"
                  wrapperStyle={{
                    paddingLeft: "1.25rem",
                    fontSize: "0.875rem",
                    maxHeight: "100%",
                    overflowY: "auto",
                    right: "1.25rem",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card
          sx={{
            backgroundColor: bgColor,
            border: `1px solid ${borderColor}`,
          }}
          elevation={0}
        >
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">Product Revenue</h2>
            <Divider sx={{ borderColor }} />
          </div>
          <div className="w-full h-[300px] sm:h-[400px] lg:h-[500px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={productRevenue}
                style={{ backgroundColor: bgColor, padding: "20px" }}
                margin={{
                  top: 30,
                  right: 40,
                  left: 40,
                  bottom: 80,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis tickFormatter={(value) => `$${value}`} />
                <Tooltip
                  cursor={{ fill: "transparent" }}
                  formatter={(value) => [`$${value}`, "Revenue"]}
                />
                <Legend />
                <Bar
                  dataKey="revenue"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={60}
                  isAnimationActive={false}
                >
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

      <Card
        className="mt-4"
        sx={{
          backgroundColor: bgColor,
          border: `1px solid ${borderColor}`,
        }}
        elevation={0}
      >
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">Recent Purchases</h2>
          <Divider sx={{ borderColor }} />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr
                className="border-b border-solid"
                style={{ borderColor: borderColor }}
              >
                <th
                  className="px-4 sm:px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider border-r border-solid"
                  style={{ borderColor: borderColor }}
                >
                  Date
                </th>
                <th
                  className="px-4 sm:px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider border-r border-solid"
                  style={{ borderColor: borderColor }}
                >
                  Customer
                </th>
                <th
                  className="px-4 sm:px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider border-r border-solid"
                  style={{ borderColor: borderColor }}
                >
                  Product
                </th>
                <th className="px-4 sm:px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider">
                  Price
                </th>
              </tr>
            </thead>
            <tbody>
              {recentPurchases.map((purchase, index) => (
                <tr
                  key={purchase.id}
                  className={
                    index !== recentPurchases.length - 1
                      ? "border-b border-solid"
                      : ""
                  }
                  style={{ borderColor: borderColor }}
                >
                  <td
                    className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm border-r border-solid"
                    style={{ borderColor: borderColor }}
                  >
                    {new Date(purchase.purchase_date).toLocaleDateString(
                      undefined,
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      },
                    )}
                  </td>
                  <td
                    className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium border-r border-solid"
                    style={{ borderColor: borderColor }}
                  >
                    {purchase.customer_name}
                  </td>
                  <td
                    className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm border-r border-solid"
                    style={{ borderColor: borderColor }}
                  >
                    {purchase.product_name}
                  </td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-right font-medium">
                    ${purchase.price.toFixed(2)}
                  </td>
                </tr>
              ))}
              {recentPurchases.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 sm:px-6 py-3 sm:py-4 text-center text-sm"
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
