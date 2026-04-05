import request from "supertest";
import {beforeEach, describe, expect, it, vi} from "vitest";
import {createRouterApp} from "../helpers/createRouterApp.js";
import router from "../../endpoints/chapterEndpoints.js";

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

describe("chapterEndpoints", () => {
    const app = createRouterApp(router);

    beforeEach(() => {
        queryMock.mockReset();
    });

    // checks the success path and maps notion_page_id to notionId
    it("GET /getNotionId/:chapter_number returns notionId for existing chapter", async () => {
        queryMock.mockResolvedValueOnce({ rows: [{ notion_page_id: "notion-abc" }] });

        const res = await request(app).get("/getNotionId/1");

        expect(res.status).toBe(200);
        expect(res.body).toEqual({ notionId: "notion-abc" });
    });

    // checks the 404 branch when the chapter is missing
    it("GET /getNotionId/:chapter_number returns 404 when chapter is missing", async () => {
        queryMock.mockResolvedValueOnce({ rows: [] });

        const res = await request(app).get("/getNotionId/999");

        expect(res.status).toBe(404);
    });

    // checks the 500 branch when the database query fails
    it("GET /getNotionId/:chapter_number returns 500 on DB error", async () => {
        queryMock.mockRejectedValueOnce(new Error("db failed"));

        const res = await request(app).get("/getNotionId/1");

        expect(res.status).toBe(500);
    });

    // checks that chapter rows are mapped to the API response shape
    it("GET /getAllChapters returns asn object of each chapter", async () => {
        queryMock.mockResolvedValueOnce({
            rows: [
                {
                    chapter: 1,
                    notion_page_id: "n1",
                    img_path: "/img.png",
                    description: "intro",
                    estimated_time: 30,
                },
            ],
        });

        const res = await request(app).get("/getAllChapters");

        expect(res.status).toBe(200);
        expect(res.body).toEqual([
            {
                chapter: 1,
                notionPageId: "n1",
                imgPath: "/img.png",
                description: "intro",
                estimatedTime: 30,
            },
        ]);
    });

    // checks the 404 branch when no chapters are found
    it("GET /getAllChapters returns 404 when no chapters are found", async () => {
        queryMock.mockResolvedValueOnce({ rows: [] });

        const res = await request(app).get("/getAllChapters");

        expect(res.status).toBe(404);
    });

    // checks the 500 branch when the database query fails
    it("GET /getAllChapters returns 500 on DB error", async () => {
        queryMock.mockRejectedValueOnce(new Error("db failed"));

        const res = await request(app).get("/getAllChapters");

        expect(res.status).toBe(500);
    });
});

