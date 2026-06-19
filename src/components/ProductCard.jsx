import { IoCartOutline } from "react-icons/io5";
import BASE_URL from "../config";

function ProductCard({ product }) {
  return (
    <div className="container product-card">
      <div className="product-image">
        <img
          src={`${BASE_URL}/uploads/products/${product.image}`}
          alt={product.name}
        />

        {/* <img src={`/products/${product.image}`} alt={product.name} /> */}
      </div>

      <div className="product-info">
        <h4>{product.name}</h4>
        <span className="product-weight">1 kg</span>

        <div className="product-bottom">
          <span className="price">₹{product.price}</span>

          <button className="cart-btn">
            <IoCartOutline size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
