import request from "supertest";
import {beforeEach, describe, expect, it, vi} from "vitest";
import {createRouterApp} from "../helpers/createRouterApp.js";

const hoisted = vi.hoisted(() => ({
    queryMock: vi.fn(),
    deleteUserMock: vi.fn(),
}));

vi.mock("../../database.js", () => ({
    default: {
        query: hoisted.queryMock,
    },
}));

// sets req.auth from the header value or falls back to user-1
// this lets us simulate the logged-in user in tests
vi.mock("@clerk/clerk-sdk-node", () => ({
    ClerkExpressRequireAuth: () => (req, _res, next) => {
        req.auth = { userId: req.headers["x-test-auth-user"] ?? "user-1" };
        next();
    },
}));

vi.mock("@clerk/backend", () => ({
    createClerkClient: () => ({
        users: {
            deleteUser: hoisted.deleteUserMock,
        },
    }),
}));

import router from "../../endpoints/userEndpoints.js";

describe("userEndpoints", () => {
    const app = createRouterApp(router);

    beforeEach(() => {
        hoisted.queryMock.mockReset();
        hoisted.deleteUserMock.mockReset();
    });

    // checks that getUser returns a mapped user object when a row exists
    it("GET /getUser/:username returns user payload when user exists", async () => {
        hoisted.queryMock.mockResolvedValueOnce({
            rows: [{ user_id: "u1", username: "john", email: "john@x.com", image_url: "img.png" }],
        });

        const res = await request(app).get("/getUser/john");

        expect(res.status).toBe(200);
        expect(res.body).toEqual({
            userId: "u1",
            userName: "john",
            userEmail: "john@x.com",
            imageUrl: "img.png",
        });
    });

    // checks the 404 branch when the database returns no rows
    it("GET /getUser/:username returns 404 when user does not exist", async () => {
        hoisted.queryMock.mockResolvedValueOnce({ rows: [] });

        const res = await request(app).get("/getUser/ghost");

        expect(res.status).toBe(404);
    });

    // checks the 500 branch when the database query fails
    it("GET /getUser/:username returns 500 on DB error", async () => {
        hoisted.queryMock.mockRejectedValueOnce(new Error("db failed"));

        const res = await request(app).get("/getUser/john");

        expect(res.status).toBe(500);
    });

    // checks score parsing from SUM when the value is present
    it("GET /getUserScore/:userId returns parsed score from SUM", async () => {
        hoisted.queryMock.mockResolvedValueOnce({ rows: [{ sum: "42" }] });

        const res = await request(app).get("/getUserScore/u1");

        expect(res.status).toBe(200);
        expect(res.body).toEqual({ score: 42 });
    });

    // checks fallback to zero when SUM is null
    it("GET /getUserScore/:userId returns 0 when SUM is null", async () => {
        hoisted.queryMock.mockResolvedValueOnce({ rows: [{ sum: null }] });

        const res = await request(app).get("/getUserScore/u1");

        expect(res.status).toBe(200);
        expect(res.body).toEqual({ score: 0 });
    });

    // checks auth guard in addUser when body user_id does not match auth user
    it("POST /addUser returns 403 when authenticated user is different", async () => {
        const res = await request(app)
            .post("/addUser")
            .set("x-test-auth-user", "user-1")
            .send({
                user_id: "user-2",
                username: "john",
                email: "john@x.com",
                image_url: "img.png",
            });

        expect(res.status).toBe(403);
        expect(hoisted.queryMock).not.toHaveBeenCalled();
    });

    // checks successful user insert with valid auth and payload
    it("POST /addUser inserts user and returns 200", async () => {
        hoisted.queryMock.mockResolvedValueOnce({ rowCount: 1 });

        const res = await request(app)
            .post("/addUser")
            .set("x-test-auth-user", "user-1")
            .send({
                user_id: "user-1",
                username: "john",
                email: "john@x.com",
                image_url: "img.png",
            });

        expect(res.status).toBe(200);
        expect(hoisted.queryMock).toHaveBeenCalledTimes(1);
    });

    // checks auth guard in putUser when auth user differs from clerk_user_id
    it("PUT /putUser returns 403 when authenticated user is different", async () => {
        const res = await request(app)
            .put("/putUser")
            .set("x-test-auth-user", "user-1")
            .send({
                user_username: "john",
                user_email: "john@x.com",
                user_imageUrl: "img.png",
                clerk_user_id: "user-2",
            });

        expect(res.status).toBe(403);
        expect(hoisted.queryMock).not.toHaveBeenCalled();
    });

    // checks successful user update for the right identity
    it("PUT /putUser updates user and returns 200", async () => {
        hoisted.queryMock.mockResolvedValueOnce({ rowCount: 1 });

        const res = await request(app)
            .put("/putUser")
            .set("x-test-auth-user", "user-1")
            .send({
                user_username: "john",
                user_email: "john@x.com",
                user_imageUrl: "img.png",
                clerk_user_id: "user-1",
            });

        expect(res.status).toBe(200);
        expect(hoisted.queryMock).toHaveBeenCalledTimes(1);
    });

    // checks the 500 branch when update query fails
    it("PUT /putUser returns 500 on DB error", async () => {
        hoisted.queryMock.mockRejectedValueOnce(new Error("db failed"));

        const res = await request(app)
            .put("/putUser")
            .set("x-test-auth-user", "user-1")
            .send({
                user_username: "john",
                user_email: "john@x.com",
                user_imageUrl: "img.png",
                clerk_user_id: "user-1",
            });

        expect(res.status).toBe(500);
    });

    // checks auth guard for deleteUserProfile when userId does not match auth
    it("DELETE /deleteUserProfile/:userId returns 403 on auth mismatch", async () => {
        const res = await request(app)
            .delete("/deleteUserProfile/user-2")
            .set("x-test-auth-user", "user-1");

        expect(res.status).toBe(403);
        expect(hoisted.queryMock).not.toHaveBeenCalled();
        expect(hoisted.deleteUserMock).not.toHaveBeenCalled();
    });

    // checks 404 branch when user does not exist in the database
    it("DELETE /deleteUserProfile/:userId returns 404 when user is missing in DB", async () => {
        hoisted.queryMock.mockResolvedValueOnce({ rowCount: 0 });

        const res = await request(app)
            .delete("/deleteUserProfile/user-1")
            .set("x-test-auth-user", "user-1");

        expect(res.status).toBe(404);
        expect(hoisted.deleteUserMock).not.toHaveBeenCalled();
    });

    // checks successful profile deletion in both database and clerk
    it("DELETE /deleteUserProfile/:userId returns 200 when DB and clerk delete succeed", async () => {
        hoisted.queryMock.mockResolvedValueOnce({ rowCount: 1 });
        hoisted.deleteUserMock.mockResolvedValueOnce({ id: "user-1" });

        const res = await request(app)
            .delete("/deleteUserProfile/user-1")
            .set("x-test-auth-user", "user-1");

        expect(res.status).toBe(200);
        expect(hoisted.deleteUserMock).toHaveBeenCalledWith("user-1");
    });

    // checks 500 branch when clerk deletion fails after DB delete
    it("DELETE /deleteUserProfile/:userId returns 500 when clerk delete fails", async () => {
        hoisted.queryMock.mockResolvedValueOnce({ rowCount: 1 });
        hoisted.deleteUserMock.mockRejectedValueOnce(new Error("clerk failed"));

        const res = await request(app)
            .delete("/deleteUserProfile/user-1")
            .set("x-test-auth-user", "user-1");

        expect(res.status).toBe(500);
    });
});
