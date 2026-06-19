const Tabs = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { key: "profile", label: "Business Profile" },
    { key: "addresses", label: "Addresses" },
    { key: "orders", label: "Orders" },
    { key: "recurring", label: "Recurring Orders" },
    { key: "billing", label: "Billing & Invoices" },
    { key: "wishlist", label: "Wishlist" },
  ];

  return (
    <div className="tabs">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          className={activeTab === tab.key ? "active" : ""}
          onClick={() => setActiveTab(tab.key)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default Tabs;
