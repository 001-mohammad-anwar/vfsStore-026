const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadImageCloudinary = async (image) => {
  try {
    if (!image || !image.buffer) throw new Error("No valid image file provided");

    return await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "BfsStore" },
        (error, result) => {  
          if (error) {
            console.error("Cloudinary Upload Error:", error);
            return reject(new Error("Cloudinary upload failed: " + error.message));
          }
          resolve(result);
        }
      );

      uploadStream.end(image.buffer); // ✅ Send image buffer to Cloudinary
    });
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    throw new Error("Image upload failed: " + error.message);
  }
};

module.exports = uploadImageCloudinary;
