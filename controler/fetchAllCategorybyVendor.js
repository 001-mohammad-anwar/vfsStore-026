const User = require("../moddel/user-model.js");
const ServiceArea = require("../moddel/serviceAreamodel.js");
const Vendor = require("../moddel/vender-model.js")
const Category = require("../moddel/category_model.js");
const Product = require("../moddel/product-model.js")

const getCategoriesSmart = async (req, res) => {
  try {
    const { lat, lng, userId } = req.body;

    // 🔹 STEP 1: Sab categories fetch karo (UI ke liye)
    const allCategories = await Category.find();
    const allProduct = await Product.find()
    console.log(allProduct);
   
    let vendors = [];

    // 🔹 STEP 2: Geo-based search (agar lat/lng hai)
    if (lat && lng) {
      vendors = await Vendor.find({
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [Number(lng), Number(lat)],
            },
            $maxDistance: 5000,
          },
        },
        isActive: true,
      });
    }

    // 🔹 STEP 3: Fallback (pincode based)
    if (!vendors.length && userId) {
      const user = await User.findById(userId);

      if (user?.pincode) {
        vendors = await Vendor.find({
          pincode: user.pincode,
          isActive: true,
        });
      }
    }

    // 🔹 STEP 4: Available categories ka set banao
    const availableCategoryIds = new Set();

    vendors.forEach((vendor) => {
      if (Array.isArray(vendor.category)) {
        vendor.category.forEach((catId) => {
          availableCategoryIds.add(catId.toString());
        });
      }
    });

    console.log("response" , allCategories);

    // 🔹 STEP 5: Final response prepare karo
    const response = allCategories.map((cat) => ({
      name: cat.name,
      icon: `Icons.${cat.icon}`,
      category: cat.category,

      // 🔥 yahi main logic hai
      active: availableCategoryIds.has(cat._id.toString()),
    }));

    return res.status(200).json({
      success: true,
      totalCategories: allCategories.length,
      availableCategoriesCount: availableCategoryIds.size,
      data: response,
    });

  } catch (err) {
    return res.status(500).json({
      message: err.message,
      success: false,
    });
  }
};

module.exports = { getCategoriesSmart };

