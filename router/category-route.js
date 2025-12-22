const express = require('express');
const authMiddleware = require('../Moddleware/auth-middleware');
const { AddCategoryController, getCategoryController, updateCetegory, deleteCategoryController } = require('../controler/category-controller');
const router = express.Router();

router.route('/add-category').post(authMiddleware, AddCategoryController)

router.route('/get-categories').get(getCategoryController)

router.route('/update-categories').put(authMiddleware, updateCetegory )
router.route('/delete-category').delete(authMiddleware, deleteCategoryController);


module.exports = router;    