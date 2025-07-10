import { Title, Loading, useTranslate } from "react-admin";
import { useTheme, alpha, Box, Button } from "@mui/material";
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
import { useDashboardData } from "../../hooks/useDashboardData";
import { useRealtimeData } from "../../hooks/useRealtimeData";

// Import types from DashboardCards to ensure compatibility
import type { ProductPurchase, ProductRevenue } from "./DashboardCards";

export const Dashboard = () => {
  const translate = useTranslate();
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

  // Use our new React Query hooks for better performance and real-time updates
  const { products, purchases, customers, isLoading, hasError, errors } =
    useDashboardData({
      startDate,
      endDate,
    });

  // Enable real-time data synchronization
  useRealtimeData({ enabled: true });

  if (isLoading) return <Loading />;

  if (hasError) {
    console.error("Dashboard data errors:", errors);
    return (
      <Box p={2}>
        <Title title="Dashboard" />
        <div>Error loading dashboard data. Please try refreshing the page.</div>
      </Box>
    );
  }

  if (!products.data || !purchases.data || !customers.data) return null;

  // The data is already filtered by date range in the hook, so we can use it directly
  const filteredPurchases = purchases.data || [];

  const productPurchases = (products.data || []).reduce(
    (acc, product, index) => {
      const count = filteredPurchases.filter(
        (p) => p.product_id === product.id,
      ).length;
      if (count > 0) {
        acc.push({
          id: parseInt(product.id) || index + 1, // Use index + 1 as fallback for unique IDs
          name: product.name,
          value: count,
        });
      }
      return acc;
    },
    [] as ProductPurchase[],
  );

  const productRevenue = (products.data || [])
    .map((product) => ({
      name: product.name,
      revenue: filteredPurchases
        .filter((p) => p.product_id === product.id)
        .reduce((sum, p) => sum + p.price, 0),
    }))
    .filter((item) => item.revenue > 0) as ProductRevenue[];

  const recentPurchases = filteredPurchases
    .slice(0, 10)
    .map((purchase, index) => ({
      id: parseInt(purchase.id) || index + 1, // Use index + 1 as fallback to ensure uniqueness
      customer_name:
        purchase.customers?.fullname || translate("dashboard.unknown"),
      product_name: purchase.products?.name || translate("dashboard.unknown"),
      price: purchase.price,
      purchase_date: purchase.purchase_date,
    }));

  const handleExport = () => {
    const translations = {
      title: translate("dashboard.pdf.title", { _: "Dashboard Report" }),
      generatedOn: translate("dashboard.pdf.generatedOn", {
        _: "Generated on",
      }),
      dateRange: translate("dashboard.pdf.dateRange", { _: "Date Range" }),
      start: translate("dashboard.pdf.start", { _: "Start" }),
      end: translate("dashboard.pdf.end", { _: "End" }),
      purchaseDistribution: translate("dashboard.purchaseDistribution", {
        _: "Purchase Distribution",
      }),
      productRevenue: translate("dashboard.productRevenue", {
        _: "Product Revenue",
      }),
      recentPurchases: translate("dashboard.recentPurchases", {
        _: "Recent Purchases",
      }),
      product: translate("dashboard.table.product", { _: "Product" }),
      numberOfPurchases: translate("dashboard.pdf.numberOfPurchases", {
        _: "Number of Purchases",
      }),
      revenue: translate("dashboard.pdf.revenue", { _: "Revenue" }),
      date: translate("dashboard.table.date", { _: "Date" }),
      customer: translate("dashboard.table.customer", { _: "Customer" }),
      price: translate("dashboard.table.price", { _: "Price" }),
    };

    exportDashboardToPDF({
      startDate,
      endDate,
      productPurchases,
      productRevenue,
      recentPurchases,
      translations,
    });
  };

  return (
    <Protected action="read" resource="dashboard">
      <div className="container mx-auto p-2 sm:p-4 max-w-[2000px]">
        <Title title={translate("dashboard.title")} />
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
            {translate("dashboard.export")}
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
