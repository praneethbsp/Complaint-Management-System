import { Router } from "express"
import { viewComplaint, createComplaint, getMyComplaints, deleteComplaint, getNotifications, markRead } from "../controllers/user.js";
import authenticateUser from "../middleware/authenticationMiddleware.js";
import upload from "../middleware/upload.js";

const router = Router();

router.post("/create-complaint", authenticateUser, upload.array("images", 5), createComplaint);
router.get("/my-complaints", authenticateUser, getMyComplaints);
router.get("/view-complaint/:complaintId", authenticateUser, viewComplaint)
router.delete("/complaint/:complaintId", authenticateUser, deleteComplaint);
router.get("/notifications", authenticateUser, getNotifications);
router.post("/mark-read/:notificationId", authenticateUser, markRead);

export default router;