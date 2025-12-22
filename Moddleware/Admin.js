const UserModel = require("../moddel/user-model.js");

const admin = async (req, res, next) => {
    try {
        const userId = req.userID; // ✅ Adjust based on your auth middleware

     

        if (!userId) {
            return res.status(401).json({
                message: "Unauthorized: User ID not found",
                error: true,
                success: false
            });
        }

        const user = await UserModel.findById(userId);
      //   console.log("user",user)

        if (!user || user.role !== 'Admin') {
            return res.status(403).json({
                message: "Permission denied",
                error: true,
                success: false
            });
        }

        next();
    } catch (error) {
        console.error("Admin middleware error:", error);
        return res.status(500).json({
            message: "Internal server error",
            error: true,
            success: false
        });
    }
};

module.exports = admin;
