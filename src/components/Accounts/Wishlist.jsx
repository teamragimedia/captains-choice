import React, { useEffect, useState } from "react";
import API from "../../api";

const Wishlist = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = () => {
    API.get("/api/wishlist/my").then((res) => {
      setItems(Array.isArray(res.data) ? res.data : []);
    });
  };

  const removeItem = (id) => {
    API.delete(`/api/wishlist/${id}`).then(fetchWishlist);
  };

  const orderNow = (item) => {
    API.post("/api/orders/create", {
      productId: item.productId,
      quantity: 1,
    }).then(() => {
      alert("Order placed!");
    });
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3>Wishlist</h3>
        <span>{items.length} products</span>
      </div>

      {items.length === 0 ? (
        <p>No wishlist items</p>
      ) : (
        items.map((item) => (
          <div className="wishlist-card" key={item._id}>
            {/* LEFT */}
            <div className="wishlist-left">
              <div className="wishlist-img">📦</div>

              <div>
                <h4>{item.productName}</h4>
                <p>₹{item.price}/kg</p>
                <p>Added: {item.addedDate}</p>

                <span className={`stock ${item.stockStatus}`}>
                  {item.stockStatus}
                </span>
              </div>
            </div>

            {/* RIGHT */}
            <div className="wishlist-actions">
              <button onClick={() => orderNow(item)}>Order Now</button>
              <button className="delete" onClick={() => removeItem(item._id)}>
                🗑
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Wishlist;
