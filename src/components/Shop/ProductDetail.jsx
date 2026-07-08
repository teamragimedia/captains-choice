import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import LoginPopup from "../../components/LoginPopup";
import BASE_URL from "../../config";

import {
  FaStar,
  FaShoppingCart,
  FaBolt,
  FaMinus,
  FaPlus,
  FaChevronRight,
  FaFileInvoice,
} from "react-icons/fa";

import { FaShieldAlt, FaAward, FaTruck, FaInfoCircle } from "react-icons/fa";

import API from "../../api";
import RelatedProducts from "./RelatedProducts";

import "./productDetail.css";

function ProductDetail() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [selectedPack, setSelectedPack] = useState(25);
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState("");
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await API.get(`/products/${id}`);

      setProduct(res.data);

      setMainImage(`${BASE_URL}/uploads/products/${res.data.image}`);
    } catch (error) {
      console.log(error);
    }
  };

  // ================= ADD TO CART =================

  const addToCart = async () => {
    const token = localStorage.getItem("token");
    const customerId = localStorage.getItem("customerId");

    console.log("token:", token);
    console.log("customerId:", customerId);
    console.log({
      Authorization: `Bearer ${token}`,
      customerid: customerId,
    });

    // NOT LOGGED IN
    if (!token || !customerId) {
      console.log("OPEN LOGIN POPUP");

      setShowLogin(true);

      return;
    }

    try {
      await API.post(
        "/cart/add",
        {
          product_id: product.id,
          quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            customerid: customerId,
          },
        },
      );

      alert("Added To Cart");

      window.dispatchEvent(new Event("storage"));

      window.location.reload();
    } catch (error) {
      console.log(error);

      if (error.response?.status === 401) {
        setShowLogin(true);
      }
    }
  };

  // ================= BUY NOW =================

  const buyNow = async () => {
    const customerId = localStorage.getItem("customerId");

    if (!customerId) {
      setShowLogin(true);
      return;
    }

    await addToCart();

    navigate("/cart");
  };

  if (!product) {
    return <h2>Loading...</h2>;
  }

  const unitPrice = product.price || 0;
  const subtotal = unitPrice * quantity;
  const savings = quantity * 100;

  const galleryImages = [product.image, product.image, product.image];

  return (
    <>
      {/* LOGIN POPUP */}

      <LoginPopup isOpen={showLogin} onClose={() => setShowLogin(false)} />

      <div className="product-detail-page">
        {/* YOUR EXISTING PAGE CONTENT */}

        <div className="product-detail-wrapper">
          <div className="product-detail-left">
            <div className="product-main-image">
              <img src={mainImage} alt={product.name} />
            </div>

            <div className="product-thumbnails">
              {galleryImages.map((img, index) => (
                <img
                  key={index}
                  src={`${BASE_URL}/uploads/products/${img}`}
                  alt="thumb"
                  onClick={() =>
                    setMainImage(`${BASE_URL}/uploads/products/${img}`)
                  }
                />
              ))}
            </div>
          </div>

          <div className="product-detail-right">
            <h1 className="product-title">{product.name}</h1>

            <div className="product-rating">
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStar />
              <span>4.8</span>
            </div>

            <div className="product-price-box">₹{unitPrice}</div>

            <h4 className="product-label">Select Pack Size</h4>

            <div className="product-pack-buttons">
              {[10, 25, 50].map((size) => (
                <button
                  key={size}
                  className={selectedPack === size ? "active" : ""}
                  onClick={() => setSelectedPack(size)}
                >
                  {size} kg
                </button>
              ))}
            </div>

            <h4 className="product-label">Quantity</h4>

            <div className="product-quantity-box">
              <button
                onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
              >
                <FaMinus />
              </button>

              <span>{quantity}</span>

              <button onClick={() => setQuantity(quantity + 1)}>
                <FaPlus />
              </button>
            </div>

            <div className="product-summary">
              <div className="product-summary-row">
                <span>Unit Price:</span>
                <b>₹{unitPrice}</b>
              </div>

              <div className="product-summary-row">
                <span>Pack Size:</span>
                <b>{selectedPack}kg</b>
              </div>

              <div className="product-summary-row">
                <span>Quantity:</span>
                <b>{quantity}</b>
              </div>

              <div className="product-summary-row">
                <span>Subtotal:</span>
                <b>₹{subtotal.toLocaleString()}</b>
              </div>

              <div className="product-save">
                You Save: ₹{savings.toLocaleString()}
              </div>
            </div>

            <div className="product-buttons">
              <button className="product-cart-btn" onClick={addToCart}>
                <FaShoppingCart />
                Add To Cart
              </button>

              <button className="product-buy-btn" onClick={buyNow}>
                <FaBolt />
                Buy Now
              </button>
            </div>
          </div>
        </div>

        <RelatedProducts
          currentProductId={product.id}
          category={product.category}
        />
      </div>
    </>
  );
}

export default ProductDetail;
