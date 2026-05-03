const express = require("express");
const router = express.Router();

const { getCategoriesSmart } = require("../controler/fetchAllCategorybyVendor.js");

// 🔥 POST (kyunki body me lat/lng aa raha hai)
router.post("/getCategorysmart", getCategoriesSmart);

module.exports = router;