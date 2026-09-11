import request from "supertest";
import app from "../../../app.js";

describe("Dining Tables API", () => {
    test("GET /api/v1/staff/tables without token", async () => {
        const response = await request(app)
            .get("/api/v1/staff/tables");

        expect(response.status).toBe(401);
        expect(response.body.success).toBe(false);
    });

    test("POST /api/v1/staff/tables/:id/clear without token", async () => {
        const response = await request(app)
            .post(
                "/api/v1/staff/tables/00000000-0000-0000-0000-000000000000/clear"
            );

        expect(response.status).toBe(401);
        expect(response.body.success).toBe(false);
    });
});