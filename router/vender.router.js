const express = require("express");
const router = express.Router();
const {createVender} = require("../controler/vender.controller.js");
const authMiddleware = require("../Moddleware/auth-middleware");
// const upload = require("../Moddleware/multer-middleware");

router.route("/createvender").post(createVender)

module.exports = router