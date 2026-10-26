import { IoCartOutline } from "react-icons/io5";
import BASE_URL from "../config";

function ProductCard({ product }) {
  const imageUrl = product?.image
    ? `${BASE_URL}/uploads/products/${product.image}`
    : "/placeholder.png";

  return (
    <div className="container product-card">
      <div className="product-image">
        <img
          src={imageUrl}
          alt={product?.name || "Product"}
          onError={(event) => {
            const img = event.currentTarget;

            // Prevent repeatedly trying to load the same failed image.
            if (!img.src.endsWith("/placeholder.png")) {
              img.onerror = null;
              img.src = "/placeholder.png";
            } else {
              img.onerror = null;
              img.style.visibility = "hidden";
            }
          }}
        />
      </div>

      <div className="product-info">
        <h4>{product?.name || "Product"}</h4>
        <span className="product-weight">1 kg</span>

        <div className="product-bottom">
          <span className="price">₹{product?.price ?? 0}</span>

          <button className="cart-btn" type="button" aria-label="Add to cart">
            <IoCartOutline size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
