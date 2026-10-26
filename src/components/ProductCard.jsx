import { IoCartOutline } from "react-icons/io5";
import { IMAGE_BASE_URL } from "../config";

function ProductCard({ product }) {
  const imageUrl = product?.image
    ? `${IMAGE_BASE_URL}/uploads/products/${product.image}`
    : "/placeholder.png";

  return (
    <div className="container product-card">
      <div className="product-image">
        <img
          src={imageUrl}
          alt={product?.name || "Product"}
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = "/placeholder.png";
          }}
        />
      </div>

      <div className="product-info">
        <h4>{product?.name}</h4>
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
