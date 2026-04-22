import Complaint from "../models/complaint.js"
import uploadToCloudinary from "../utils/uploadToCloudinary.js";
import Notification from "../models/notification.js";

const createComplaint = async (req, res) => {
    try {
        const { title, description, category, location } = req.body;

        const user = req.user._id;

        let imageUrls = [];

        if (req.files && req.files.length > 0) {
            imageUrls = await Promise.all(
                req.files.map(file => uploadToCloudinary(file.buffer))
            );
        }

        const complaint = await Complaint.create({
            user,
            title,
            description,
            category,
            location,
            images: imageUrls
        });

        return res.status(201).json({
            success: true,
            message: "Complaint created successfully",
            complaint
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to create complaint",
            error: error.message
        });
    }
};

const viewComplaint = async (req, res) => {
    try {
        const { complaintId } = req.params;
        const complaint = await Complaint.findById(complaintId).populate("user");
        if (!complaint) {
            return res.status(404).json({
                success: false,
                message: "Complaint not found"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Complaint fetched successfully",
            complaint
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch complaint",
            error: error.message
        });
    }
}

const deleteComplaint = async (req, res) => {
    try {
        const { complaintId } = req.params;
        const complaint = await Complaint.findById(complaintId);
        if (!complaint) {
            return res.status(404).json({
                success: false,
                message: "Complaint not found"
            });
        }
        await complaint.deleteOne();
        return res.status(200).json({
            success: true,
            message: "Complaint deleted successfully"
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to delete complaint",
            error: error.message
        });
    }
}

const getMyComplaints = async (req, res) => {
    try {
        const userId = req.user._id;
        const complaints = await Complaint.find({ user: userId }).populate("user");
        return res.status(200).json({
            success: true,
            message: "Complaints fetched successfully",
            complaints
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch complaints",
            error: error.message
        });
    }
}

const getNotifications = async (req, res) => {
    try {
        const userId = req.user._id;
        const notifications = await Notification.find({ user: userId }).sort({ createdAt: -1 });
        return res.status(200).json({
            success: true,
            message: "Notifications fetched successfully",
            notifications
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch notifications",
            error: error.message
        });
    }
}

const markRead = async (req, res) => {
    try {
        const { notificationId } = req.params;
        const notification = await Notification.findById(notificationId);
        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found"
            });
        }
        notification.read = true;
        await notification.save();
        return res.status(200).json({
            success: true,
            message: "Notification marked as read"
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to mark notification as read",
            error: error.message
        });
    }
}

export {
    createComplaint,
    viewComplaint,
    deleteComplaint,
    getMyComplaints,
    getNotifications,
    markRead
}