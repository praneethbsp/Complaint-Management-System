import { cloudinary, configureCloudinary } from "../config/cloudinary.js";

const uploadToCloudinary = async (fileBuffer) => {
    configureCloudinary();
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: "complaints" },
            (error, result) => {
                if (error) reject(error);
                else resolve(result.secure_url);
            }
        );

        stream.end(fileBuffer);
    });
};

export default uploadToCloudinary;