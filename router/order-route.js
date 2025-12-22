const express = require('express');
const authMiddleware = require('../Moddleware/auth-middleware');
const { CashOnDeleveryController, getOrderController, cancelOrderController } = require('../controler/order-controller');
const OrderRouter = express.Router();


OrderRouter.route('/cash-on-delevery').post(authMiddleware , CashOnDeleveryController)
OrderRouter.route('/get-OrderDetails').get(authMiddleware , getOrderController)
OrderRouter.route('/cancel-order').put(authMiddleware , cancelOrderController)


module.exports = OrderRouter