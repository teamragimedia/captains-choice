import React, { useEffect, useState } from "react";

import API from "../../api";

const normalize = (str) => str?.toLowerCase().replace(/&/g, "and").trim();

function Sidebar({ selected, setCategory, products }) {
  const [categories, setCategories] = useState([]);

  // 🔥 FETCH CATEGORIES FROM DB
  useEffect(() => {
    API.get("/categories")
      .then((res) => {
        // Extract names
        const names = res.data.map((c) => c.name);
        setCategories(["All Products", ...names]);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // 🔥 COUNT FUNCTION
  const getCount = (catName) => {
    if (catName === "All Products") return products.length;

    return products.filter(
      (p) => p.category && normalize(p.category) === normalize(catName),
    ).length;
  };

  return (
    <div className="sidebar">
      <h4>Categories</h4>

      <div className="category-list">
        {categories.map((cat) => {
          const count = getCount(cat);

          return (
            <div
              key={cat}
              className={`category-item ${selected === cat ? "active" : ""}`}
              onClick={() => setCategory(cat)}
            >
              <span className="cat-name">{cat}</span>
              <span className="count">({count})</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Sidebar;
