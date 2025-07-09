import jsPDF from "jspdf";
import "jspdf-autotable";
import { format } from "date-fns";
import type { UserOptions } from "jspdf-autotable";

interface DashboardExportData {
  startDate: Date | null;
  endDate: Date | null;
  productPurchases: Array<{ name: string; value: number }>;
  productRevenue: Array<{ name: string; revenue: number }>;
  recentPurchases: Array<{
    customer_name: string;
    product_name: string;
    price: number;
    purchase_date: string;
  }>;
  translations: {
    title: string;
    generatedOn: string;
    dateRange: string;
    start: string;
    end: string;
    purchaseDistribution: string;
    productRevenue: string;
    recentPurchases: string;
    product: string;
    numberOfPurchases: string;
    revenue: string;
    date: string;
    customer: string;
    price: string;
  };
}

interface JsPDFWithAutoTable extends jsPDF {
  autoTable: (options: UserOptions) => void;
  lastAutoTable: { finalY: number };
}

export const exportDashboardToPDF = ({
  startDate,
  endDate,
  productPurchases,
  productRevenue,
  recentPurchases,
  translations,
}: DashboardExportData) => {
  const doc = new jsPDF() as JsPDFWithAutoTable;
  const currentDate = format(new Date(), "yyyy-MM-dd HH:mm");

  // Title
  doc.setFontSize(20);
  doc.text(translations.title, 14, 20);
  doc.setFontSize(10);
  doc.text(`${translations.generatedOn}: ${currentDate}`, 14, 30);

  // Date Range
  if (startDate || endDate) {
    doc.text(
      `${translations.dateRange}: ${startDate ? format(startDate, "yyyy-MM-dd") : translations.start} to ${
        endDate ? format(endDate, "yyyy-MM-dd") : translations.end
      }`,
      14,
      40,
    );
  }

  // Purchase Distribution
  doc.setFontSize(16);
  doc.text(translations.purchaseDistribution, 14, 55);
  const purchaseColumns = [
    translations.product,
    translations.numberOfPurchases,
  ];
  const purchaseRows = productPurchases.map((item) => [item.name, item.value]);

  doc.autoTable({
    startY: 60,
    head: [purchaseColumns],
    body: purchaseRows,
    theme: "grid",
    headStyles: { fillColor: [20, 83, 45] },
  });

  // Product Revenue
  const currentY = doc.lastAutoTable.finalY + 20;
  doc.text(translations.productRevenue, 14, currentY);
  const revenueColumns = [translations.product, translations.revenue];
  const revenueRows = productRevenue.map((item) => [
    item.name,
    `$${item.revenue.toFixed(2)}`,
  ]);

  doc.autoTable({
    startY: currentY + 5,
    head: [revenueColumns],
    body: revenueRows,
    theme: "grid",
    headStyles: { fillColor: [20, 83, 45] },
  });

  // Recent Purchases
  const finalY = doc.lastAutoTable.finalY + 20;
  doc.text(translations.recentPurchases, 14, finalY);
  const purchasesColumns = [
    translations.date,
    translations.customer,
    translations.product,
    translations.price,
  ];
  const purchasesRows = recentPurchases.map((purchase) => [
    format(new Date(purchase.purchase_date), "yyyy-MM-dd"),
    purchase.customer_name,
    purchase.product_name,
    `$${purchase.price.toFixed(2)}`,
  ]);

  doc.autoTable({
    startY: finalY + 5,
    head: [purchasesColumns],
    body: purchasesRows,
    theme: "grid",
    headStyles: { fillColor: [20, 83, 45] },
  });

  // Save the PDF
  doc.save(`dashboard-report-${currentDate}.pdf`);
};
