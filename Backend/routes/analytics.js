const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    res.json({
      salesGrowth: 12,
      userGrowth: 18,
      wasteReduction: 8,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({});
  }
});

module.exports = router;
