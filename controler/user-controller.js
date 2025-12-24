const User = require("../moddel/user-model");
const bcrypt = require("bcryptjs");
const sendEmail = require("../config/sendEmail");
const verifyEmailTemplate = require("../Utils/verifyEmailTemplate");
const { response } = require("express");
const generateOtp = require("../Utils/generateOtp.js");
const forgotPasswordTemplate = require("../Utils/forgotPasswordTemplate.js");
const jwt = require('jsonwebtoken');
const uploadImageCloudinary = require('../Utils/uploadImageClodinary.js'); 

// const sendEmail = require('../config/sendEmail');

const registerUserContriller = async (req, res) => {
  try {
    // console.log(req.body);
    const { username, email, password, confirmPassword, mobile } = req.body;

    // Check if passwords match
    if (!username || !email || !password || !confirmPassword) {
      return res.status(400).json({
        msg: "provided email, name , passsword",
        error: true,
        success: false,
      });
    }

    // Check if user exists
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({
        msg: "User already exists",
        erorr: true,
        success: false,
      });
    }

    const payload = {
      username,
      email,
      password,
      confirmPassword,
      mobile,
    };

    const newUser = await User(payload);
    // Save user to database
    const save = await newUser.save();

    const verifyEmailUrl = `${process.env.FRONTEND_URL}/verify-email?code=${save?._id}`;

    // Send verification email
    await sendEmail({
      sendTo: email,
      subject: "Verify your email - BinkeyIT",
      html: verifyEmailTemplate({
        username,
        url: verifyEmailUrl,
      }),
    });

    // Sanitize response (exclude sensitive data)
    return res.status(201).json({
      msg: "User registered successfully",
      error: false,
      success: true,
      user: save,
      token: await newUser.generateToken(),
      userId: newUser._id.toString(),
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Registration failed",
      error: error.message,
      error: true,
      success: false,
    });
  }
};
const verifyEmailController = async (req, res) => {
  try {
    const { code } = req.body;
    const user = await User.findOne({ _id: code });

    if (!user) {
      return res.status(404).json({
        msg: "Invalid code",
        error: true,
        success: false,
      });
    }

    const updateuser = await User.updateOne(
      { _id: code },
      {
        verify_email: true,
      }
    );

    return res.status(200).json({
      message: "Verification email updated successfully",
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
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "provide email or password",
        success: false,
        error: true,
      });
    }

    // Check if user exists
    const userExist = await User.findOne({ email });
   
    if (!userExist) {
      return res.status(400).json({
        message: "User not found",
        error: true,
        success: false,
      });
    }

    // Check if user status is active
    if (userExist.status !== "Active") {
      return res.status(400).json({
        message: "Contact the admin to activate your account",
        error: true,
        success: false,
      });
    }

    // Validate password
    const isPasswordValid = await userExist.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid credentials",
        error: true,
        success: false,
      });
    }

    // Generate tokens
    const accesstoken = await userExist.generateToken();
    const refreshToken = await userExist.generateRefreshToken();
    
    const updateUserdate = await User.findByIdAndUpdate(userExist.id,{
      last_login_date : new Date()
    })
    // Set cookie options
    const cookiesOption = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };

    // Set cookies
    res.cookie("accessToken", accesstoken, cookiesOption);
    res.cookie("refreshToken", refreshToken, cookiesOption);

    // Successful login response
    return res.status(200).json({
      message: "Login successful",
      token: accesstoken,
      refreshToken: refreshToken,
      userId: userExist._id.toString(),
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal server error",
      error: true,
      success: false,
    });
  }
};
const logoutController = async (req, res) => {
  try {
    const userId = req.userID;
    // console.log("userID", userId);
    // Set cookie options
    const cookiesOption = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };

    // Clear cookies
    res.clearCookie("accessToken", cookiesOption);
    res.clearCookie("refreshToken", cookiesOption);

    await User.findByIdAndUpdate(userId, {
      refresh_token: "",
    });
    // Successful logout response
    return res.status(200).json({
      message: "Logout successful",
      error: false,
      success: true,
    });
  } catch (error) {
    console.error("Error in logoutController:", error);
    return res.status(500).json({
      message: error.message || "Internal server error",
      error: true,
      success: false,
    });
  }
};

// upload user avtar


const uploadAvatar = async (req, res) => {
  try {
     
    const userId = req.userID;
    const avatar = req.file;

    if (!req.file) {
      return res.status(400).json({ error: true, message: "No file uploaded" });
    }
   
    console.log("Received Image:", req.file);
    // Upload to Cloudinary
    const uploadResult = await uploadImageCloudinary(avatar);
    console.log("Uploaded:", uploadResult);
    const updateUser = await User.findByIdAndUpdate(userId, {
      avatar: uploadResult.url
    })

    return res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      _id : userId,
      imageUrl: uploadResult.secure_url, // ✅ Cloudinary returns `secure_url`
    });
  } catch (error) {
    console.error("Upload Error:", error);
    return res.status(500).json({
      message: error.message || "Image upload failed",
      error: true,
      success: false,
    });
  }
};

// update user details
const updateUserDetails = async (req, res) => {
  try {
    const userId = req.userID; // This is coming from auth middleware
    const { username, email, password, mobile } = req.body;

    let hashpassword;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      hashpassword = await bcrypt.hash(password, salt); // Use `password` from req.body
    }

    const updateData = {
      ...(username && { username }),
      ...(email && { email }),
      ...(mobile && { mobile }),
      ...(hashpassword && { password: hashpassword }), // Only include if password is provided
    };
  
    const updateUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true } // Return the updated document
    );
   
    console.log("Updated User:", updateUser);
    if (!updateUser) {
      return res.status(404).json({
        message: "User not found",
        error: true,
        success: false,
      });
    }

    return res.json({
      message: "User updated successfully",
      error: false,
      success: true,
      data: updateUser,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal server error",
      error: true,
      success: false,
    });
  }
};

// user forgotPassword

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        error: true,
        success: false,
      });
    }

    const otp = generateOtp();
    const expireTime = new Date() + 60 * 60 * 1000; // 1hr


    const update = await User.findByIdAndUpdate(user._id, {
      frogot_password_otp: otp,
      forgot_password_expiry: new Date(expireTime).toISOString(),
    });

    await sendEmail({
      sendTo: email,
      subject: "Password Reset OTP",
      html: forgotPasswordTemplate({
        name: user.username,
        otp: otp,
      }),
    });

    // Send OTP via SMS (if user has a phone number)
    if (user.phone) {
      await sendSMS({
        to: user.phone, // User's phone number
        message: forgotPasswordTemplate({
        name: user.username,
        otp: otp,
      }),
      });
    }

    return res.json({
      message: "Otp sent to your email",
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

// verify otp

const verifyForgotPasswordOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({
        message: "Email and OTP are required",
        error: true,
      });
    }

    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        error: true,
        success: false,
      });
    }

    const curretTime = new Date().toISOString();
    if (user.forgot_password_expiry < curretTime) {
      return res.status(400).json({
        message: "OTP has expired",
        error: true,
      });
    }

    if (otp !== user.frogot_password_otp) {
      return res.status(400).json({
        message: "Invalid otp",
        error: true,
        success: false,
      });
    }

    const updateUserOtp =await User.findByIdAndUpdate(user?._id,{
      frogot_password_otp: "",
      forgot_password_expiry: "",
    })

    // if otp is not expire
    return res.status(200).json({
      message: "verify otp successfully",
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

// reset the password

const resetPassword = async (req, res) => {
  try {
    const { email, newpassword, confirm_password } = req.body;
    if (!email || !newpassword || !confirm_password) {
      return res.status(400).json({
        messsage:
          "provide required fields email,  newpassword, confirm_password",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "User not found",
        error: true,
        success: false,
      });
    }

    if (newpassword !== confirm_password) {
      return res.status(400).json({
        message: "password and confirm password does not match",
        error: true,
        success: false,
      });
    }

    if (newpassword) {
      const salt = await bcrypt.genSalt(10);
      hashpassword = await bcrypt.hash(newpassword, salt); // Use `password` from req.body
    }

    const update = await User.findOneAndUpdate(user._id, {
      password: hashpassword,
    });

    return res.json({
      message: "Password updated successfully",
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

// refresh Token controller
const refreshToken = async (req, res) => {
  try {
    // Extract refresh token from cookies or Authorization header
    const authHeader = req.header("Authorization");
    const refreshToken = req.cookies?.refreshToken || (authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null);

    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token is required", error: true });
    }

    console.log("Received Refresh Token:", refreshToken);
    console.log("REFRESH_TOKEN_SECRET_KEY:", process.env.REFRESH_TOKEN_SECRET_KEY);

    // Debug: Decode the token before verifying
    const decoded = jwt.decode(refreshToken, { complete: true });
    console.log("Decoded Token:", decoded);

    // Verify token
    let verifyToken;
    try {
      verifyToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET_KEY);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Refresh token expired", error: true });
      }
      return res.status(400).json({ message: "Invalid refresh token", error: true });
    }



    // Find user
    const user = await User.findById(verifyToken.id);
    if (!user) {
      return res.status(404).json({ message: "User not found", error: true });
    }

    // Generate new access token
    const newAccessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: "15m" });
    const cookiesOption = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };
    
    res.cookie("accessToken", newAccessToken, cookiesOption)

    return res.json({
      message: "new access token generated successfully",
      success: true,
      accessToken: newAccessToken,
    });

  } catch (error) {
    console.error("Error in refreshToken:", error);
    return res.status(500).json({ message: error.message || "Internal Server Error", error: true });
  }
};

//get login user details
const getUserDetails = async (req, res) => {
  try {
    const userId = req.userID
    const user = await User.findById(userId).select('-password -refresh_token')
    return res.json({
      message: "User details fetched successfully",
      data: user,
      success: true,
      error: false
    })
  } catch (error) {
     return res.status(500).json({
      message: "Something went wrong",
      error: true,
      success: false

     })
  }
}


module.exports = {
  registerUserContriller,
  verifyEmailController,
  login,
  logoutController,
  uploadAvatar,
  updateUserDetails,
  forgotPassword,
  verifyForgotPasswordOtp,
  resetPassword,
  refreshToken,
  getUserDetails
};
