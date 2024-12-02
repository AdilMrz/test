import { Title, Loading } from "react-admin";
import { useTheme, alpha } from "@mui/material";
import { useGetList } from "react-admin";
import {
  PurchaseDistributionCard,
  ProductRevenueCard,
  RecentPurchasesCard,
} from "./DashboardCards";

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

interface RecentPurchaseData {
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
  const dividerColor = isDarkMode ? "#2a2a2a" : "#e5e7eb";
  const shadows = [
    alpha("#14532d", 0.2),
    alpha("#14532d", 0.1),
    alpha("#14532d", 0.05),
  ];
  const cardStyle = {
    backgroundColor: bgColor,
    boxShadow: `${shadows[0]} -2px 2px, ${shadows[1]} -4px 4px, ${shadows[2]} -6px 6px`,
    backgroundClip: "padding-box",
  };

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

  const productPurchases = products.reduce((acc, product) => {
    const count = purchases.filter((p) => p.product_id === product.id).length;
    if (count > 0) {
      acc.push({
        id: product.id,
        name: product.name,
        value: count,
      });
    }
    return acc;
  }, [] as ProductPurchase[]);

  const productRevenue = products
    .map((product) => ({
      name: product.name,
      revenue: purchases
        .filter((p) => p.product_id === product.id)
        .reduce((sum, p) => sum + p.price, 0),
    }))
    .filter((item) => item.revenue > 0) as ProductRevenue[];

  const recentPurchases = purchases
    ? purchases
        .sort(
          (a, b) =>
            new Date(b.purchase_date).getTime() -
            new Date(a.purchase_date).getTime(),
        )
        .slice(0, 10)
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
    : ([] as RecentPurchaseData[]);

  return (
    <div className="container mx-auto p-2 sm:p-4 max-w-[2000px]">
      <Title title="Dashboard" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <PurchaseDistributionCard
          data={productPurchases}
          cardStyle={cardStyle}
          dividerColor={dividerColor}
        />
        <ProductRevenueCard
          data={productRevenue}
          cardStyle={cardStyle}
          dividerColor={dividerColor}
        />
      </div>
      <RecentPurchasesCard
        data={recentPurchases}
        cardStyle={cardStyle}
        dividerColor={dividerColor}
      />
    </div>
  );
};
