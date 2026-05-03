const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema({
  vanderName: String,
  
  shopeName :{
    type : String,
  },


  category: [
    {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category"
  }
],

  location: {
    type: {
      type: String,
      enum: ["Point"],
      required: true
    },



    coordinates: {
      type: [Number], // [lng, lat]
      required: true
    }
  },

  serviceRadius: {
    type: Number, // meters (e.g. 5000 = 5km)
    default: 5000
  },

  isActive: {
    type: Boolean,
    default: true
  }

}, { timestamps: true });

// 🔥 VERY IMPORTANT
vendorSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Vendor", vendorSchema);