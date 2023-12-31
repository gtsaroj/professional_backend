import { v2 as cloudinary } from "cloudinary";
import fs from "fs"

cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
});

const uploadOnCloudinary = async (localfilepath) => {
  try {
    if (!localfilepath) return null;
    const response = await cloudinary.uploader.upload(localfilepath, {
      resource_type: "auto",
    });
  fs.unlinkSync(localfilepath)
    return  response
  } catch (error) {
    fs.unlinkSync(localfilepath);
    //remove the locally saved file as failed to upload in cloudinary
    return null;
  }
};

export default  uploadOnCloudinary
