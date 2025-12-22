const express = require("express");
const uploadImageController = require("../controler/uploadImages-controller.js"); // ✅ Fix import (remove curly braces)
const authMiddleware = require("../Moddleware/auth-middleware.js"); // ✅ Fix folder name
const upload = require("../Moddleware/multer-middleware.js");

const uploadRouter = express.Router();

uploadRouter.route('/uploadImage').post(authMiddleware,upload.single("image"), uploadImageController);


module.exports = uploadRouter;
 