const express = require("express");
const router = express.Router();

const {
  getInventory,
  addInventoryMovement,
} = require("../controllers/inventoryController");

router.get("/", getInventory);

router.post("/", addInventoryMovement);

module.exports = router;
