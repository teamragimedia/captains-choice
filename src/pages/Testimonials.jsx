import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaChevronLeft, FaChevronRight, FaStar } from "react-icons/fa";
import "../styles/testimonials.css";

// 👉 Replace with your images
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
    name: "Amit Verma",
    image: user1,
    text: "Reliable sourcing and excellent service. Highly recommended for restaurants.",
  },
];

const CARD_WIDTH = 340; // 320 + gap

function Testimonials() {
  const [index, setIndex] = useState(0);

  const next = () => {
    if (index < data.length - 1) setIndex(index + 1);
  };

  const prev = () => {
    if (index > 0) setIndex(index - 1);
  };

  return (
    <section className="testimonials">
      <div className="container testimonials-wrapper">
        {/* LEFT */}
        <div className="left">
          <h2>Trusted by Industry Leaders</h2>
          <p>
            Hear from chefs and restaurant owners who’ve transformed their
            operations with Captain’s Choice
          </p>

          <div className="buttons">
            <button onClick={prev}>
              <FaChevronLeft />
            </button>
            <button onClick={next}>
              <FaChevronRight />
            </button>
          </div>
        </div>

        {/* RIGHT */}
        <div className="right">
          <motion.div
            className="track"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={(e, info) => {
              if (info.offset.x < -80 && index < data.length - 1) next();
              if (info.offset.x > 80 && index > 0) prev();
            }}
            animate={{ x: -index * CARD_WIDTH }}
            transition={{ type: "spring", stiffness: 120 }}
          >
            {data.map((item, i) => (
              <div className="card" key={i}>
                <img src={item.image} alt={item.name} />
                <h3>{item.name}</h3>
                <p>{item.text}</p>

                <div className="stars">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} />
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
