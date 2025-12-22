const express = require("express");
const router = express.Router();
const userController = require("../controler/user-controller");
const authMiddleware = require("../Moddleware/auth-middleware");
const upload = require("../Moddleware/multer-middleware");

router.route("/registration").post(userController.registerUserContriller);
router.route("/verify-email").post(userController.verifyEmailController);
router.route("/login").post(userController.login);
router.route("/logout").get(authMiddleware , userController.logoutController);
router.put(
    "/upload-avatar",
    authMiddleware,
    upload.single("avatar"), // Ensure `avatar` matches frontend key
    userController.uploadAvatar
  );
router.route("/update-user").put(authMiddleware, userController.updateUserDetails );
router.route("/forgot-password").put(userController.forgotPassword);
router.route("/verify-forgot-password-otp").put(userController.verifyForgotPasswordOtp);
router.route("/reset-password").put(userController.resetPassword);
router.route("/refreshToken").post(userController.refreshToken);
router.route("/user-details").get(authMiddleware , userController.getUserDetails);

module.exports = router;
