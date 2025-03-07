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

describe("User Profile API Tests", () => {
    it("should return a list of users", async () => {
        const res = await request(app).get("/api");
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty("users");
        expect(res.body.users).toEqual(["userOne", "UserTwo", "UserThree"]);
    });

    it("should return profile data", async () => {
        const res = await request(app).get("/api/profile");
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty("fullName", "John Doe");
        expect(res.body).toHaveProperty("address1", "2331 Apple street");
        expect(res.body).toHaveProperty("skills");
        expect(res.body.skills).toContain("Teaching");
        expect(res.body.skills).toContain("Medical Aid");
    });

    it("should update profile data", async () => {
        const newProfile = {
            fullName: "Jane Smith",
            address1: "456 Elm Street",
            address2: "Apt 9C",
            city: "San Francisco",
            state: "CA",
            zipCode: "94107",
            skills: ["Event Planning", "Marketing"],
            preferences: "Weekday mornings",
            availability: ["2025-04-20", "2025-04-25"]
        };

        const res = await request(app)
            .post("/api/profile")
            .send(newProfile);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty("message", "Profile updated successfully");
        expect(res.body.profile).toEqual(newProfile);
    });

    it("should handle missing fields in profile update", async () => {
        const res = await request(app)
            .post("/api/profile")
            .send({});

        expect(res.statusCode).toEqual(200); // Should still succeed
        expect(res.body).toHaveProperty("message", "Profile updated successfully");
    });
});
