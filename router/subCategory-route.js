const express = require('express');
const authMiddleware = require('../Moddleware/auth-middleware.js');
const { AddSubCategoryController, getSubCategroyController, updateSubCategoryController, deleteSubCategoryController } = require('../controler/subCategory-controller');

const subCategoryRouter = express.Router();

subCategoryRouter.route('/subCategory').post(authMiddleware, AddSubCategoryController)
subCategoryRouter.route("/getSubCategory").post(getSubCategroyController);
subCategoryRouter.route("/updateCategory").put(authMiddleware, updateSubCategoryController)
subCategoryRouter.route("/DeleteSubCategory").delete(authMiddleware, deleteSubCategoryController)


module.exports = subCategoryRouter
