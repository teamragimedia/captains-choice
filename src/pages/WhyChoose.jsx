import "../styles/whyChoose.css";
import { motion } from "framer-motion";
import checkIcon from "../assets/svg.png";

function WhyChoose() {
  const data = [
    {
      icon: "🌱",
      title: "Sustainability First",
      desc: "20% in-house produce ensuring freshness and consistency with eco-friendly practices",
    },
    {
      icon: "🔒",
      title: "Tech-Enabled Sourcing",
      desc: "Real-time traceability from farm to kitchen with transparent, reliable delivery",
    },
    {
      icon: "⭐",
      title: "Quality Guaranteed",
      desc: "Handpicked suppliers and rigorous quality checks for premium ingredients",
    },
  ];

  return (
    <section className="why-section">
      <div className="container why-container">
        {/* HEADER */}
        <motion.div
          className="why-header"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2>Why Choose Captain’s Choice?</h2>
          <p>
            We combine innovation, transparency, and reliability to redefine
            HoReCa procurement
          </p>
        </motion.div>

        {/* CARDS */}
        <div className="why-grid">
          {data.map((item, index) => (
            <motion.div
              className="why-card"
              key={index}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: index * 0.2, // 🔥 stagger effect
              }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
            >
              <motion.div
                className="why-icon"
                whileHover={{ scale: 1.2, rotate: 5 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                {item.icon}
              </motion.div>

              <h3>{item.title}</h3>
              <p>{item.desc}</p>

              <motion.div className="learn-more" whileHover={{ x: 5 }}>
                <img src={checkIcon} alt="check" />
                <span>Learn more</span>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WhyChoose;
