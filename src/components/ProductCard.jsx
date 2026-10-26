import { IoCartOutline } from "react-icons/io5";
import BASE_URL from "../config";

function ProductCard({ product }) {
  const imageUrl = product.image
    ? `${BASE_URL}/uploads/products/${product.image}`
    : "/placeholder.png";

  return (
    <div className="container product-card">
      <div className="product-image">
        <img
          src={imageUrl}
          alt={product.name}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "/placeholder.png";
          }}
        />
      </div>

      <div className="product-info">
        <h4>{product.name}</h4>
        <span className="product-weight">1 kg</span>

        <div className="product-bottom">
          <span className="price">₹{product.price}</span>

          <button className="cart-btn" type="button">
            <IoCartOutline size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
