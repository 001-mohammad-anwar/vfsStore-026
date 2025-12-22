const express = require('express');
const authMiddleware = require('../Moddleware/auth-middleware');
const { addAddressController, getAddressController, updateAddressController, deleteAddressController } = require('../controler/address.controller');
const Addressrouter = express.Router();

Addressrouter.route("/add-address").post(authMiddleware, addAddressController)
Addressrouter.route("/get-address").get(authMiddleware, getAddressController)
Addressrouter.route("/update-address").put(authMiddleware, updateAddressController)
Addressrouter.route("/delete-address").delete(authMiddleware, deleteAddressController)

module.exports = Addressrouter; 