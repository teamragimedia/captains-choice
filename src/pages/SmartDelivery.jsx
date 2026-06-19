import React from "react";
import { motion } from "framer-motion";
import {
  FaShoppingCart,
  FaTruck,
  FaCheckCircle,
  FaMapMarkerAlt,
} from "react-icons/fa";
import "../styles/smartDelivery.css";
import scooter from "../assets/scooter.png"; // use your image

const steps = [
  {
    icon: <FaShoppingCart />,
    title: "Place Order",
    desc: "Browse, select, and place your order in minutes",
  },
  {
    icon: <FaTruck />,
    title: "Fast Delivery",
    desc: "Get fresh supplies delivered within 24 hours",
  },
  {
    icon: <FaCheckCircle />,
    title: "Quality Check",
    desc: "Every product inspected for freshness & quality",
  },
  {
    icon: <FaMapMarkerAlt />,
    title: "Track & Receive",
    desc: "Real-time tracking and flexible delivery slots",
  },
];

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

function SmartDelivery() {
  return (
    <section className="container-fluid smart-delivery">
      <section className="delivery-section">
        <div className="delivery-container">
          {/* LEFT IMAGE */}
          <motion.div
            className="delivery-left"
            initial={{ x: -80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <img src={scooter} alt="delivery" />
          </motion.div>

          {/* RIGHT CONTENT */}
          <div className="delivery-right">
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Smart Delivery, Smarter Supply
            </motion.h2>

            <motion.p
              className="subtitle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Captain's Choice delivers fresh, quality supplies right to your
              kitchen with real-time tracking
            </motion.p>

            <motion.div
              className="steps"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {steps.map((step, i) => (
                <motion.div
                  key={i}
                  className="step-card"
                  variants={item}
                  whileHover={{
                    y: -8,
                    scale: 1.05,
                  }}
                >
                  <div className="icon">{step.icon}</div>
                  <h4>{step.title}</h4>
                  <p>{step.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>
    </section>
  );
}

export default SmartDelivery;
