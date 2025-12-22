const CategoryModel = require("../moddel/category_model.js") ; // ✅ Fix import path
const ProductModdle = require("../moddel/product-model.js");
const SubCategoryModel = require("../moddel/subCategory-model.js");


const AddCategoryController = async (req, res) => {
  try {
    const { name, image } = req.body;

    // Validate input fields
    if (!image || !name) {
      return res.status(400).json({
        message: "Please Enter required fields",
        error: true,
        success: false,
      });
    }

    // Create new category
    const addCategory = new CategoryModel({ name, image });
    const saveCategory = await addCategory.save();

    // If saving fails
    if (!saveCategory) {
      return res.status(500).json({
        message: "Failed to add category",
        error: true,
        success: false,
      });
    }

    // ✅ Success Response
    return res.json({
      message: "Category Added Successfully",
      data: saveCategory,
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


const getCategoryController = async(req, res) =>{

     try {
      const data = await CategoryModel.find();
      return res.json({
         data: data,
         error: false,
         success: true,
      })

     } catch (error) {
        return res.status(500).json({
          message: error.message || error,
          error: true,
          success: false,
        });
     }
}

const updateCetegory = async(req , res)=>{
  try {
     const { _id , name , image  } = req.body

     if (!_id) {
      return res.status(400).json({
        message: "Category ID is required",
        error: true,
        success: false,
      });
    }

     const updatedCategory = await CategoryModel.updateOne({
      _id: _id,
     },{
      name: name,
      image: image 
     })

     if (!updatedCategory) {
      return res.status(404).json({
        message: "Category not found",
        error: true,
        success: false,
      });
    }

     return res.json({
      message: "Category Updated Successfully",
      data: updatedCategory,
      error: false,
      success: true,
     })
  } catch (error) {
     return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
     })
  }
}

const deleteCategoryController = async (req, res) => {
  try {
   const { _id } = req.body;
   console.log("Received DELETE request with ID:", _id); 

   if (!_id) {
       return res.status(400).json({
         message: "Category ID is required",
         error: true,
         success: false,
       }); 
   }

   const checkSubCategory = await SubCategoryModel.find({ category: _id }).countDocuments();
   console.log(checkSubCategory)
   const checkProduct = await ProductModdle.find({ category: _id }).countDocuments(); // ✅ Fix Typo: `ProductModdle` → `ProductModel`
   console.log(checkProduct)
   if (checkSubCategory > 0 || checkProduct > 0) {
        return res.status(400).json({
         message: "Category is used in subcategory or product, cannot delete",
         error: true,
         success: false,
        });
   }
   
   const deleteCategory = await CategoryModel.deleteOne({ _id });

   return res.status(200).json({
     message: "Category Deleted Successfully",
     data: deleteCategory,
     error: false,
     success: true,
   });

  } catch (error) {
    console.error("Error in deleteCategoryController:", error); // 🔍 Log the error
    return res.status(500).json({
      message: error.message || "Internal Server Error",
      success: false,
      error: true,
    });
  }
  
};
module.exports = {
   AddCategoryController ,
   getCategoryController,
   updateCetegory,
   deleteCategoryController
  } 