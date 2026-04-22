import { Router } from "express";
import { createStaff, assignTask, getUnassignedTasks, getCategoryMonthlyAnalytics, getDashboardAnalytics, getAllStaff } from "../controllers/admin.js";
import authenticateUser from "../middleware/authenticationMiddleware.js"
import allowRoles from "../middleware/roleMiddleware.js"

const router = Router()

router.post("/create-staff", authenticateUser, allowRoles("ADMIN"), createStaff);
router.post("/assign-task", authenticateUser, allowRoles("ADMIN"), assignTask);
router.get("/unassigned-tasks", authenticateUser, allowRoles("ADMIN"), getUnassignedTasks);
router.get("/staff", authenticateUser, allowRoles("ADMIN"), getAllStaff);
router.get("/category-monthly-analytics", authenticateUser, allowRoles("ADMIN"), getCategoryMonthlyAnalytics);
router.get("/analytics", authenticateUser, allowRoles("ADMIN"), getDashboardAnalytics);

export default router;