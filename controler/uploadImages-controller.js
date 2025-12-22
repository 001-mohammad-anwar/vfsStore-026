const uploadImageCloudinary = require("../Utils/uploadImageClodinary.js");

const uploadImageController = async(req, res) => {
    try {
    
        const file = req.file
        const uploadImage = await uploadImageCloudinary(file)

        return res.json({
            message : "Upload done",
            data : uploadImage,
            success : true,
            error : false
        })


    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            success: false,
            error: true
        });
    }
};

module.exports = uploadImageController;