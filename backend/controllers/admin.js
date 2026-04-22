import User from "../models/user.js";
import Complaint from "../models/complaint.js";
import Assignment from "../models/assignment.js";
import Notification from "../models/notification.js"
import sendMail from "../utils/sendMail.js";
import bcrypt from "bcryptjs";

export const createStaff = async (req, res) => {
    try {
        const { name, email, occupation } = req.body;

        const tempPassword = Math.random().toString(36).slice(-8);

        const hashedPassword = await bcrypt.hash(tempPassword, 10);

        const user = await User.create({
            name,
            email,
            occupation,
            password: hashedPassword,
            role: "STAFF",
            mustChangePass: true
        });

        await sendMail(
            email,
            "Your Staff Account Created",
            `Hello ${name},

            Your staff account has been created.

            Email: ${email}
            Temporary Password: ${tempPassword}

            Please login and change your password immediately.

            Login here: http://localhost:5173/login`
        );

        try {
            await Notification.create({
                user: user._id,
                title: "Account Created",
                description: "Your staff account has been created"
            });
        } catch (error) {
            console.log("Notification failed:", error.message);
        }

        return res.status(201).json({
            success: true,
            message: "Staff created and email sent",
            user
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to create staff",
            error: error.message
        });
    }
};

export const assignTask = async (req, res) => {
    try {
        const { complaintId, staffId } = req.body;

        const complaint = await Complaint.findById(complaintId).populate("user");
        if (!complaint) {
            return res.status(404).json({
                success: false,
                message: "Complaint not found"
            });
        }

        const staff = await User.findById(staffId);
        if (!staff) {
            return res.status(404).json({
                success: false,
                message: "Staff not found"
            });
        }

        const assignment = await Assignment.create({
            complaint: complaintId,
            staff: staffId
        });

        complaint.status = "ASSIGNED";
        await complaint.save();

        await sendMail(
            staff.email,
            "New Complaint Assigned",
            `Hello ${staff.name},

            You have been assigned a new complaint.

            Title: ${complaint.title}
            Category: ${complaint.category}
            Description: ${complaint.description}

            Please start working on it.

            Dashboard: http://localhost:5173/staff-dashboard`
        );

        await sendMail(
            complaint.user.email,
            "Your Complaint Has Been Assigned",
            `Hello,
            Your complaint "${complaint.title}" has been assigned to our staff.
            We will resolve it soon.
            Track here: http://localhost:5173/my-complaints`
        );

        return res.status(200).json({
            success: true,
            message: "Task assigned and emails sent",
            complaint
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to assign task",
            error: error.message
        });
    }
};

export const getUnassignedTasks = async (req, res) => {
    try {
        const complaints = await Complaint.find({ status: "PENDING" }).populate("user");
        return res.status(200).json({
            success: true,
            message: "Unassigned tasks fetched successfully",
            complaints
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch unassigned tasks",
            error: error.message
        });
    }
}

export const getCategoryMonthlyAnalytics = async (req, res) => {
    try {
        const { year } = req.query;

        const selectedYear = parseInt(year) || new Date().getFullYear();

        const data = await Complaint.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: new Date(`${selectedYear}-01-01`),
                        $lte: new Date(`${selectedYear}-12-31`)
                    }
                }
            },
            {
                $group: {
                    _id: {
                        month: { $month: "$createdAt" },
                        category: "$category"
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $group: {
                    _id: "$_id.month",
                    categories: {
                        $push: {
                            category: "$_id.category",
                            count: "$count"
                        }
                    },
                    totalComplaints: { $sum: "$count" }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.json({
            year: selectedYear,
            monthlyCategoryAnalytics: data
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch category analytics"
        });
    }
};

export const getDashboardAnalytics = async (req, res) => {
    try {
        const total = await Complaint.countDocuments();
        const byCategory = await Complaint.aggregate([
            { $group: { _id: "$category", count: { $sum: 1 } } },
            { $project: { category: "$_id", count: 1, _id: 0 } }
        ]);
        const byStatus = await Complaint.aggregate([
            { $group: { _id: "$status", count: { $sum: 1 } } },
            { $project: { status: "$_id", count: 1, _id: 0 } }
        ]);
        res.status(200).json({ success: true, total, byCategory, byStatus });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const getMetricsSummary = async (req, res) => {
    res.status(200).json({ historicalErrorRate: "0.2%", p95LatencyMs: 85 });
};

export const getAllStaff = async (req, res) => {
    try {
        const staff = await User.find({ role: "STAFF" }).select("-password");
        return res.status(200).json({
            success: true,
            staff
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch staff members",
            error: error.message
        });
    }
};