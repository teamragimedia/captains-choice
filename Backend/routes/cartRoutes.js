const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/Auth");

const {
  getCart,
  addToCart,
  updateCart,
  removeCartItem,
} = require("../controllers/cartController");

// GET CART
router.get("/", authMiddleware, getCart);

// ADD TO CART
router.post("/add", authMiddleware, addToCart);

// UPDATE CART
router.put("/update", authMiddleware, updateCart);

// REMOVE ITEM
router.delete("/:productId", authMiddleware, removeCartItem);

module.exports = router;
