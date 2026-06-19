import { useNavigate } from "react-router-dom";
import BASE_URL from "../../config";

function ProductGrid({ products }) {
  const navigate = useNavigate();

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="grid">
      {products.map((p) => (
        <div className="card" key={p._id || p.id}>
          {/* IMAGE */}
          <div className="product-image">
            <img src={`${BASE_URL}/uploads/products/${p.image}`} alt={p.name} />
          </div>

          {/* BODY */}
          <div className="card-body">
            <h3>{p.name}</h3>

            <h4>{p.weight}</h4>

            <p>₹{p.price}</p>
          </div>

          {/* BUTTON */}
          <button onClick={() => handleProductClick(p._id || p.id)}>
            Add to Order
          </button>
        </div>
      ))}
    </div>
  );
}

export default ProductGrid;
