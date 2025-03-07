const request = require("supertest");
const app = require("./index");

describe("API Tests", () => {
    test("GET /api/notifications should return a list of notifications", async () => {
        const res = await request(app).get("/api/notifications");
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    test("POST /api/notifications should validate required fields", async () => {
        const res = await request(app).post("/api/notifications").send({});
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe("All fields are required.");
    });

    test("POST /api/notifications should create a new notification", async () => {
        const newNotification = {
            eventName: "Beach Cleanup",
            message: "Join us at the beach this Sunday!",
            date: "2025-04-01"
        };
        const res = await request(app).post("/api/notifications").send(newNotification);
        expect(res.statusCode).toBe(201);
        expect(res.body.newNotification).toEqual(newNotification);
    });

    test("POST /api/notifications should reject messages shorter than 5 characters", async () => {
        const invalidNotification = {
            eventName: "Food Drive",
            message: "Hi",
            date: "2025-05-10"
        };
        const res = await request(app).post("/api/notifications").send(invalidNotification);
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe("Message must be at least 5 characters long.");
    });

    test("GET /api/volunteer-history should return participation history", async () => {
        const res = await request(app).get("/api/volunteer-history");
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
    });
});
