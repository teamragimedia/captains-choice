import { Routes, Route } from "react-router-dom";
import { useState } from "react";

// Layout
import MainLayout from "./layout/MainLayout";

// Pages
import Account from "./pages/Account";
import ProductAdmin from "./pages/admin/ProductAdmin";
import CategoriesAdmin from "./pages/admin/CategoriesAdmin";
import ProductPage from "./components/Shop/ProductDetail";
import Contact from "./pages/Contact";
import TermsConditions from "./pages/TermsConditions";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import RefundPolicy from "./pages/RefundPolicy";
import ShippingPolicy from "./pages/ShippingPolicy";
import ReturnPolicy from "./pages/ReturnPolicy";
import CancellationPolicy from "./pages/CancellationPolicy";
import OrderConfirmation from "./pages/OrderConfirmation";

// Components
import HeroSlider from "./components/HeroSlider";
import StatsSection from "./components/StatsSection";
import Categories from "./components/Categories";
import QualitySection from "./components/QualitySection";
import ProductCarousel from "./components/ProductCarousel";
import ScrollToTop from "./components/ScrollToTop";

// Sections
import BrandStrip from "./pages/BrandStrip";
import WhyChoose from "./pages/WhyChoose";
import SmartDelivery from "./pages/SmartDelivery";
import FAQ from "./pages/FAQ";
import VendorCTA from "./pages/VendorCTA";
import Testimonials from "./pages/Testimonials";

// Shop
import Shop from "./components/Shop/Shop";
import CartPage from "./pages/CartPage";

// Popup
import LoginPopup from "./components/LoginPopup";

// Toast
import { Toaster } from "react-hot-toast";

// Admin
import AdminLayout from "./admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Approvals from "./admin/Approvals";
import AdminUsers from "./admin/AdminUsers";
import AdminLogin from "./admin/AdminLogin";
import ApprovalDetails from "./admin/ApprovalDetails";
import Orders from "./admin/Orders";
import Inventory from "./admin/Inventory";
import WasteManagement from "./admin/WasteManagement";
import Invoices from "./admin/Invoices";
import Shipping from "./admin/Shipping";
import Customers from "./admin/Customers";
import Reports from "./admin/Reports";
import Analytics from "./admin/Analytics";
import Settings from "./admin/Settings";
import StaffMembers from "./admin/StaffMembers";
import Wishlist from "./admin/Wishlist";
import RecurringOrders from "./admin/RecurringOrders";
import SalesReport from "./admin/Reports/SalesReport";
import PurchaseReport from "./admin/Reports/PurchaseReport";
import TransactionReport from "./admin/Reports/TransactionReport";
import ComparisonReport from "./admin/Reports/ComparisonReport";
import ProfitReport from "./admin/Reports/ProfitReport";
import GSTReports from "./admin/Reports/GSTReports";
import PurchaseAdmin from "./pages/admin/PurchaseAdmin";

// Context
import { CartProvider } from "./context/CartContext";

// Styles
import "./index.css";

function HomePage() {
  return (
    <>
      <HeroSlider />
      <StatsSection />
      <Categories />
      <QualitySection />
      <ProductCarousel
        title="Fruits & Vegetables"
        subtitle="freshness guaranteed"
        category="fruits & vegetables"
      />
      <ProductCarousel
        title="Dairy"
        subtitle="handpicked brands"
        category="Dairy"
      />
      <BrandStrip />
      <WhyChoose />
      <SmartDelivery />
      <FAQ />
      <VendorCTA />
      <Testimonials />
    </>
  );
}

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const openLogin = () => setShowLogin(true);

  return (
    <CartProvider>
      <Toaster position="top-right" />
      <ScrollToTop />
      <Routes>
        <Route
          path="/"
          element={
            <MainLayout openLogin={openLogin} showTopbar={true}>
              <HomePage />
            </MainLayout>
          }
        />
        <Route
          path="/shop"
          element={
            <MainLayout openLogin={openLogin}>
              <Shop />
            </MainLayout>
          }
        />
        <Route
          path="/contact"
          element={
            <MainLayout openLogin={openLogin}>
              <Contact />
            </MainLayout>
          }
        />
        <Route
          path="/terms-and-conditions"
          element={
            <MainLayout openLogin={openLogin}>
              <TermsConditions />
            </MainLayout>
          }
        />
        <Route
          path="/privacy-policy"
          element={
            <MainLayout openLogin={openLogin}>
              <PrivacyPolicy />
            </MainLayout>
          }
        />
        <Route
          path="/refund-policy"
          element={
            <MainLayout openLogin={openLogin}>
              <RefundPolicy />
            </MainLayout>
          }
        />
        <Route
          path="/shipping-policy"
          element={
            <MainLayout openLogin={openLogin}>
              <ShippingPolicy />
            </MainLayout>
          }
        />
        <Route
          path="/cancellation-policy"
          element={
            <MainLayout openLogin={openLogin}>
              <CancellationPolicy />
            </MainLayout>
          }
        />
        <Route
          path="/return-policy"
          element={
            <MainLayout openLogin={openLogin}>
              <ReturnPolicy />
            </MainLayout>
          }
        />
        <Route
          path="/about"
          element={
            <MainLayout openLogin={openLogin}>
              <h1 className="py-20 text-center text-3xl font-bold">
                About Us - Coming Soon!
              </h1>
            </MainLayout>
          }
        />
        <Route
          path="/product/:id"
          element={
            <MainLayout openLogin={openLogin}>
              <ProductPage />
            </MainLayout>
          }
        />
        <Route
          path="/cart"
          element={
            <MainLayout openLogin={openLogin}>
              <CartPage />
            </MainLayout>
          }
        />
        <Route
          path="/order-success"
          element={
            <MainLayout openLogin={openLogin}>
              <OrderConfirmation />
            </MainLayout>
          }
        />
        <Route
          path="/account"
          element={
            <MainLayout openLogin={openLogin}>
              <Account />
            </MainLayout>
          }
        />

        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="purchases" element={<PurchaseAdmin />} />
          <Route path="approvals" element={<Approvals />} />
          <Route path="approvals/:id" element={<ApprovalDetails />} />
          <Route path="categories" element={<CategoriesAdmin />} />
          <Route path="reports/sales" element={<SalesReport />} />
          <Route path="reports/purchase" element={<PurchaseReport />} />
          <Route path="reports/transaction" element={<TransactionReport />} />
          <Route path="reports/comparison" element={<ComparisonReport />} />
          <Route path="reports/profit" element={<ProfitReport />} />
          <Route path="reports/gstreport" element={<GSTReports />} />
          <Route path="products" element={<ProductAdmin />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="orders" element={<Orders />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="waste" element={<WasteManagement />} />
          <Route path="invoices" element={<Invoices />} />
          <Route path="shipping" element={<Shipping />} />
          <Route path="customers" element={<Customers />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<Settings />} />
          <Route path="staff" element={<StaffMembers />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="recurring-orders" element={<RecurringOrders />} />
        </Route>
      </Routes>
      <LoginPopup isOpen={showLogin} onClose={() => setShowLogin(false)} />
    </CartProvider>
  );
}

export default App;
