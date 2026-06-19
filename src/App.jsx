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
import AccessibilityStatement from "./pages/AccessibilityStatement";

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
import Shop from "./components/shop/Shop";
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
import SalesReport from "./admin/reports/SalesReport";
import PurchaseReport from "./admin/reports/PurchaseReport";
import TransactionReport from "./admin/reports/TransactionReport";
import ComparisonReport from "./admin/reports/ComparisonReport";
import ProfitReport from "./admin/reports/ProfitReport";
import GSTReports from "./admin/Reports/GSTReports";
import PurchaseAdmin from "./pages/admin/PurchaseAdmin";

// CONTEXT
import { CartProvider } from "./context/CartContext";

// Styles
import "./index.css";

// ================= HOME PAGE =================

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

// ================= APP =================

function App() {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <CartProvider>
      {/* TOAST */}
      <Toaster position="top-right" />

      <ScrollToTop />
      {/* ROUTES */}
      <Routes>
        {/* HOME */}
        <Route
          path="/"
          element={
            <MainLayout openLogin={() => setShowLogin(true)} showTopbar={true}>
              <HomePage />
            </MainLayout>
          }
        />

        {/* SHOP */}
        <Route
          path="/shop"
          element={
            <MainLayout openLogin={() => setShowLogin(true)}>
              <Shop />
            </MainLayout>
          }
        />

        {/* contact */}
        <Route
          path="/contact"
          element={
            <MainLayout openLogin={() => setShowLogin(true)}>
              <Contact />
            </MainLayout>
          }
        />
        <Route
          path="/terms-and-conditions"
          element={
            <MainLayout openLogin={() => setShowLogin(true)}>
              <TermsConditions />
            </MainLayout>
          }
        />

        <Route
          path="/privacy-policy"
          element={
            <MainLayout openLogin={() => setShowLogin(true)}>
              <PrivacyPolicy />
            </MainLayout>
          }
        />

        <Route
          path="/refund-policy"
          element={
            <MainLayout openLogin={() => setShowLogin(true)}>
              <RefundPolicy />
            </MainLayout>
          }
        />

        <Route
          path="/shipping-policy"
          element={
            <MainLayout openLogin={() => setShowLogin(true)}>
              <ShippingPolicy />
            </MainLayout>
          }
        />

        <Route
          path="/accessibility-statement"
          element={
            <MainLayout openLogin={() => setShowLogin(true)}>
              <AccessibilityStatement />
            </MainLayout>
          }
        />
        {/* ABOUT */}
        <Route
          path="/about"
          element={
            <MainLayout openLogin={() => setShowLogin(true)}>
              <h1 className="text-3xl font-bold text-center py-20">
                About Us - Coming Soon!
              </h1>
            </MainLayout>
          }
        />

        {/* PRODUCT DETAILS */}
        <Route
          path="/product/:id"
          element={
            <MainLayout openLogin={() => setShowLogin(true)}>
              <ProductPage />
            </MainLayout>
          }
        />

        {/* CART */}
        <Route
          path="/cart"
          element={
            <MainLayout openLogin={() => setShowLogin(true)}>
              <CartPage />
            </MainLayout>
          }
        />

        {/* ACCOUNT */}
        <Route
          path="/account"
          element={
            <MainLayout openLogin={() => setShowLogin(true)}>
              <Account />
            </MainLayout>
          }
        />

        {/* ADMIN LOGIN */}
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* ADMIN PANEL */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />

          <Route path="/admin/purchases" element={<PurchaseAdmin />} />

          <Route path="approvals" element={<Approvals />} />
          <Route path="approvals/:id" element={<ApprovalDetails />} />

          <Route path="categories" element={<CategoriesAdmin />} />

          {/* REPORTS */}
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

      {/* LOGIN POPUP */}
      <LoginPopup isOpen={showLogin} onClose={() => setShowLogin(false)} />
    </CartProvider>
  );
}

export default App;
