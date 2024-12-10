import { Title, Loading } from "react-admin";
import { useTheme, alpha, Box, Button } from "@mui/material";
import { useGetList } from "react-admin";
import { Download as DownloadIcon } from "@mui/icons-material";
import {
  PurchaseDistributionCard,
  ProductRevenueCard,
  RecentPurchasesCard,
} from "./DashboardCards";
import { DateRangeFilter } from "./DateRangefilter";
import { exportDashboardToPDF } from "../../utils/dashboardExport";
import { useState } from "react";
import { Protected } from "../../components/Protected";

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

export interface RecentPurchaseData {
  id: number;
  customer_name: string;
  product_name: string;
  price: number;
  purchase_date: string;
}

export const Dashboard = () => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

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
        refetchInterval: 60000,
        refetchOnWindowFocus: true,
        refetchOnMount: true,
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

  const filteredPurchases = purchases.filter((purchase) => {
    if (!startDate && !endDate) return true;
    const purchaseDate = new Date(purchase.purchase_date);
    if (startDate && purchaseDate < startDate) return false;
    if (endDate && purchaseDate > endDate) return false;
    return true;
  });

  const productPurchases = products.reduce((acc, product) => {
    const count = filteredPurchases.filter(
      (p) => p.product_id === product.id,
    ).length;
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
      revenue: filteredPurchases
        .filter((p) => p.product_id === product.id)
        .reduce((sum, p) => sum + p.price, 0),
    }))
    .filter((item) => item.revenue > 0) as ProductRevenue[];

  const recentPurchases = filteredPurchases.slice(0, 10).map((purchase) => ({
    id: purchase.id,
    customer_name:
      customers?.find((c) => c.id === purchase.customer_id)?.fullname ||
      "Unknown",
    product_name:
      products?.find((p) => p.id === purchase.product_id)?.name || "Unknown",
    price: purchase.price,
    purchase_date: purchase.purchase_date,
  }));

  const handleExport = () => {
    exportDashboardToPDF({
      startDate,
      endDate,
      productPurchases,
      productRevenue,
      recentPurchases,
    });
  };

  return (
    <Protected action="read" resource="dashboard">
      <div className="container mx-auto p-2 sm:p-4 max-w-[2000px]">
        <Title title="Dashboard" />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <DateRangeFilter
            onFilterChange={(start, end) => {
              setStartDate(start);
              setEndDate(end);
            }}
          />
          <Button
            variant="contained"
            onClick={handleExport}
            startIcon={<DownloadIcon />}
          >
            Export PDF
          </Button>
        </Box>
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
    </Protected>
  );
};
