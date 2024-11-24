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

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

interface Product {
  id: number;
  name: string;
  description?: string;
}

interface Purchase {
  id: number;
  product_id: number;
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

export const Dashboard = () => {
  const { data: products, isLoading: isLoadingProducts } = useGetList<Product>(
    "products",
    {
      pagination: { page: 1, perPage: 50 },
      sort: { field: "id", order: "ASC" },
    },
  );

  const { data: purchases, isLoading: isLoadingPurchases } =
    useGetList<Purchase>("purchases", {
      pagination: { page: 1, perPage: 1000 },
      sort: { field: "id", order: "ASC" },
    });

  if (isLoadingProducts || isLoadingPurchases) return <Loading />;
  if (!products || !purchases) return null;

  // Calculate product purchase counts
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

  // Calculate product revenue
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      <Card className="p-4">
        <Title title="Products Purchase Distribution" />
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={productPurchases}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius="90%"
                fill="#8884d8"
                dataKey="value"
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
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-4">
        <Title title="Product Revenue" />
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={productRevenue}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
              <XAxis
                dataKey="name"
                tick={{ fill: "#666", fontSize: 12 }}
                tickLine={{ stroke: "#666" }}
                axisLine={{ stroke: "#666" }}
              />
              <YAxis
                tick={{ fill: "#666", fontSize: 12 }}
                tickLine={{ stroke: "#666" }}
                axisLine={{ stroke: "#666" }}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip
                cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  padding: "10px",
                }}
                formatter={(value) => [`$${value}`, "Revenue"]}
              />
              <Legend
                wrapperStyle={{
                  paddingTop: "10px",
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
  );
};
