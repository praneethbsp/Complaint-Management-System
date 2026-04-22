import mongoose from "mongoose";

const logSchema = new mongoose.Schema({
    eventType: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    }
}, { timestamps: { createdAt: true, updatedAt: false } });

export default mongoose.model("Log", logSchema);