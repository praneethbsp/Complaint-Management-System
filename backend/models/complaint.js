import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: [
            'HOSTEL',
            'CLASSROOM',
            'INTERNET',
            'SANITATION',
            'ELECTRICAL',
            'PLUMBING',
            'FOOD',
            'OTHER'
        ],
        required: true
    },
    location: {
        type: String,
        required: true
    },
    images: [
        {
            type: String
        }
    ],
    status: {
        type: String,
        enum: ['PENDING', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED'],
        default: 'PENDING'
    }
}, { timestamps: true });

export default mongoose.model("Complaint", complaintSchema);