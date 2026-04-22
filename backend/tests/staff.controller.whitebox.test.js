import { beforeEach, describe, expect, it, vi } from "vitest";

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
import { updateStatus } from "../controllers/staff.js";

const createRes = () => {
    const res = {};
    res.status = vi.fn(() => res);
    res.json = vi.fn(() => res);
    return res;
};

describe("White-box: updateStatus controller", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("returns 403 when assignment is missing", async () => {
        Assignment.findOne.mockResolvedValue(null);

        const req = {
            params: { complaintId: "cmp-1" },
            body: { status: "IN_PROGRESS" },
            user: { _id: "staff-1" },
        };
        const res = createRes();

        await updateStatus(req, res);

        expect(Assignment.findOne).toHaveBeenCalledWith({
            complaint: "cmp-1",
            staff: "staff-1",
        });
        expect(Complaint.findByIdAndUpdate).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ success: false, message: "Not authorized" });
    });

    it("updates complaint status for authorized staff", async () => {
        const updatedComplaint = { _id: "cmp-1", status: "RESOLVED" };
        Assignment.findOne.mockResolvedValue({ _id: "assign-1" });
        Complaint.findByIdAndUpdate.mockResolvedValue(updatedComplaint);

        const req = {
            params: { complaintId: "cmp-1" },
            body: { status: "RESOLVED" },
            user: { _id: "staff-1" },
        };
        const res = createRes();

        await updateStatus(req, res);

        expect(Complaint.findByIdAndUpdate).toHaveBeenCalledWith(
            "cmp-1",
            { status: "RESOLVED" },
            { new: true }
        );
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            message: "Status updated",
            complaint: updatedComplaint,
        });
    });

    it("returns 500 when database update throws", async () => {
        Assignment.findOne.mockResolvedValue({ _id: "assign-1" });
        Complaint.findByIdAndUpdate.mockRejectedValue(new Error("db error"));

        const req = {
            params: { complaintId: "cmp-1" },
            body: { status: "ASSIGNED" },
            user: { _id: "staff-1" },
        };
        const res = createRes();

        await updateStatus(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ success: false, message: "Failed to update status" });
    });
});
