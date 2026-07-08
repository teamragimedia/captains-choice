import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaChevronLeft, FaChevronRight, FaStar } from "react-icons/fa";
import "../styles/testimonials.css";

import user1 from "../assets/user1.png";
import user2 from "../assets/user2.png";
import user3 from "../assets/user3.png";

const data = [
  {
    name: "Raj Kumar",
    image: user1,
    text: "Captain's Choice has transformed our supply chain. The consistency in quality and on-time delivery has improved our operations significantly.",
  },
  {
    name: "Priya Sharma",
    image: user2,
    text: "The transparency in pricing and real-time tracking gives us complete control. We've reduced food wastage by 30% since switching.",
  },
  {
    name: "Amit Verma",
    image: user3,
    text: "Reliable sourcing and excellent service. Highly recommended for restaurants.",
  },
  {
    name: "Rahul Singh",
    image: user1,
    text: "Excellent sourcing and customer support. Highly recommended.",
  },
];

function Testimonials() {
  const [index, setIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(2);

  useEffect(() => {
    const updateView = () => {
      if (window.innerWidth < 768) {
        setCardsPerView(1);
      } else if (window.innerWidth < 1200) {
        setCardsPerView(2);
      } else {
        setCardsPerView(2);
      }
    };

    updateView();
    window.addEventListener("resize", updateView);

    return () => window.removeEventListener("resize", updateView);
  }, []);

  const maxIndex = Math.max(0, data.length - cardsPerView);

  const next = () => {
    setIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const prev = () => {
    setIndex((prev) => Math.max(prev - 1, 0));
  };

  return (
    <section className="cc-testimonials-section">
      <div className="cc-testimonials-container">
        <div className="cc-testimonials-content">
          <h2>Trusted by Industry Leaders</h2>

          <p>
            Hear from chefs and restaurant owners who’ve transformed their
            operations with Captain's Choice.
          </p>

          <div className="cc-testimonials-nav">
            <button onClick={prev}>
              <FaChevronLeft />
            </button>

            <button onClick={next}>
              <FaChevronRight />
            </button>
          </div>
        </div>

        <div className="cc-testimonials-slider">
          <motion.div
            className="cc-testimonials-track"
            animate={{
              x: `-${index * (100 / cardsPerView)}%`,
            }}
            transition={{
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {data.map((item, i) => (
              <div className="cc-testimonial-card" key={i}>
                <img src={item.image} alt={item.name} />

                <h3>{item.name}</h3>

                <p>{item.text}</p>

                <div className="cc-testimonial-stars">
                  {[...Array(5)].map((_, idx) => (
                    <FaStar key={idx} />
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
