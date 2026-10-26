import { useNavigate } from "react-router-dom";
import { IMAGE_BASE_URL } from "../../config";

function ProductGrid({ products = [] }) {
  const navigate = useNavigate();

  const handleProductClick = (productId) => {
    if (productId) {
      navigate(`/product/${productId}`);
    }
  };

  return (
    <div className="grid">
      {products.map((p) => {
        const productId = p._id || p.id;

        const imageUrl = p.image
          ? `${IMAGE_BASE_URL}/uploads/products/${p.image}`
          : "/placeholder.png";

        return (
          <div className="card" key={productId}>
            {/* IMAGE */}
            <div className="product-image">
              <img
                src={imageUrl}
                alt={p.name || "Product"}
                onError={(event) => {
                  const img = event.currentTarget;
                  img.onerror = null;
                  img.src = "/placeholder.png";
                }}
              />
            </div>

            {/* BODY */}
            <div className="card-body">
              <h3>{p.name}</h3>
              <h4>{p.weight}</h4>
              <p>₹{p.price}</p>
            </div>

            {/* BUTTON */}
            <button
              type="button"
              onClick={() => handleProductClick(productId)}
              disabled={!productId}
            >
              Add to Order
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default ProductGrid;
