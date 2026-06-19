import { useEffect, useState } from "react";
import API from "../../api";

import Breadcrumb from "./Breadcrumb";
import Sidebar from "./Sidebar";
import ProductGrid from "./ProductGrid";

import "./Shop.css";

// 🔥 normalize helper
const normalize = (str) => str.toLowerCase().replace(/&/g, "and").trim();

function Shop() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [category, setCategory] = useState("All Products");
  const [search, setSearch] = useState("");
  const [sortType, setSortType] = useState("popular");

  // ✅ Fetch products
  useEffect(() => {
    API.get("/products")
      .then((res) => {
        setProducts(res.data);
        setFiltered(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  //sort logic
  useEffect(() => {
    let temp = [...products];

    // Category filter
    if (category !== "All Products") {
      temp = temp.filter(
        (p) => p.category && normalize(p.category) === normalize(category),
      );
    }

    // Search
    if (search) {
      temp = temp.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase()),
      );
    }

    // 🔥 SORTING LOGIC
    if (sortType === "latest") {
      temp.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    if (sortType === "popular") {
      temp.sort((a, b) => (b.purchaseCount || 0) - (a.purchaseCount || 0));
    }

    if (sortType === "trending") {
      temp.sort((a, b) => (b.stockSold || 0) - (a.stockSold || 0));
    }

    setFiltered(temp);
  }, [category, search, products, sortType]);

  // ✅ Filter logic
  useEffect(() => {
    let temp = [...products];

    // Category filter
    if (category !== "All Products") {
      temp = temp.filter(
        (p) => p.category && normalize(p.category) === normalize(category),
      );
    }

    // Search filter
    if (search) {
      temp = temp.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase()),
      );
    }

    setFiltered(temp);
  }, [category, search, products]);

  return (
    <div className="shop-page">
      <Breadcrumb />

      {/* HEADER */}
      <div className="shop-header">
        <div className="shop-header-inner">
          <h1>Shop</h1>
          <p>Wholesale prices on 1000+ products. Shop by category</p>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="shop-container">
        <Sidebar
          selected={category}
          setCategory={setCategory}
          products={products} // 🔥 IMPORTANT
        />

        <div className="shop-right">
          {/* TOP BAR */}
          <div className="shop-top">
            <input
              type="text"
              placeholder="Search products..."
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              className="sort-dropdown"
              value={sortType}
              onChange={(e) => setSortType(e.target.value)}
            >
              <option value="popular">Popular</option>
              <option value="latest">Latest Products</option>
              <option value="trending">Trending Products</option>
            </select>
          </div>

          <p className="count">Showing {filtered.length} products</p>

          <ProductGrid products={filtered} />
        </div>
      </div>
    </div>
  );
}

export default Shop;
