import express from "express";
import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../middleware/authenticationMiddleware.js", () => ({
    default: (req, _res, next) => {
        const role = req.header("x-test-role") || "STAFF";
        req.user = { _id: "staff-1", role };
        next();
    },
}));

vi.mock("../models/assignment.js", () => ({
    default: {
        findOne: vi.fn(),
    },
}));

vi.mock("../models/complaint.js", () => ({
    default: {
        findByIdAndUpdate: vi.fn(),
    },
}));

vi.mock("../models/notification.js", () => ({
    default: {
        create: vi.fn(),
    },
}));

vi.mock("../utils/sendMail.js", () => ({
    default: vi.fn(),
}));

import Assignment from "../models/assignment.js";
import Complaint from "../models/complaint.js";
import staffRoutes from "../routes/staff.js";

const buildApp = () => {
    const app = express();
    app.use(express.json());
    app.use("/api/staff", staffRoutes);
    return app;
};

describe("Black-box: PATCH /api/staff/complaints/:complaintId/status", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("rejects non-staff role with 403", async () => {
        const app = buildApp();

        const res = await request(app)
            .patch("/api/staff/complaints/cmp-1/status")
            .set("x-test-role", "USER")
            .send({ status: "IN_PROGRESS" });

        expect(res.status).toBe(403);
        expect(res.body).toEqual({ message: "Forbidden" });
    });

    it("returns 403 when staff is not assigned", async () => {
        Assignment.findOne.mockResolvedValue(null);
        const app = buildApp();

        const res = await request(app)
            .patch("/api/staff/complaints/cmp-1/status")
            .send({ status: "IN_PROGRESS" });

        expect(res.status).toBe(403);
        expect(res.body).toEqual({ success: false, message: "Not authorized" });
    });

    it("updates complaint status and returns 200", async () => {
        Assignment.findOne.mockResolvedValue({ _id: "assign-1" });
        Complaint.findByIdAndUpdate.mockResolvedValue({
            _id: "cmp-1",
            status: "RESOLVED",
        });

        const app = buildApp();
        const res = await request(app)
            .patch("/api/staff/complaints/cmp-1/status")
            .send({ status: "RESOLVED" });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe("Status updated");
        expect(res.body.complaint).toMatchObject({
            _id: "cmp-1",
            status: "RESOLVED",
        });
    });

    it("returns 404 for unsupported method on same route", async () => {
        const app = buildApp();

        const res = await request(app)
            .post("/api/staff/complaints/cmp-1/status")
            .send({ status: "IN_PROGRESS" });

        expect(res.status).toBe(404);
    });
});
