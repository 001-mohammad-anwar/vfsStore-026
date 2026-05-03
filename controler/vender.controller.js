const Vender = require("../moddel/vender-model.js");

const createVender = async (req, res) => {
  try {
    const { vendorName, shopeName, category, lat, lng, radius } = req.body;
    console.log(vendorName,lat, lng)
    if (!vendorName || !lat || !lng) {
      return res.status(404).json({
        message: "vandorName , lat , lang are required",
        success: false,
        error: true,
      });
    }

    const vander = await Vender.create({
      vendorName,
      shopeName,
      category,
      location: {
        type: "Point",
        coordinates: [lng, lat],
      },
     serviceRadius : radius || 5000,
    });

    if(!vander){
        return res.status(400).json({
            message : "failed to create vander or seller somthing went wrong",
            success : false,
            error : true
        })
    }

    return res.status(201).json({
        message : "vender or seller successfully added",
        data : vander,
        success : true,
        error : false
    })



  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
};


module.exports = {
    createVender
}