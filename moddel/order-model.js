const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    orderId: {
        type: String,
        required: [true, "Provide orderId"],
        unique: true
    },

    // Cart Snapshot
    snapshot: {
        items: [
            {
                productId: { type: mongoose.Schema.Types.ObjectId, ref: 'product' },
                name: String,
                image: [String],
                qty: Number,
                price: Number,
                mrp: Number
            }
        ],
        billing: {
            subTotal: Number,
            total: Number
        }
    },

    payment_id: {
        type: String,
        default: '',
    },
    payment_status: {
        type: String,
        default: '',
    },

    order_status: {
        type: String,
        enum: ['Placed', 'Confirmed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'],
        default: 'Placed'
    },

    delivery_address: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AddressModel',
    },

    invoice_receipt: {
        type: String,
        default: '',
    }

}, {
    timestamps: true
});

const OrderModel = mongoose.model('order', orderSchema);

module.exports = OrderModel;
