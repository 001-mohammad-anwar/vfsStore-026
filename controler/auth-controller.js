
const User = require('../moddel/user-model');
const bcrypt = require('bcryptjs');
// home route

const home = async (req, res) => {
    try {
       res.status(200).send("Welcome to the Home page from auth controller ") 
    } catch (error) {
       res.status(400).send({msg:"home page is not available"})
}
}

// registration route

const registration = async (req, res) => {
    try {
        // console.log(req.body);
        const { username, email, password, confirmPassword } = req.body;

        // Check if passwords match
        if (password !== confirmPassword) {
            return res.status(400).json({ msg: "Passwords do not match" });
        }

        // Check if user exists
        const userExist = await User.findOne({ email });
        if (userExist) {
            return res.status(400).json({ msg: "User already exists" });
        }


        // Create user (without confirmPassword)
        const newUser = await User.create({
            username,
            email,
            password,
            confirmPassword,
        });

        // Sanitize response (exclude sensitive data)
        res.status(201).json({
            msg: "User registered successfully",
            user: { username: newUser.username, email: newUser.email , password:newUser.password},
            token: await newUser.generateToken(),
            userId:newUser._id.toString(),
        });
 
    } catch (error) {
         next(error)
        // res.status(500).json({ msg: "Registration failed", error: error.message });
    }
};

// SignIn route 

const login = async (req, res) => {
    try {
      const { email, password, confirmPassword } = req.body;
       
      // Check if user exists
      const userExist = await User.findOne({ email });


      if (!userExist) {
        return res.status(400).json({ message: "Invalid email " }); // Consistent message
      }
  
      // Validate password
      const isPasswordValid = await userExist.comparePassword(password);
      
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid password" }); // Consistent message
      } 
  
      // Successful login
      return res.status(200).json({ 
        message: "Login successful",
        token: await userExist.generateToken(),
        userId: userExist._id.toString(),
      });
  
    } catch (error) {
      res.status(500).json({ message: "Internal server error" }); // JSON object
    }
  };

  
  // to send user data / User Logic

  const user = async (req, res) => {
  
    try {
      const userData = req.user;
      console.log(userData);
      return res.status(200).json({ msg: userData })
      
    } catch (error) {
      console.log(`error from the user route ${error}`);
    }
  }





module.exports = {home, registration , login , user}