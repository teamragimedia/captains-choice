import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api";
import BASE_URL from "../../config";

import "./relatedProducts.css";

function RelatedProducts({ currentProductId, category }) {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);

  // FETCH RELATED PRODUCTS
  useEffect(() => {
    fetchRelatedProducts();
  }, [category, currentProductId]);

  const fetchRelatedProducts = async () => {
    try {
      console.log("Category:", category);

      const res = await API.get(
        `/products?category=${encodeURIComponent(
          category.trim().toLowerCase(),
        )}`,
      );

      console.log("API response:", res.data);

      const filtered = res.data.filter(
        (item) =>
          item.id !== currentProductId &&
          item.category?.trim().toLowerCase() ===
            category?.trim().toLowerCase(),
      );

      setProducts(filtered.slice(0, 4));
    } catch (error) {
      console.log("Error fetching products:", error);
    }
  };

  // OPEN PRODUCT DETAILS
  // NAVIGATE
  const handleProductClick = (id) => {
    navigate(`/product/${id}`);
  };

  // ADD TO CART

  const handleAddToCart = async (product) => {
    try {
      const token = localStorage.getItem("token");

      await API.post(
        "/cart/add",
        {
          product_id: product.id,
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // notify navbar/cart context
      window.dispatchEvent(new Event("cartUpdated"));

      alert("Added to cart");
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="related-section">
      <h2>Related Products</h2>

      <p className="related-subtitle">Similar items from {category}</p>

      <div className="related-grid">
        {products.map((item) => (
          <div
            className="related-card"
            key={item.id}
            onClick={() => handleProductClick(item.id)}
          >
            {/* IMAGE */}
            <div className="related-image-box">
              <img
                src={`${BASE_URL}/uploads/products/${item.image}`}
                alt={item.name}
              />
            </div>

            {/* CONTENT */}
            <div className="related-content">
              <p className="related-category">{item.category}</p>

              <h3 className="related-name">{item.name}</h3>

              <p className="related-price">₹{item.price}</p>

              <button
                type="button"
                className="related-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToCart(item);
                }}
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RelatedProducts;
