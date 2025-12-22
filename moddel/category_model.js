const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
     
    name:{
        type: 'string',
        default: ''
    },
    image:{
        type: 'string',
        default: ''
    },

},{
    timestamps: true
})

const CategoryModel = mongoose.model('category', categorySchema);

module.exports = CategoryModel;