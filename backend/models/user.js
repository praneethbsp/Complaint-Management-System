import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },

        email: {
            type: String,
            required: true,
            unique: true
        },

        password: {
            type: String,
            required: true
        },

        role: {
            type: String,
            enum: ["USER", "STAFF", "ADMIN"],
            default: "USER"
        },

        occupation: {
            type: String
        },

        mustChangePass: {
            type: Boolean,
            default: false
        },

        resetToken: {
            type: String
        },
        resetTokenExpiry: {
            type: Date
        }
    },
    { timestamps: true }
);

export default mongoose.model("User", userSchema);