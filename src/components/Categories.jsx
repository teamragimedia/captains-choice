import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import API from "../api";

import { motion } from "framer-motion";

import "../styles/categories.css";

const container = {
  hidden: {},

  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const item = {
  hidden: {
    opacity: 0,
    y: 30,
  },

  show: {
    opacity: 1,
    y: 0,

    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

function Categories() {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/categories/active")
      .then((res) => {
        console.log("Categories API Response:", res.data);

        if (Array.isArray(res.data)) {
          setCategories(res.data);
        } else if (Array.isArray(res.data.categories)) {
          setCategories(res.data.categories);
        } else {
          console.error("Categories is not an array:", res.data);
          setCategories([]);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <section className="categories">
      <div className="container">
        <h2>Our Categories</h2>

        <p>Everything your professional kitchen needs, all in one place</p>

        <motion.div
          className="category-grid"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {Array.isArray(categories) &&
            categories.map((cat) => (
              <motion.div
                key={cat.id}
                variants={item}
                whileHover={{
                  y: -8,
                  scale: 1.03,
                }}
                className="category-card"
                style={{
                  background: cat.color,
                }}
                onClick={() =>
                  navigate(`/shop?category=${encodeURIComponent(cat.name)}`)
                }
              >
                <div className="categories-icon">{cat.icon}</div>

                <span>{cat.name}</span>
              </motion.div>
            ))}
        </motion.div>
      </div>
    </section>
  );
}

export default Categories;
