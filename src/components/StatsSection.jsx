import CountUp from "react-countup";
import { motion } from "framer-motion";

import "../styles/stats.css";

export default function StatsSection() {
  return (
    <section className="stats">
      <div className="container stats-grid">
        <motion.div
          className="stat"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h2>
            <CountUp end={115} duration={2} />+
          </h2>
          <p>Cities we're active in</p>
        </motion.div>

        <motion.div
          className="stat"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h2>
            <CountUp end={1} duration={2} /> Lakh+
          </h2>
          <p>Partners trust us</p>
        </motion.div>

        <motion.div
          className="stat"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h2>
            <CountUp end={1.1} decimals={1} duration={2} /> Crore+
          </h2>
          <p>Orders delivered</p>
        </motion.div>

        <motion.div
          className="stat"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
        >
          <h2>
            <CountUp end={600} duration={2} />+
          </h2>
          <p>Seller brands listed</p>
        </motion.div>
      </div>
    </section>
  );
}
