const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
   username: {
        type: String,
        required: [true, "Username is required"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true // Ensure email is unique
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    avatar: {
        type: String,
        default: ""
    },
    mobile: {
        type: Number,
        default: null
    },
    refresh_token: {  // ✅ FIXED: Changed `type: string` to `type: String`
        type: String,
        default: ""
    },

    verify_email: {
        type: Boolean,
        default: false
    },

    last_login_date: { // ✅ FIXED: Default should be `null`
        type: Date,
        default: null
    },
    
    status: {  // ✅ FIXED: Changed `type: string` to `type: String`
        type: String,
        enum: ["Active", "Inactive", "Suspended"],
        default: "Active"
    },

    address_details: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "address"  
        }
    ],
    shopping_cart: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "cartProduct" 
        }
    ],
    orderHistory: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "order" 
        }
    ], 

    frogot_password_otp: {
        type: String,
        default: null
    },

    forgot_password_expiry: {  // ✅ FIXED: Default should be `null`
        type: Date,
        default: null
    },

    role: {  // ✅ FIXED: Changed `type: string` to `type: String`
        type: String,
        enum: ['ADMIN', 'USER'],
        default: "USER"
    },
    
    isAdmin: {
        type: Boolean,
        default: false
    }
},{
    timestamps: true
});

// ✅ Virtual field for confirmPassword (not stored in DB)
userSchema.virtual('confirmPassword')
    .get(function () { return this._confirmPassword; })
    .set(function (value) { this._confirmPassword = value; });

// ✅ Validate confirmPassword matches password
userSchema.pre('validate', function (next) {
    if (this.isModified('password') && this.password !== this.confirmPassword) {
        this.invalidate('confirmPassword', 'Passwords do not match');
    }
    next();
});

// ✅ Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// ✅ Compare password
userSchema.methods.comparePassword = async function(password) {
    return bcrypt.compare(password, this.password);
}

// ✅ Generate JWT
userSchema.methods.generateToken = function () {
    try {
        return jwt.sign(
             {
                userId: this._id.toString(),
                email: this.email,

            },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '5h' }
        );
    } catch (error) {
        console.log(error);
    }
};

// ✅ Generate Refresh JWT Token
userSchema.methods.generateRefreshToken = async function () {
    try {
        // Validate environment variable
        if (!process.env.REFRESH_TOKEN_SECRET_KEY) {
            throw new Error('REFRESH_TOKEN_SECRET_KEY is not defined in the environment variables.');
        }

        // Generate the refresh token
        const token = jwt.sign(
            { id: this._id }, // Token payload
            process.env.REFRESH_TOKEN_SECRET_KEY, // Secret key
            { expiresIn: '7d' } // Token expiration
        );

        // Update the user's refresh token in the database
        await User.updateOne(
            { _id: this._id }, // Filter
            { refresh_token: token } // Update
        );

        return token; // Return the generated token
    } catch (error) {
        console.error('Error generating refresh token:', error.message);
        throw error; // Re-throw the error for further handling
    }
};





 
const User = mongoose.model('User', userSchema);
module.exports = User;
