import { Card, Divider } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";
import { useTranslate } from "react-admin";
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

export interface ProductPurchase {
  id: number;
  name: string;
  value: number;
}

export interface ProductRevenue {
  name: string;
  revenue: number;
}

export interface RecentPurchase {
  id: number;
  customer_name: string;
  product_name: string;
  price: number;
  purchase_date: string;
}

interface CardProps {
  cardStyle: SxProps<Theme>;
  dividerColor: string;
}

interface PurchaseDistributionProps extends CardProps {
  data: ProductPurchase[];
}

interface ProductRevenueProps extends CardProps {
  data: ProductRevenue[];
}

interface RecentPurchasesProps extends CardProps {
  data: RecentPurchase[];
}

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#4B0082",
  "#0000FF",
  "#000000",
  "#FF0000",
];

export const PurchaseDistributionCard = ({
  data,
  cardStyle,
  dividerColor,
}: PurchaseDistributionProps) => {
  const translate = useTranslate();

  return (
    <Card sx={cardStyle}>
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">
          {translate("dashboard.purchaseDistribution")}
        </h2>
        <Divider sx={{ borderColor: dividerColor }} />
      </div>
      <div className="w-full h-[300px] sm:h-[400px] lg:h-[500px] flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
              isAnimationActive={false}
              activeShape={false}
              onClick={(e) => e.preventDefault()}
              onMouseDown={(e) => e.preventDefault()}
              onMouseUp={(e) => e.preventDefault()}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${entry.id}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number, name: string) => [
                `${value} purchases`,
                name,
              ]}
              cursor={false}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export const ProductRevenueCard = ({
  data,
  cardStyle,
  dividerColor,
}: ProductRevenueProps) => {
  const translate = useTranslate();

  return (
    <Card sx={cardStyle}>
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">
          {translate("dashboard.productRevenue")}
        </h2>
        <Divider sx={{ borderColor: dividerColor }} />
      </div>
      <div className="w-full h-[300px] sm:h-[400px] lg:h-[500px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 30,
              right: 40,
              left: 40,
              bottom: 80,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
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
              {data.map((entry, index) => (
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
  );
};

export const RecentPurchasesCard = ({
  data,
  cardStyle,
  dividerColor,
}: RecentPurchasesProps) => {
  const translate = useTranslate();

  return (
    <Card className="mt-4" sx={cardStyle}>
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">
          {translate("dashboard.recentPurchases")}
        </h2>
        <Divider sx={{ borderColor: dividerColor }} />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr
              className="border-b border-solid"
              style={{ borderColor: dividerColor }}
            >
              <th
                className="px-4 sm:px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider border-r border-solid"
                style={{ borderColor: dividerColor }}
              >
                {translate("dashboard.table.date")}
              </th>
              <th
                className="px-4 sm:px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider border-r border-solid"
                style={{ borderColor: dividerColor }}
              >
                {translate("dashboard.table.customer")}
              </th>
              <th
                className="px-4 sm:px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider border-r border-solid"
                style={{ borderColor: dividerColor }}
              >
                {translate("dashboard.table.product")}
              </th>
              <th className="px-4 sm:px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider">
                {translate("dashboard.table.price")}
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((purchase, index) => (
              <tr
                key={`purchase-${purchase.id}-${index}`}
                className={
                  index !== data.length - 1 ? "border-b border-solid" : ""
                }
                style={{ borderColor: dividerColor }}
              >
                <td
                  className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm border-r border-solid"
                  style={{ borderColor: dividerColor }}
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
                  style={{ borderColor: dividerColor }}
                >
                  {purchase.customer_name}
                </td>
                <td
                  className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm border-r border-solid"
                  style={{ borderColor: dividerColor }}
                >
                  {purchase.product_name}
                </td>
                <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-right font-medium">
                  ${purchase.price.toFixed(2)}
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 sm:px-6 py-3 sm:py-4 text-center text-sm"
                >
                  {translate("dashboard.table.no_purchases")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
