import request from "supertest";
import {beforeEach, describe, expect, it, vi} from "vitest";
import {createRouterApp} from "../helpers/createRouterApp.js";
import router from "../../endpoints/friendshipEndpoints.js";

const { queryMock } = vi.hoisted(() => ({
    queryMock: vi.fn(),
}));

vi.mock("../../database.js", () => ({
    default: {
        query: queryMock,
    },
}));

vi.mock("@clerk/clerk-sdk-node", () => ({
    ClerkExpressRequireAuth: () => (req, _res, next) => {
        req.auth = { userId: req.headers["x-test-auth-user"] ?? "user-1" };
        next();
    },
}));

describe("friendshipEndpoints", () => {
    const app = createRouterApp(router);

    beforeEach(() => {
        queryMock.mockReset();
    });

    // checks 403 guard when trying to read someone else's friend list
    it("GET /getAllFriends/:userId returns 403 when auth user mismatches", async () => {
        const res = await request(app)
            .get("/getAllFriends/user-2")
            .set("x-test-auth-user", "user-1");

        expect(res.status).toBe(403);
    });

    // checks empty result when no friends exist
    it("GET /getAllFriends/:userId returns empty array when no friends exist", async () => {
        queryMock.mockResolvedValueOnce({ rows: [] });

        const res = await request(app)
            .get("/getAllFriends/user-1")
            .set("x-test-auth-user", "user-1");

        expect(res.status).toBe(200);
    });

    // checks mapping of friend rows to the endpoint response shape
    it("GET /getAllFriends/:userId returns mapped friends when rows exist", async () => {
        queryMock.mockResolvedValueOnce({
            rows: [
                {
                    friend_name: "Alice",
                    friend_id: "u2",
                    image_url: "alice.png",
                    email: "alice@x.com",
                    score: "15",
                },
            ],
        });

        const res = await request(app)
            .get("/getAllFriends/user-1")
            .set("x-test-auth-user", "user-1");

        expect(res.status).toBe(200);
        expect(res.body).toEqual([
            { friendName: "Alice", friendId: "u2", imgUrl: "alice.png", email: "alice@x.com", score: 15 },
        ]);
    });

    // checks empty result for getAllFriendRequests
    it("GET /getAllFriendRequests/:userId returns empty array when no requests exist", async () => {
        queryMock.mockResolvedValueOnce({ rows: [] });

        const res = await request(app)
            .get("/getAllFriendRequests/user-1")
            .set("x-test-auth-user", "user-1");

        expect(res.status).toBe(200);
        expect(res.body).toEqual([]);
    });

    // checks mapping of friend request rows for the response payload
    it("GET /getAllFriendRequests/:userId returns an object for each friend found", async () => {
        queryMock.mockResolvedValueOnce({
            rows: [
                { friend_username: "Bob", friend_id: "u9", image_url: "bob.png", email: "bob@x.com" },
            ],
        });

        const res = await request(app)
            .get("/getAllFriendRequests/user-1")
            .set("x-test-auth-user", "user-1");

        expect(res.status).toBe(200);
        expect(res.body).toEqual([
            { friendName: "Bob", friendId: "u9", imgUrl: "bob.png", email: "bob@x.com" },
        ]);
    });

    // checks auth guard for getAllFriendRequests
    it("GET /getAllFriendRequests/:userId returns 403 when auth user mismatches", async () => {
        const res = await request(app)
            .get("/getAllFriendRequests/user-2")
            .set("x-test-auth-user", "user-1");

        expect(res.status).toBe(403);
        expect(queryMock).not.toHaveBeenCalled();
    });

    // checks DB failure handling for getAllFriendRequests
    it("GET /getAllFriendRequests/:userId returns 500 on DB error", async () => {
        queryMock.mockRejectedValueOnce(new Error("db failed"));

        const res = await request(app)
            .get("/getAllFriendRequests/user-1")
            .set("x-test-auth-user", "user-1");

        expect(res.status).toBe(500);
    });

    // checks the "not found" friendship branch which currently returns 400
    it("GET /getFriendship/:userId/:friendId returns 400 when friendship does not exist", async () => {
        queryMock.mockResolvedValueOnce({ rows: [] });

        const res = await request(app)
            .get("/getFriendship/user-1/user-2")
            .set("x-test-auth-user", "user-1");

        expect(res.status).toBe(400);
    });

    // checks the "exists" friendship branch which returns 200
    it("GET /getFriendship/:userId/:friendId returns 200 when friendship exists", async () => {
        queryMock.mockResolvedValueOnce({ rows: [{ user_id: "user-1", friend_id: "user-2" }] });

        const res = await request(app)
            .get("/getFriendship/user-1/user-2")
            .set("x-test-auth-user", "user-1");

        expect(res.status).toBe(200);
    });

    // checks auth guard for getFriendship
    it("GET /getFriendship/:userId/:friendId returns 403 when auth user mismatches", async () => {
        const res = await request(app)
            .get("/getFriendship/user-2/user-3")
            .set("x-test-auth-user", "user-1");

        expect(res.status).toBe(403);
        expect(queryMock).not.toHaveBeenCalled();
    });

    // checks DB failure handling for getFriendship
    it("GET /getFriendship/:userId/:friendId returns 500 on DB error", async () => {
        queryMock.mockRejectedValueOnce(new Error("db failed"));

        const res = await request(app)
            .get("/getFriendship/user-1/user-2")
            .set("x-test-auth-user", "user-1");

        expect(res.status).toBe(500);
    });

    // checks 403 guard for sendFriendRequest
    it("POST /sendFriendRequest returns 403 when auth user mismatches body.from", async () => {
        const res = await request(app)
            .post("/sendFriendRequest")
            .set("x-test-auth-user", "user-1")
            .send({ from: "user-2", friend_id: "user-3" });

        expect(res.status).toBe(403);
    });

    // checks validation branch when user sends a request to self
    it("POST /sendFriendRequest returns 400 when from and to are equal", async () => {
        const res = await request(app)
            .post("/sendFriendRequest")
            .set("x-test-auth-user", "user-1")
            .send({ from: "user-1", friend_id: "user-1" });

        expect(res.status).toBe(400);
    });

    // checks successful friend request insert
    it("POST /sendFriendRequest inserts request and returns 200", async () => {
        queryMock.mockResolvedValueOnce({ rowCount: 1 });

        const res = await request(app)
            .post("/sendFriendRequest")
            .set("x-test-auth-user", "user-1")
            .send({ from: "user-1", friend_id: "user-2" });

        expect(res.status).toBe(200);
        expect(queryMock).toHaveBeenCalledTimes(1);
    });

    // checks DB failure handling for sendFriendRequest
    it("POST /sendFriendRequest returns 500 when insert fails", async () => {
        queryMock.mockRejectedValueOnce(new Error("insert failed"));

        const res = await request(app)
            .post("/sendFriendRequest")
            .set("x-test-auth-user", "user-1")
            .send({ from: "user-1", friend_id: "user-2" });

        expect(res.status).toBe(500);
    });

    // checks request accept flow (delete + insert)
    it("POST /acceptFriendRequest/:userId/:friendId returns 200 on successful insert", async () => {
        queryMock
            .mockResolvedValueOnce({ rowCount: 1 }) // delete
            .mockResolvedValueOnce({ rowCount: 1 }); // insert

        const res = await request(app)
            .post("/acceptFriendRequest/user-1/user-2")
            .set("x-test-auth-user", "user-1");

        expect(res.status).toBe(200);
        expect(queryMock).toHaveBeenCalledTimes(2);
    });

    // checks the 500 branch when insert fails during accept flow
    it("POST /acceptFriendRequest/:userId/:friendId returns 500 when insert fails", async () => {
        queryMock
            .mockResolvedValueOnce({ rowCount: 1 }) // delete
            .mockRejectedValueOnce(new Error("insert failed"));

        const res = await request(app)
            .post("/acceptFriendRequest/user-1/user-2")
            .set("x-test-auth-user", "user-1");

        expect(res.status).toBe(500);
    });

    // checks 404 when request to accept does not exist
    it("POST /acceptFriendRequest/:userId/:friendId returns 404 when request row is missing", async () => {
        queryMock.mockResolvedValueOnce({ rowCount: 0 });

        const res = await request(app)
            .post("/acceptFriendRequest/user-1/user-2")
            .set("x-test-auth-user", "user-1");

        expect(res.status).toBe(404);
        expect(queryMock).toHaveBeenCalledTimes(1);
    });

    // checks 500 when delete query itself fails during accept flow
    it("POST /acceptFriendRequest/:userId/:friendId returns 500 when delete fails", async () => {
        queryMock.mockRejectedValueOnce(new Error("delete failed"));

        const res = await request(app)
            .post("/acceptFriendRequest/user-1/user-2")
            .set("x-test-auth-user", "user-1");

        expect(res.status).toBe(500);
    });

    // checks auth guard for acceptFriendRequest
    it("POST /acceptFriendRequest/:userId/:friendId returns 403 when auth user mismatches", async () => {
        const res = await request(app)
            .post("/acceptFriendRequest/user-2/user-3")
            .set("x-test-auth-user", "user-1");

        expect(res.status).toBe(403);
        expect(queryMock).not.toHaveBeenCalled();
    });

    // checks successful deleteFriendRequest branch
    it("DELETE /deleteFriendRequest/:userId/:friendId returns 200 on success", async () => {
        queryMock.mockResolvedValueOnce({ rowCount: 1 });

        const res = await request(app)
            .delete("/deleteFriendRequest/user-1/user-2")
            .set("x-test-auth-user", "user-1");

        expect(res.status).toBe(200);
    });

    // checks auth guard for deleteFriendRequest
    it("DELETE /deleteFriendRequest/:userId/:friendId returns 403 when auth user mismatches", async () => {
        const res = await request(app)
            .delete("/deleteFriendRequest/user-2/user-3")
            .set("x-test-auth-user", "user-1");

        expect(res.status).toBe(403);
        expect(queryMock).not.toHaveBeenCalled();
    });

    // checks DB failure handling for deleteFriendRequest
    it("DELETE /deleteFriendRequest/:userId/:friendId returns 500 on DB error", async () => {
        queryMock.mockRejectedValueOnce(new Error("db failed"));

        const res = await request(app)
            .delete("/deleteFriendRequest/user-1/user-2")
            .set("x-test-auth-user", "user-1");

        expect(res.status).toBe(500);
    });

    // checks successful deleteFriendship branch
    it("DELETE /deleteFriendship/:userId/:friendId returns 200 on success", async () => {
        queryMock.mockResolvedValueOnce({ rowCount: 1 });

        const res = await request(app)
            .delete("/deleteFriendship/user-1/user-2")
            .set("x-test-auth-user", "user-1");

        expect(res.status).toBe(200);
    });

    // checks auth guard for deleteFriendship
    it("DELETE /deleteFriendship/:userId/:friendId returns 403 when auth user mismatches", async () => {
        const res = await request(app)
            .delete("/deleteFriendship/user-2/user-3")
            .set("x-test-auth-user", "user-1");

        expect(res.status).toBe(403);
        expect(queryMock).not.toHaveBeenCalled();
    });

    // checks DB failure handling for deleteFriendship
    it("DELETE /deleteFriendship/:userId/:friendId returns 500 on DB error", async () => {
        queryMock.mockRejectedValueOnce(new Error("db failed"));

        const res = await request(app)
            .delete("/deleteFriendship/user-1/user-2")
            .set("x-test-auth-user", "user-1");

        expect(res.status).toBe(500);
    });
});

