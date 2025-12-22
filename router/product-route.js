const express = require('express');
const authMiddleware = require('../Moddleware/auth-middleware');
const {CreateProductController , getProductController, getProductByCategory, getProductByCategoryAndSubCategory, getProductDetails, updateProductDetailsController, updateProductDetail, deleteProductDetails, searchProduct} = require('../controler/create-productController');
const admin = require('../Moddleware/Admin')
const router = express.Router();

router.route('/create-product').post(authMiddleware , CreateProductController)
router.route('/get-product').post(getProductController)
router.route('/get-product-by-category').post(getProductByCategory)
router.route('/get-product-by-category-and-subcategory').post(getProductByCategoryAndSubCategory)
router.route('/get-product-Details').post( getProductDetails) 
router.route('/update-ProductData').put(authMiddleware,admin,updateProductDetail)
router.route('/delete-productDetails').delete(authMiddleware,admin,deleteProductDetails)
router.route('/search-product').post(authMiddleware,admin, searchProduct)

module.exports = router  