import { Download, Printer } from "lucide-react";
import { toast } from "react-hot-toast";
import jsPDF from "jspdf";

function InvoiceButton({ order }) {

    // =========================
    // Download Invoice
    // =========================

    const handleDownload = () => {

        try {

            const doc = new jsPDF();

            const pageWidth =
                doc.internal.pageSize.getWidth();

            const pageHeight =
                doc.internal.pageSize.getHeight();

            // =========================
            // Helper
            // =========================

            const formatCurrency = (amount) => {

                return `Rs. ${Number(amount || 0).toFixed(2)}`;

            };

            const formatDate = (date) => {

                if (!date) return "N/A";

                return new Date(date).toLocaleDateString(
                    "en-IN",
                    {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                    }
                );

            };

            // =========================
            // Invoice Header
            // =========================

            doc.setFont("helvetica", "bold");
            doc.setFontSize(24);

            doc.text(
                "INVOICE",
                20,
                25
            );

            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);

            doc.text(
                "E-Commerce Store",
                20,
                33
            );

            // Right side

            doc.setFont("helvetica", "bold");
            doc.setFontSize(11);

            doc.text(
                `Order #${order._id.slice(-8)}`,
                pageWidth - 20,
                20,
                {
                    align: "right",
                }
            );

            doc.setFont("helvetica", "normal");

            doc.text(
                `Invoice Date: ${formatDate(order.createdAt)}`,
                pageWidth - 20,
                28,
                {
                    align: "right",
                }
            );

            // =========================
            // Header Divider
            // =========================

            doc.line(
                20,
                40,
                pageWidth - 20,
                40
            );

            // =========================
            // Customer Information
            // =========================

            doc.setFont("helvetica", "bold");
            doc.setFontSize(13);

            doc.text(
                "Bill To",
                20,
                53
            );

            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);

            doc.text(
                order.user?.name ||
                order.address?.fullName ||
                "N/A",
                20,
                62
            );

            doc.text(
                order.user?.email ||
                "N/A",
                20,
                69
            );

            doc.text(
                order.address?.phone ||
                "N/A",
                20,
                76
            );

            // =========================
            // Shipping Address
            // =========================

            doc.setFont("helvetica", "bold");
            doc.setFontSize(13);

            doc.text(
                "Shipping Address",
                110,
                53
            );

            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);

            doc.text(
                order.address?.fullName ||
                "N/A",
                110,
                62
            );

            doc.text(
                order.address?.street ||
                "N/A",
                110,
                69
            );

            doc.text(
                `${order.address?.city || "N/A"}, ${
                    order.address?.state || "N/A"
                }`,
                110,
                76
            );

            doc.text(
                `${order.address?.country || "N/A"} - ${
                    order.address?.pincode || "N/A"
                }`,
                110,
                83
            );

            // =========================
            // Product Table
            // =========================

            let y = 100;

            doc.setFont("helvetica", "bold");
            doc.setFontSize(13);

            doc.text(
                "Order Items",
                20,
                y
            );

            y += 8;

            // Table Header

            doc.setFillColor(
                235,
                235,
                235
            );

            doc.rect(
                20,
                y,
                170,
                10,
                "F"
            );

            doc.setFontSize(10);

            doc.text(
                "Product",
                24,
                y + 7
            );

            doc.text(
                "Qty",
                105,
                y + 7
            );

            doc.text(
                "Unit Price",
                125,
                y + 7
            );

            doc.text(
                "Total",
                165,
                y + 7
            );

            y += 10;

            // =========================
            // Products
            // =========================

            doc.setFont("helvetica", "normal");

            order.items?.forEach((item) => {

                const productName =
                    item.product?.name ||
                    "Product";

                const quantity =
                    Number(item.quantity) || 0;

                const price =
                    Number(item.price) || 0;

                const itemTotal =
                    quantity * price;

                // Row border

                doc.rect(
                    20,
                    y,
                    170,
                    10
                );

                doc.text(
                    productName.substring(0, 38),
                    24,
                    y + 7
                );

                doc.text(
                    String(quantity),
                    107,
                    y + 7
                );

                doc.text(
                    formatCurrency(price),
                    125,
                    y + 7
                );

                doc.text(
                    formatCurrency(itemTotal),
                    165,
                    y + 7
                );

                y += 10;

                // New page if required

                if (y > 260) {

                    doc.addPage();

                    y = 25;

                }

            });

            // =========================
            // Amount Summary
            // =========================

            y += 12;

            doc.line(
                110,
                y,
                190,
                y
            );

            y += 10;

            doc.setFontSize(10);

            // Original Amount

            doc.setFont("helvetica", "normal");

            doc.text(
                "Original Amount",
                120,
                y
            );

            doc.text(
                formatCurrency(
                    order.originalAmount
                ),
                190,
                y,
                {
                    align: "right",
                }
            );

            // Discount

            y += 8;

            doc.text(
                "Discount",
                120,
                y
            );

            doc.setTextColor(
                0,
                130,
                0
            );

            doc.text(
                `- ${formatCurrency(
                    order.discountAmount
                )}`,
                190,
                y,
                {
                    align: "right",
                }
            );

            doc.setTextColor(
                0,
                0,
                0
            );

            // Total

            y += 12;

            doc.line(
                120,
                y,
                190,
                y
            );

            y += 10;

            doc.setFont("helvetica", "bold");
            doc.setFontSize(14);

            doc.text(
                "Total Amount",
                120,
                y
            );

            doc.text(
                formatCurrency(
                    order.totalAmount
                ),
                190,
                y,
                {
                    align: "right",
                }
            );

            // =========================
            // Payment Information
            // =========================

            y += 20;

            doc.setFont("helvetica", "bold");
            doc.setFontSize(13);

            doc.text(
                "Payment Information",
                20,
                y
            );

            y += 9;

            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);

            doc.text(
                `Payment Method: ${
                    order.paymentMethod ||
                    "N/A"
                }`,
                20,
                y
            );

            y += 7;

            doc.text(
                `Payment Status: ${
                    order.paymentStatus ||
                    "N/A"
                }`,
                20,
                y
            );

            if (order.paymentId) {

                y += 7;

                doc.text(
                    `Payment ID: ${order.paymentId}`,
                    20,
                    y
                );

            }

            if (order.razorpayOrderId) {

                y += 7;

                doc.text(
                    `Razorpay Order ID: ${order.razorpayOrderId}`,
                    20,
                    y
                );

            }

            // =========================
            // Coupon
            // =========================

            if (order.coupon) {

                y += 12;

                doc.setFont("helvetica", "bold");

                doc.text(
                    `Coupon Applied: ${order.coupon}`,
                    20,
                    y
                );

            }

            // =========================
            // Footer
            // =========================

            doc.setFont("helvetica", "normal");
            doc.setFontSize(9);

            doc.text(
                "Thank you for your purchase!",
                pageWidth / 2,
                pageHeight - 20,
                {
                    align: "center",
                }
            );

            doc.text(
                "This is a computer-generated invoice.",
                pageWidth / 2,
                pageHeight - 14,
                {
                    align: "center",
                }
            );

            // =========================
            // Save PDF
            // =========================

            const fileName =
                `Invoice-${order._id}.pdf`;

            doc.save(fileName);

            toast.success(
                "Invoice downloaded successfully"
            );

        } catch (error) {

            console.error(
                "Invoice generation error:",
                error
            );

            toast.error(
                "Failed to generate invoice"
            );

        }

    };

    // =========================
    // Print
    // =========================

    const handlePrint = () => {

        window.print();

    };

    return (

        <div className="bg-white rounded-xl shadow-md p-6 mb-6">

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">

                {/* Information */}

                <div>

                    <h2 className="text-xl font-bold">

                        Invoice

                    </h2>

                    <p className="text-gray-500">

                        Download or print invoice

                    </p>

                </div>

                {/* Buttons */}

                <div className="flex flex-wrap gap-3">

                    <button
                        onClick={handleDownload}
                        className="flex items-center gap-2 px-5 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
                    >

                        <Download size={18} />

                        Download PDF

                    </button>

                    <button
                        onClick={handlePrint}
                        className="flex items-center gap-2 px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
                    >

                        <Printer size={18} />

                        Print

                    </button>

                </div>

            </div>

        </div>

    );

}

export default InvoiceButton;