import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
var jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      maxlength: 10,
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullname: {
      type: String,
      required: true,
      maxLength: 50,
    },
    avatar: {
      type: string, //cloudinary
      required: true,
    },
    cover: {
      type: string,
    },
    password: {
      type: String,
      required: [true, "password is required"],
      unique: true,
      trim: true,
    },
    watchHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!isModified("password")) return next();
  this.password = bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordIsCorrect = async function (password) {
  if (password) {
    return await bcrypt.compare(password, this.password);
  }
};

userSchema.methods.generateAccessPassword = function () {
  jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullname: this.fullname
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn : process.env.ACCESS_TOKEN_EXPIRES,
    }
  )
};
userSchema.methods.generateRefreshPassword = function () {
  jwt.sign(
    {
      _id: this._id,
  
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn : process.env.REFRESH_TOKEN_EXPIRES,
    }
  )
};

const User = mongoose.model("User", userSchema);
