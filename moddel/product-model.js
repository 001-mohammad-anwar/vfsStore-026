const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
    },

    image:{
       type: Array,
       default: [],

    },
    category:[
    {
       type: mongoose.Schema.ObjectId,
       ref : 'category',
    }
  ],
  subCategory : [
    {
        type: mongoose.Schema.ObjectId,
        ref : 'subCategory',
    }
  ], 
  
  unit : {
    type: String,
    default: ''
  },
  stock :{
    type: Number,
    default: 0
  },

  price:{
    type: Number,
    default: null
  },
  discount:{
    type: Number,
    default: null
  },
  description:{
    type: String,
    default: ''
  },
// ✅ Fix — allows storing a plain object
more_details: {
  type: Object,
  default: {}
},

  publish:{
    type:Boolean,
    default: true
  },

},{
    timestamps:true
}
)


// Create a text index with weights for better search relevance
productSchema.index(
  { name: "text", description: "text" },
  {
    weights: {
      name: 10,
      description: 5
    }
  }
);




const ProductModdle = mongoose.model('product', productSchema);

module.exports = ProductModdle;