const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    address_line:{
        type: "string",
        default: ''
    },
    city:{
        type: "string",
        default:"",
    },
    state:{
        type: "string",
        default:"",
    },
    pincode:{
        type: "string",

    },
    country:{
        type: "string",
    },
    mobile:{
        type: Number,
        default: null,
    },
    status:{
        type: Boolean,
        default: true,
    },
    userId : {
        type: mongoose.Schema.ObjectId,
        default: "",
    }

},{
    timestamps: true
});

const AddressModel = mongoose.model('AddressModel' ,addressSchema)



module.exports = AddressModel