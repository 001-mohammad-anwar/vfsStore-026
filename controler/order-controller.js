const CartProductModel = require("../moddel/cartProduct-model");
const OrderModdle = require("../moddel/order-model");
const UserModel = require("../moddel/user-model");
const mongoose = require("mongoose");

const CashOnDeleveryController = async (req, res) => {
  try {
    const userId = req.userID;
    const { list_item, totalAmt, addressId, subTotalAmt } = req.body;

    if (!list_item || !Array.isArray(list_item) || list_item.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    const payload = list_item.map((el) => {
      const snapshot = {
        items: list_item.map(item => ({
          productId: item.productId._id,
          name: item.productId.name,
          image: item.productId.image,
          qty: item.qty,
          price: item.productId.price,
          mrp: item.productId.mrp
        })),
        billing: {
          subTotal: subTotalAmt,
          total: totalAmt
        }
      };

      return {
        userId: userId,
        orderId: `ORD-${new mongoose.Types.ObjectId().toString()}`,
        productId: el.productId._id,
        product_details: {
          name: el.productId.name,
          image: el.productId.image,
        },
        payment_id: "",
        payment_status: "CASH ON DELIVERY",
        dilivery_address: addressId,
        subTotalAmt: subTotalAmt || totalAmt,
        totalAmt: totalAmt,
        snapshot: snapshot // ⬅ snapshot save
      };
    });

    const generateOrder = await OrderModdle.insertMany(payload);

    // remove all item from the cart
    await CartProductModel.deleteMany({ userId: userId });
    await UserModel.updateOne({ _id: userId }, { shopping_cart: [] });

    const io = req.app.get("io");
    if (io) {
      io.emit("newOrder", generateOrder);
    }

    return res.json({
      message: "Order Successfull",
      error: false,
      success: true,
      data: generateOrder,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
};

const getOrderController = async (req, res) => {
    try {
        const orders = await OrderModdle.find({ userId: req.userID })
            .sort({ createdAt: -1 })
            .populate({
                path: "delivery_address", // spelling सही किया
                model: "AddressModel" // ref match किया
            });

        return res.json({
            message: "Order details",
            success: true,
            data: orders,
        });

    } catch (error) {
        console.error("Get Orders Error:", error);
        return res.status(500).json({
            message: error.message || "Something went wrong",
            success: false,
        });
    }
};



const cancelOrderController = async (req, res) => {
    try {
        const userId = req.userID; // middleware se mil raha h
        const { orderId } = req.body;

        if (!orderId) {
            return res.status(400).json({
                message: "Order ID is required",
                error: true,
                success: false
            });
        }

        // Find order in DB
        const order = await OrderModdle.findOne({
            orderId: orderId,
            userId: userId
        });


        if (!order) {
            return res.status(404).json({
                message: "Order not found",
                success: false,
                error: true
            });
        }

        // If already cancelled
        if (order.order_status === "Cancelled") {
            return res.status(400).json({
                success: false,
                message: "Order is already cancelled"
            });
        }

        // Update status
        order.order_status = "Cancelled";
        await order.save();

        // Socket emit if io exists
        const io = req.app.get('io');
        if (io) {
            io.emit('orderCancelled', order);
        }

        return res.json({
            message: "Order cancelled successfully",
            success: true,
            error: false,
            data: order.snapshot
        });

    } catch (error) {
        console.error("Cancel order error:", error);
        return res.status(500).json({
            message: error.message || error,
            success: false,
            error: true
        });
    }
};


module.exports = { CashOnDeleveryController , getOrderController , cancelOrderController };
