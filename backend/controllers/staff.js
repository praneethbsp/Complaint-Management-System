import Complaint from "../models/complaint.js";
import Assignment from "../models/assignment.js";
import Notification from "../models/notification.js";
import sendMail from "../utils/sendMail.js";

export const viewAssignedTasks = async (req, res) => {
    try {
        const staffId = req.user._id;

        const assignments = await Assignment.find({ staff: staffId })
            .populate({
                path: "complaint",
                populate: {
                    path: "user",
                    select: "name email"
                }
            });

        const complaints = assignments
            .map(a => a.complaint)
            .filter(c => c && c.status !== "RESOLVED");

        res.status(200).json({
            success: true,
            count: complaints.length,
            complaints
        });

    } catch (error) {
        console.error("Fetch assigned tasks error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch assigned tasks"
        });
    }
};

export const updateProgress = async (req, res) => {
    try {
        const { complaintId } = req.params;
        const { content } = req.body;

        const assignment = await Assignment.findOne({
            complaint: complaintId,
            staff: req.user._id
        });

        if (!assignment) {
            return res.status(403).json({
                success: false,
                message: "Not authorized for this complaint"
            });
        }

        const complaint = await Complaint.findById(complaintId);

        if (!complaint) {
            return res.status(404).json({
                success: false,
                message: "Complaint not found"
            });
        }

        if (complaint.status === "ASSIGNED") {
            complaint.status = "IN_PROGRESS";
        }

        complaint.progressNotes.push({
            content,
            createdAt: new Date()
        });

        await complaint.save();

        try {
            await Notification.create({
                user: complaint.user,
                title: "Progress Update",
                description: `Progress updated on your complaint "${complaint.title}"`
            });
        }
        catch (error) {
            console.log("Notification failed:", error.message);
            return res.status(500).json({
                success: false,
                message: "Failed to send notification"
            });
        }

        res.status(200).json({
            success: true,
            message: "Progress updated",
            complaint
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update progress"
        });
    }
};

export const markAsResolved = async (req, res) => {
    try {
        const { complaintId } = req.params;

        const assignment = await Assignment.findOne({
            complaint: complaintId,
            staff: req.user._id
        });

        if (!assignment) {
            return res.status(403).json({
                success: false,
                message: "Not authorized"
            });
        }

        const complaint = await Complaint.findById(complaintId)
            .populate("user", "email name");

        if (!complaint) {
            return res.status(404).json({
                success: false,
                message: "Complaint not found"
            });
        }

        complaint.status = "RESOLVED";

        complaint.progressNotes.push({
            content: "Marked as resolved",
            createdAt: new Date()
        });

        await complaint.save();

        try {
            await sendMail(
                complaint.user.email,
                "Complaint Resolved",
                `Hello ${complaint.user.name},
                Your complaint "${complaint.title}" has been resolved.

                Thank you.`
            );
        } catch (err) {
            console.log("Email failed:", err.message);
        }

        res.status(200).json({
            success: true,
            message: "Complaint resolved",
            complaint
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to resolve complaint"
        });
    }
};

export const updateStatus = async (req, res) => {
    try {
        const { complaintId } = req.params;
        const { status } = req.body;

        const assignment = await Assignment.findOne({
            complaint: complaintId,
            staff: req.user._id
        });

        if (!assignment) {
            return res.status(403).json({ success: false, message: "Not authorized" });
        }

        const complaint = await Complaint.findByIdAndUpdate(
            complaintId,
            { status },
            { new: true }
        );

        res.status(200).json({ success: true, message: "Status updated", complaint });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to update status" });
    }
};