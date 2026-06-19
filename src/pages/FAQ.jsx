import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronDown } from "react-icons/fa";
import "../styles/faq.css";

const faqData = [
  {
    q: "What is Captain's Choice?",
    a: "Captain's Choice is a premium supply service delivering fresh and quality kitchen essentials with real-time tracking.",
  },
  {
    q: "How do I place an order?",
    a: "You can browse products, add them to your cart, and complete checkout in just a few clicks.",
  },
  {
    q: "What is your delivery timeline?",
    a: "We deliver within 24 hours depending on your location and selected slot.",
  },
  {
    q: "How do you ensure product quality?",
    a: "Every product undergoes strict quality checks before dispatch.",
  },
  {
    q: "What payment options are available?",
    a: "We support UPI, credit/debit cards, and net banking.",
  },
  {
    q: "Can I track my delivery in real-time?",
    a: "Yes, real-time tracking is available after order confirmation.",
  },
  {
    q: "What is your return & replacement policy?",
    a: "You can request returns or replacements within 24 hours of delivery.",
  },
  {
    q: "How can I become a partner supplier?",
    a: "You can register through our partner program page.",
  },
];

function FAQ() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggle = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="faq-section">
      <div className="faq-container">
        <h2>Frequently Asked Questions</h2>
        <p className="subtitle">
          Everything you need to know about Captain's Choice and our services
        </p>

        <div className="faq-list">
          {faqData.map((item, index) => (
            <div
              key={index}
              className={`faq-item ${activeIndex === index ? "active" : ""}`}
              onClick={() => toggle(index)}
            >
              <div className="faq-question">
                <span>{item.q}</span>
                <FaChevronDown className="icon" />
              </div>

              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    className="faq-answer"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p>{item.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        <div className="faq-bottom">
          <p>Still have questions?</p>
          <button>Contact Our Support Team</button>
        </div>
      </div>
    </section>
  );
}

export default FAQ;
