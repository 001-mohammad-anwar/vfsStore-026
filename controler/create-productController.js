const { response } = require("express");
const productModel = require("../moddel/product-model");

const CreateProductController = async (req, res) => {
  try {
    const {
      name,
      image,
      category,
      subCategory,
      unit,
      stock,
      price,
      discount,
      description,
      more_details,
    } = req.body;

    if (
      !name ||
      !image[0] ||
      !category[0] ||
      !subCategory[0] ||
      !unit ||
      !stock ||
      !price ||
      !description
    ) {
      return res.status(400).json({
        message: "Enter  required feild",
        success: false,
        error: true,
      });
    }

    const product = new productModel({
      name,
      image,
      category,
      subCategory,
      unit,
      stock,
      price,
      discount,
      description,
      more_details,
    });

    const saveProduct = await product.save();

    return res.status(200).json({
      message: "Product Created Successfully",
      data: saveProduct,
      error: false,
      success: true,
    });
  } catch (error) {
    return (
      res.status(500),
      json({
        message: error.message || error,
        error: true,
        success: false,
      })
    );
  }
};

const getProductController = async (req, res) => {
  try {
    let { page = 1, limit = 10, search = "" } = req.body;

    const skip = (page - 1) * limit;

    const query = search
      ? {
          name: { $regex: search, $options: "i" }, // case-insensitive partial match
        }
      : {};

    const [data, totalCount] = await Promise.all([
      productModel
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("category subCategory"),
      productModel.countDocuments(query),
    ]);

    return res.json({
      message: "Product data",
      error: false,
      success: true,
      totalCount: totalCount,
      totalPage: Math.ceil(totalCount / limit),
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

const getProductByCategory = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({
        message: "Provide category id",
        error: true,
        success: false,
      });
    }

    // Ensure `id` is an array for $in to work properly
    const categoryIds = Array.isArray(id) ? id : [id];

    const product = await productModel
      .find({
        category: { $in: categoryIds },
      })
      .limit(15);

    return res.json({
      message: "Category product list",
      data: product,
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || String(error),
      error: true,
      success: false,
    });
  }
};

const getProductByCategoryAndSubCategory = async (req, res) => {
  try {
    const { categoryId, subCategoryId, page, limit } = req.body;

    if (!categoryId || !subCategoryId) {
      return res.status(400).json({
        message: "Provide category and SubCategoryId",
        error: true,
        success: false,
      });
    }

    const pageNumber = page || 1;
    const limitNumber = limit || 10;

    const query = {
      category: { $in: categoryId },
      subCategory: { $in: subCategoryId },
    };

    const skip = (pageNumber - 1) * limitNumber;

    const [data, dataCount] = await Promise.all([
      productModel
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNumber),
      productModel.countDocuments(query),
    ]);

    return res.json({
      message: "Product list",
      data,
      totalcount: dataCount,
      page: pageNumber,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

const getProductDetails = async (req, res) => {
  try {
    const { productId } = req.body;

    const product = await productModel.findOne({ _id: productId });
    return res.json({
      message: "product Details",
      data: product,
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

// update product
const updateProductDetail = async (req, res) => {
  try {
    const { _id } = req.body;
    if (!_id) {
      return res.status(400).json({
        message: "Provide Product _id",
        error: true,
        success: false,
      });
    }

    const updateProduct = await productModel.updateOne(
      { _id: _id },
      { ...req.body }
    );

    return res.json({
      message: "update successfully",
      data: updateProduct,
      success: true,
      error: false,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

// delete product
const deleteProductDetails = async (req, res) => {
  try {
    const { _id } = req.body;
    if (!_id) {
      return res.status(400).json({
        message: "provided _id",
        error: true,
        success: flase,
      });
    }

    const deleteProduct = await productModel.deleteOne({ _id: _id });

    return res.json({
      message: "Delete successfully",
      error: false,
      success: true,
      data: deleteProduct,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

// search Product
const searchProduct = async (req, res) => {
  try {
    const { search, page = 1, limit = 10 } = req.body;
    console.log(search);

const query = search
  ? search.length >= 5
    ? { $text: { $search: search } } // Full-text search for longer input
    : { name: { $regex: search.split("").join(".*"), $options: "i" } } // Regex for short input
  : {};


    const skip = (page - 1) * limit;

    const [data, dataCount] = await Promise.all([
      productModel
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("category subCategory"),
      productModel.countDocuments(query),
    ]);

    return res.json({
      message: "Product data",
      error: false,
      success: true,
      totalPage: Math.ceil(dataCount / limit),
      data: data,
      totalCount: dataCount,
      page: page,
      limit: limit,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
};

module.exports = {
  CreateProductController,
  getProductController,
  getProductByCategory,
  getProductByCategoryAndSubCategory,
  getProductDetails,
  updateProductDetail,
  deleteProductDetails,
  searchProduct,
};
