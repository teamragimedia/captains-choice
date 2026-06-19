const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    res.json([]);
  } catch (error) {
    console.log(error);
    res.status(500).json([]);
  }
});

module.exports = router;
