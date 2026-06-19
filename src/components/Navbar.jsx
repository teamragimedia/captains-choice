import { Link, useNavigate } from "react-router-dom";
import { IoCartOutline, IoMenu, IoClose } from "react-icons/io5";
import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";
import logo1 from "../assets/logo1.png";
import "../styles/navbar.css";
import { CartContext } from "../context/CartContext";

function Navbar({ openLogin }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const { cartCount } = useContext(CartContext);

  const { user, logout } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleLogout = () => {
    // auth context logout
    logout();

    // clear all stored data
    localStorage.clear();

    // refresh CartContext
    window.dispatchEvent(new Event("storage"));

    setDropdownOpen(false);

    navigate("/");

    window.location.reload();
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* LOGO */}

        <Link to="/" className="logo">
          <img src={logo1} alt="logo" className="logo" />
        </Link>

        {/* MOBILE */}

        <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <IoClose size={28} /> : <IoMenu size={28} />}
        </div>

        {/* MENU */}

        <motion.div className={`menu ${menuOpen ? "active" : ""}`}>
          <motion.div
            whileHover={{
              scale: 1.1,
            }}
          >
            <Link to="/shop">Shop</Link>
          </motion.div>

          <motion.div
            whileHover={{
              scale: 1.1,
            }}
          >
            <Link to="/products">For Vendors</Link>
          </motion.div>

          <motion.div
            whileHover={{
              scale: 1.1,
            }}
          >
            <Link to="/contact">Contact</Link>
          </motion.div>
        </motion.div>

        {/* RIGHT */}

        <div className="nav-right">
          {user ? (
            <div className="account-dropdown">
              <button
                className="login-btn"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                My Account ▾
              </button>

              {dropdownOpen && (
                <div className="dropdown-menu">
                  <div
                    className="dropdown-item"
                    onClick={() => {
                      navigate("/account");

                      setDropdownOpen(false);
                    }}
                  >
                    Profile
                  </div>

                  <div className="dropdown-item" onClick={handleLogout}>
                    Logout
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button className="login-btn" onClick={openLogin}>
              Login / Signup
            </button>
          )}

          {/* CART */}

          <Link to="/cart" className="cart-icon">
            <IoCartOutline size={24} />

            <span className="cart-badge">{cartCount}</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
