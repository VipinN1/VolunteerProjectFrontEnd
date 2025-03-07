const request = require("supertest");
const app = require("../index"); // Import the Express app

describe("API Endpoints", () => {

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
      .send({}); // Empty request body

    expect(res.statusCode).toEqual(200); // Should still succeed
    expect(res.body).toHaveProperty("message", "Profile updated successfully");
  });

});
