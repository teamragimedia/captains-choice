import { motion } from "framer-motion";
import {
  FaWarehouse,
  FaLeaf,
  FaSnowflake,
  FaShieldAlt,
  FaIndustry,
} from "react-icons/fa";
import "../styles/quality.css";

const item = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

function QualitySection() {
  return (
    <section className="quality">
      <div className="container">
        <h2>Quality at every step</h2>
        <p className="subtitle">Built on trust</p>

        {/* TOP 2 CARDS */}

        <div className="quality-row-two">
          <motion.div
            className="quality-card"
            variants={item}
            initial="hidden"
            whileInView="show"
            whileHover={{ y: -6 }}
          >
            <FaWarehouse className="icon" />

            <h3>Farm collection centres</h3>

            <p>
              We source directly from farmers, select the best produce at our
              collection centres and deliver it fresh to your doorstep.
            </p>
          </motion.div>

          <motion.div
            className="quality-card"
            variants={item}
            initial="hidden"
            whileInView="show"
            whileHover={{ y: -6 }}
          >
            <FaLeaf className="icon" />

            <h3>State-of-the-art food park</h3>

            <p>
              Enhance team productivity with our collaboration tools and work
              together seamlessly.
            </p>
          </motion.div>
        </div>

        {/* BOTTOM 3 CARDS */}

        <div className="quality-row-three">
          <motion.div
            className="quality-card"
            variants={item}
            initial="hidden"
            whileInView="show"
            whileHover={{ y: -6 }}
          >
            <FaShieldAlt className="icon" />

            <h3>Food safety compliant warehouse</h3>

            <p>
              Hygienic warehouses guarantee your supplies stay fresh and safe
              from start to finish.
            </p>
          </motion.div>

          <motion.div
            className="quality-card"
            variants={item}
            initial="hidden"
            whileInView="show"
            whileHover={{ y: -6 }}
          >
            <FaSnowflake className="icon" />

            <h3>Frozen supply chain</h3>

            <p>
              Temperature-controlled rooms and smart fleet ensure uninterrupted
              cooling at every step.
            </p>
          </motion.div>

          <motion.div
            className="quality-card"
            variants={item}
            initial="hidden"
            whileInView="show"
            whileHover={{ y: -6 }}
          >
            <FaIndustry className="icon" />

            <h3>Sustainability goes beyond the environment</h3>

            <p>
              Sustainability is at the core of our operations and shapes every
              decision we make.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default QualitySection;
