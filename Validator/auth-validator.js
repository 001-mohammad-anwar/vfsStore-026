const {z} = require("zod");

const SignupSchema = z.object({
    username: z
        .string({required_error:"Name is required"})
        .trim()
        .min(3, {message:"Name must be at least 3 characters"})
        .max(255, {message:"Name must be at most 255 characters"}),
    email:z
      .string({required_error:"Email is required"})
      .trim()
      .min(3, {message:"Email must be at least 3 characters"})
      .max(255, {message:"Email must be at most 255 characters"}),
    // phone:z
    //     .string({required_error:"Phone is required"})
    //     .trim()
    //     .min(10, {message:"Phone must be at least 10 characters"})
    //     .max(20, {message:"Phone must be at most 20 characters"}),
    password:z
        .string({required_error:"Password is required"})
        .min(7, {message:"Password must be at least 7 characters"})
        .max(255, {message:"Password must be at most 255 characters"}),
    confirmPassword:z
        .string({required_error:"confirmPassword is required"})
        .min(7, {message:"Password must be at least 7 characters"})
        .max(255, {message:"Password must be at most 255 characters"}),

})

module.exports = SignupSchema;
