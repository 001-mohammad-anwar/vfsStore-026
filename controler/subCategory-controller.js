const SubCategoryModel = require("../moddel/subCategory-model.js");

const AddSubCategoryController = async (req, res) => {
  try {
    const { name, image, category } = req.body;
    if (!name && !image && !category[0]) {
      return res.status(400).json({
        message: "Please provide name, image and category",
        error: true,
        success: false,
      });
    }

    const subCategory = new SubCategoryModel({
      name,
      image,
      category,
    });

  
    const result = await subCategory.save();

    return res.status(200).json({
      message: "Subcategory added successfully",
      data: result,
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


// controllers/subCategoryController.js
const getSubCategroyController = async (req, res) => {
  try {
    // Get page and limit from query parameters, with default values
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;

    const skip = (page - 1) * limit;

    // Get total count of subcategories
    const totalSubCategories = await SubCategoryModel.countDocuments();

    // Get paginated subcategories
    const subcategories = await SubCategoryModel.find()
      .populate("category") // if you're referencing categories
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }); // optional: newest first

    // Calculate total pages
    const totalPages = Math.ceil(totalSubCategories / limit);

    return res.json({
      success: true,
      error: false,
      data: {
        subcategories,
        totalPages,
        currentPage: page,
        totalSubCategories,
      },
    });
  } catch (error) {
    console.error("Error fetching paginated subcategories:", error.message);
    return res.status(500).json({
      success: false,
      error: true,
      message: "Failed to fetch subcategories.",
    });
  }
};



const updateSubCategoryController = async(request, response)=>{
  const { _id, name,image, category } = request.body

  const checkSub = await SubCategoryModel.findById(_id)

  if(!checkSub){
    return response.status(400).json({
      message :"chek your _id",
      error : true,
      success : false
    })
  }

  const updateSubCategory = await SubCategoryModel.findByIdAndUpdate(_id,{
    name,
    image,
    category
  })

  return response.json({
    message : "Updated Successfully",
    data : updateSubCategory,
    error :false,
    success: true

  })
}

const deleteSubCategoryController = async(request, response)=>{
    const {_id} = request.body;
    const deleteSub = await SubCategoryModel.findByIdAndDelete(_id)

    return response.json({
      message: "Delete Successfully",
      data: deleteSub,
      success: true,
      error : false
    })
}
module.exports = {
  AddSubCategoryController,
  getSubCategroyController,
  updateSubCategoryController,
  deleteSubCategoryController
};
