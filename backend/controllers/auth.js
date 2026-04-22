import User from "../models/user.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import sendMail from "../utils/sendMail.js"
import crypto from "crypto"

export const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        if (!name || !email || !password || !role)
            return res.status(400).json({ message: "Please provide email, password and role." })

        const user = await User.findOne({ email });
        if (user)
            return res.status(400).json({ message: "User already exists." })

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword, role });
        await newUser.save();
        res.status(201).json({ message: "User registered successfully." })

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error." })
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({ message: "Please provide email and password." });

        const user = await User.findOne({ email });
        if (!user)
            return res.status(401).json({ message: "User not found." });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid)
            return res.status(401).json({ message: "Invalid password." });

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.cookie("token", token, {
            httpOnly: true,
            secure: false, // Set to true in production
            sameSite: "strict",
            maxAge: 3600000,
        });

        res.status(200).json({
            message: "Login successful.",
            user: {
                id: user._id,
                role: user.role,
                name: user.name,
                mustChangePass: user.mustChangePass
            }
        });

    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error." });
    }
}

export const logout = async (req, res) => {
    try {
        res.clearCookie("token");
        res.status(200).json({ message: "Logout successful." });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error." });
    }
}

export const checkAuth = async (req, res) => {
    try {
        const user = req.user;

        res.status(200).json({
            user: {
                id: user._id,
                email: user.email,
                role: user.role,
                name: user.name,
                mustChangePass: user.mustChangePass
            }
        });

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// Forgot Password Flow
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        const token = crypto.randomBytes(32).toString("hex");
        user.resetToken = token;
        user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
        await user.save();

        const resetLink = `http://localhost:5173/reset-password?token=${token}`;
        await sendMail(
            user.email,
            "Reset Your Password",
            `Click here to reset your password: ${resetLink}`
        );

        res.json({ message: "Password reset link sent to your email" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        const user = await User.findOne({
            resetToken: token,
            resetTokenExpiry: { $gt: Date.now() }
        });

        if (!user) return res.status(400).json({ message: "Invalid or expired token" });

        user.password = await bcrypt.hash(newPassword, 10);
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;
        user.mustChangePass = false;
        await user.save();

        res.json({ message: "Password reset successful" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// Update Password (Authenticated)
export const updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user._id);

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) return res.status(400).json({ message: "Incorrect current password" });

        user.password = await bcrypt.hash(newPassword, 10);
        user.mustChangePass = false;
        await user.save();

        res.json({ message: "Password updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};
