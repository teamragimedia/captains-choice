import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { motion } from "framer-motion";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { BsAward } from "react-icons/bs";
import { FiCheckCircle } from "react-icons/fi";
import basket from "../assets/hero-basket.png";
import banner3 from "../assets/banner3.png";
import g1 from "../assets/g1.jpg";
import g2 from "../assets/g2.jpg";
import g3 from "../assets/g3.jpg";
import g4 from "../assets/g4.jpg";
import g5 from "../assets/g5.jpg";

import "swiper/css";
import "swiper/css/navigation";

import "../styles/hero.css";
import { video } from "framer-motion/client";

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.18 },
  },
};

const item = {
  hidden: { opacity: 0, y: 40, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7 },
  },
};

export default function HeroSlider() {
  return (
    <section className="hero">
      <div className="slider-arrow left">
        <IoChevronBack />
      </div>

      <div className="slider-arrow right">
        <IoChevronForward />
      </div>

      <Swiper
        modules={[Navigation, Autoplay]}
        slidesPerView={1}
        loop={true}
        speed={900}
        autoplay={{ delay: 5000 }}
        navigation={{
          prevEl: ".left",
          nextEl: ".right",
        }}
      >
        {/* ================= SLIDE 1 ================= */}

        <SwiperSlide>
          <div className="slide slide1">
            <div className="container hero-grid">
              <motion.div
                className="hero-left"
                variants={container}
                initial="hidden"
                animate="show"
              >
                <motion.div variants={item} className="badge">
                  <BsAward color="#FFA631" size={18} />
                  Trusted by 500+ Restaurants across India
                </motion.div>

                <motion.h1 variants={item}>
                  All your restaurant needs delivered instantly
                </motion.h1>

                <motion.p variants={item}>
                  Wholesale prices. Reliable delivery. 4000+ Premium products.
                  GST invoices.
                </motion.p>

                <motion.button
                  variants={item}
                  whileHover={{ scale: 1.05 }}
                  className="btn-primary"
                >
                  Explore Shop
                </motion.button>
              </motion.div>

              <motion.div
                className="hero-right"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
              >
                <img src={basket} alt="hero" />
              </motion.div>
            </div>
          </div>
        </SwiperSlide>

        {/* ================= SLIDE 2 ================= */}

        <SwiperSlide>
          <div className="slide slide2">
            <div className="container hero-grid">
              {/* LEFT SIDE */}

              <motion.div
                className="hero-left"
                variants={container}
                initial="hidden"
                animate="show"
              >
                <motion.h1 variants={item}>
                  End-to-end Logistics and warehousing for restaurants
                </motion.h1>

                <motion.p variants={item}>Seamless Supply Chain</motion.p>

                <motion.div variants={item} className="btn-group">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-primary"
                  >
                    Browse Catalog
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-outline"
                  >
                    Contact Us
                  </motion.button>
                </motion.div>

                <motion.div variants={item} className="features">
                  <span>
                    <FiCheckCircle color="#FFA631" size={18} />
                    Free Delivery above ₹5,000
                  </span>

                  <span>
                    <FiCheckCircle color="#FFA631" size={18} />
                    GST Invoice Available
                  </span>
                </motion.div>
              </motion.div>

              {/* RIGHT SIDE GALLERY */}

              <motion.div
                className="hero-gallery-custom"
                variants={container}
                initial="hidden"
                animate="show"
              >
                <motion.img variants={item} src={g1} className="g g1" />
                <motion.img variants={item} src={g5} className="g g2" />
                <motion.img variants={item} src={g3} className="g g3" />
                <motion.img variants={item} src={g4} className="g g4" />
                <motion.img variants={item} src={g2} className="g g5" />
              </motion.div>
            </div>
          </div>
        </SwiperSlide>

        {/* ================= SLIDE 3 ================= */}

        <SwiperSlide>
          <div className="slide slide3">
            <div className="container hero-full">
              <div className="hero-left">
                <motion.h1 variants={item}>From Farm to Table</motion.h1>

                <motion.p variants={item}>
                  We source directly from farmers and deliver fresh produce to
                  your doorstep.
                </motion.p>

                {/* <motion.button
                  variants={item}
                  whileHover={{ scale: 1.05 }}
                  className="btn-primary"
                >
                  Know More
                </motion.button> */}
              </div>
              {/* 👇 IMAGE OUTSIDE hero-left */}
              <motion.img
                variants={item}
                src={banner3}
                className="banner3"
                whileHover={{ scale: 1.02 }}
              />
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </section>
  );
}
