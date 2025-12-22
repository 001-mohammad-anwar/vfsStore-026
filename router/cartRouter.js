const express = require('express');
const authMiddleware = require('../Moddleware/auth-middleware.js');
const { cartProductController, getCartItemController, updateCartItemQty, DeleteCartItem, mergeGuestCart } = require('../controler/cart-controller.js');
const cartRouter = express.Router();

cartRouter.route("/create").post(authMiddleware, cartProductController)
cartRouter.route("/get").get(authMiddleware, getCartItemController)
cartRouter.route("/update").put(authMiddleware, updateCartItemQty)
cartRouter.route("/delete-Item").delete(authMiddleware, DeleteCartItem)
cartRouter.route("/merge").post(authMiddleware, mergeGuestCart)



module.exports = cartRouter  