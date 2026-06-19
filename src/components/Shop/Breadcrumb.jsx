import { Link } from "react-router-dom";
import "./Shop.css";

const Breadcrumb = () => {
  return (
    <div className="shop-breadcrumb-wrapper">
      <div className="shop-breadcrumb-container">
        <Link to="/">Home</Link>
        <span className="divider"> / </span>
        <span>Shop</span>
      </div>
    </div>
  );
};

export default Breadcrumb;
