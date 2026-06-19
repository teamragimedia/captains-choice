import React from "react";
import Topbar from "../components/topbar";
import Navbar from "../components/Navbar";
import FooterCTA from "../components/footerCTA";

const MainLayout = ({ children, openLogin, showTopbar = false }) => {
  return (
    <>
      {/* ✅ Only show on Home */}
      {showTopbar && <Topbar />}

      <Navbar openLogin={openLogin} />

      {children}

      <FooterCTA />
    </>
  );
};

export default MainLayout;
