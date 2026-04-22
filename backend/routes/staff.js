import { Router } from "express";
import { viewAssignedTasks, updateProgress, updateStatus, markAsResolved } from "../controllers/staff.js";
import authenticateUser from "../middleware/authenticationMiddleware.js"
import allowRoles from "../middleware/roleMiddleware.js"

const router = Router();

router.get("/view-assigned-tasks", authenticateUser, allowRoles("STAFF"), viewAssignedTasks);
router.post("/update-progress/:complaintId", authenticateUser, allowRoles("STAFF"), updateProgress);
router.patch("/complaints/:complaintId/status", authenticateUser, allowRoles("STAFF"), updateStatus);
router.post("/mark-resolved/:complaintId", authenticateUser, allowRoles("STAFF"), markAsResolved);

export default router;
