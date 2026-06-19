import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";

import { Navigation } from "swiper/modules";

import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import API from "../api";

import "../styles/product.css";

function ProductCarousel({ title, subtitle, category }) {
  const [products, setProducts] = useState([]);

  // 🔥 make category safe for CSS class
  const safeCategory = category
    ?.toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/&/g, "and");

  useEffect(() => {
    API.get("/products", {
      params: { category },
      headers: {
        "Cache-Control": "no-cache",
      },
    })
      .then((res) => {
        console.log(category, res.data);
        setProducts(res.data);
      })
      .catch((err) => console.error(err));
  }, [category]);

  return (
    <section className="container product-section">
      {/* HEADER */}
      <div className="product-header">
        <div>
          <h2>{title}</h2>
          <span>{subtitle}</span>
        </div>

        <a className="see-all">See all ›</a>
      </div>

      {/* SLIDER */}
      <div className="carousel-wrapper">
        {/* ✅ UNIQUE BUTTONS */}
        <div className={`custom-prev prev-${safeCategory}`}>&#10094;</div>
        <div className={`custom-next next-${safeCategory}`}>&#10095;</div>

        <Swiper
          spaceBetween={20}
          slidesPerView={4}
          navigation={{
            nextEl: `.next-${safeCategory}`,
            prevEl: `.prev-${safeCategory}`,
          }}
          modules={[Navigation]}
          breakpoints={{
            320: { slidesPerView: 1.3, spaceBetween: 10 },
            480: { slidesPerView: 2.2, spaceBetween: 12 },
            768: { slidesPerView: 3, spaceBetween: 15 },
            1024: { slidesPerView: 4, spaceBetween: 20 },
          }}
        >
          {products.length > 0 ? (
            products.map((p) => (
              <SwiperSlide key={p.id || p.name}>
                <ProductCard product={p} />
              </SwiperSlide>
            ))
          ) : (
            <p style={{ padding: "20px" }}>No products found</p>
          )}
        </Swiper>
      </div>
    </section>
  );
}

export default ProductCarousel;
