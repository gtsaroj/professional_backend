import { asyncHandler } from "../utils/asyncHanlder.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/ecommerce/users.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  const { fullname, email, username, password } = req.body;

  // get users detailed from fronted
  // check validation - not empty
  // check user already exits or not
  // check for images and check for avatar
  // upload them to avatar in cloudinary
  // create user object - create entry in db
  // remove password & refreshToken from response
  // check for user creation
  // return response

  if (
    [fullname, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(402, "email or username already exists");
  }

  const avatarUrlPath = req.files?.avatar?.[0]?.path;
    // const coverUrlPath = req.files?.coverimage[0]?.path;
    
    let coverUrlPath;
    if (req.files && Array.isArray(req.files.coverimage) && req.files.coverimage > 0) {
        coverUrlPath = req.files.coverimage[0].path
    }

  if (!avatarUrlPath) {
    throw new ApiError(400, "Avatar is required");
  }
  const avatar = await uploadOnCloudinary(avatarUrlPath);
  const coverimage = await uploadOnCloudinary(coverUrlPath);

  if (!avatar) {
    throw new ApiError(520, "Server Error while uploading image");
  }
  const user = await User.create({
    fullname,
    username: username,
    avatar: avatar.url,
    coverimage: coverimage?.url || "",
    email,
    password,
  });

  const createdUser = await User
    .findById(user._id)
    .select("-password -refreshToken");
  if (!createdUser) {
    throw new ApiError(500, "Failed while registering the form");
  }
    return res.status(201).json(
      new ApiResponse(200, createdUser, "Registered successfully")
  )
});

export { registerUser };
