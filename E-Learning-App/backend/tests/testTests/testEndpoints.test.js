import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createRouterApp } from "../helpers/createRouterApp.js";

const hoisted = vi.hoisted(() => ({
    queryMock: vi.fn(),
    getQuestionsBasedOnDifficultyMock: vi.fn(),
    addTestMock: vi.fn(),
    calculateTestScoreMock: vi.fn(),
    decreaseAiLimitMock: vi.fn(),
    getAiLimitMock: vi.fn(),
    getBestTestScoreMock: vi.fn(),
    getCurrentTimestampMock: vi.fn(),
    getGradeMock: vi.fn(),
    getMedalMock: vi.fn(),
    getRandomElementsFromArrayMock: vi.fn(),
    shuffleArrayMock: vi.fn(),
}));

vi.mock("../../database.js", () => ({
    default: {
        query: hoisted.queryMock,
    },
}));

vi.mock("../../steps/questionsSteps.js", () => ({
    default: hoisted.getQuestionsBasedOnDifficultyMock,
}));

vi.mock("../../steps/testSteps.js", () => ({
    addTest: hoisted.addTestMock,
    calculateTestScore: hoisted.calculateTestScoreMock,
    decreaseAiLimit: hoisted.decreaseAiLimitMock,
    getAiLimit: hoisted.getAiLimitMock,
    getBestTestScore: hoisted.getBestTestScoreMock,
    getCurrentTimestamp: hoisted.getCurrentTimestampMock,
    getGrade: hoisted.getGradeMock,
    getMedal: hoisted.getMedalMock,
    getRandomElementsFromArray: hoisted.getRandomElementsFromArrayMock,
    shuffleArray: hoisted.shuffleArrayMock,
}));

vi.mock("@clerk/clerk-sdk-node", () => ({
    ClerkExpressRequireAuth: () => (req, _res, next) => {
        req.auth = { userId: req.headers["x-test-auth-user"] ?? "user-1" };
        next();
    },
}));

import router from "../../endpoints/testEndpoints.js";

describe("testEndpoints", () => {
    const app = createRouterApp(router);

    beforeEach(() => {
        hoisted.queryMock.mockReset();
        hoisted.getQuestionsBasedOnDifficultyMock.mockReset();
        hoisted.addTestMock.mockReset();
        hoisted.calculateTestScoreMock.mockReset();
        hoisted.decreaseAiLimitMock.mockReset();
        hoisted.getAiLimitMock.mockReset();
        hoisted.getBestTestScoreMock.mockReset();
        hoisted.getCurrentTimestampMock.mockReset();
        hoisted.getGradeMock.mockReset();
        hoisted.getMedalMock.mockReset();
        hoisted.getRandomElementsFromArrayMock.mockReset();
        hoisted.shuffleArrayMock.mockReset();

        hoisted.getBestTestScoreMock.mockReturnValue(88.5);
        hoisted.getAiLimitMock.mockResolvedValue(10);
        hoisted.getRandomElementsFromArrayMock.mockImplementation((fromArray, toArray, numberOfElements) => {
            toArray.push(...fromArray.slice(0, numberOfElements));
        });
        hoisted.shuffleArrayMock.mockImplementation(() => {});
        hoisted.decreaseAiLimitMock.mockResolvedValue(undefined);
        hoisted.calculateTestScoreMock.mockResolvedValue(8);
        hoisted.getGradeMock.mockReturnValue("B");
        hoisted.getMedalMock.mockReturnValue("none");
        hoisted.getCurrentTimestampMock.mockReturnValue("2026-04-05T10:00:00.000Z");
        hoisted.addTestMock.mockResolvedValue(true);
    });

    // checks test history mapping and use of getBestTestScore helper
    it("GET /getAllUsersTests/:userId returns mapped tests and bestScore", async () => {
        hoisted.queryMock.mockResolvedValueOnce({
            rows: [
                {
                    test_id: "t1",
                    percentage: "88.5",
                    timestamp: "2026-04-01",
                    grade: "B",
                    medal: "none",
                    structure: [{ id: 1 }],
                    difficulty: "medium",
                },
            ],
        });

        const res = await request(app).get("/getAllUsersTests/user-1");

        expect(res.status).toBe(200);
        expect(res.body).toEqual({
            tests: [
                {
                    testId: "t1",
                    percentage: "88.5",
                    timestamp: "2026-04-01",
                    grade: "B",
                    medal: "none",
                    structure: [{ id: 1 }],
                    difficulty: "medium",
                },
            ],
            bestScore: 88.5,
        });
        expect(hoisted.getBestTestScoreMock).toHaveBeenCalledTimes(1);
    });

    // checks the 404 branch for empty test history
    it("GET /getAllUsersTests/:userId returns 404 when no tests exist", async () => {
        hoisted.queryMock.mockResolvedValueOnce({ rows: [] });

        const res = await request(app).get("/getAllUsersTests/user-1");

        expect(res.status).toBe(404);
    });

    // checks identity guard in getTestByTestId
    it("GET /getTestByTestId/:testId/:userId returns 403 on auth mismatch", async () => {
        const res = await request(app)
            .get("/getTestByTestId/t1/user-2")
            .set("x-test-auth-user", "user-1");

        expect(res.status).toBe(403);
        expect(hoisted.queryMock).not.toHaveBeenCalled();
    });

    // checks test detail payload for an existing testId
    it("GET /getTestByTestId/:testId/:userId returns test result payload", async () => {
        hoisted.queryMock.mockResolvedValueOnce({
            rows: [{ percentage: "90.00", points: 9, medal: "silver", grade: "A", structure: [{ id: 1 }] }],
        });

        const res = await request(app)
            .get("/getTestByTestId/t1/user-1")
            .set("x-test-auth-user", "user-1");

        expect(res.status).toBe(200);
        expect(res.body).toEqual({
            results: { percentage: "90.00", points: 9, medal: "silver", grade: "A" },
            structure: [{ id: 1 }],
        });
    });

    // checks getCertificateById branch for missing certificate
    it("GET /getCertificateById/:certId returns certificateFound=false when missing", async () => {
        hoisted.queryMock.mockResolvedValueOnce({ rows: [] });

        const res = await request(app).get("/getCertificateById/cert-x");

        expect(res.status).toBe(404);
        expect(res.body).toEqual({ certificateFound: false });
    });

    // checks getCertificateById branch for existing certificate
    it("GET /getCertificateById/:certId returns certificate owner when found", async () => {
        hoisted.queryMock.mockResolvedValueOnce({ rows: [{ username: "john" }] });

        const res = await request(app).get("/getCertificateById/cert-x");

        expect(res.status).toBe(200);
        expect(res.body).toEqual({ certificateFound: true, certificateOwner: "john" });
    });

    // checks auth guard for postCertificate when body userId mismatches authenticated user
    it("POST /postCertificate returns 403 on auth mismatch", async () => {
        const res = await request(app)
            .post("/postCertificate")
            .set("x-test-auth-user", "user-1")
            .send({ certId: "c1", username: "john", userId: "user-2" });

        expect(res.status).toBe(403);
        expect(hoisted.queryMock).not.toHaveBeenCalled();
    });

    // checks certificate insert when authenticated user matches body userId
    it("POST /postCertificate returns 200 on successful insert", async () => {
        hoisted.queryMock.mockResolvedValueOnce({ rowCount: 1 });

        const res = await request(app)
            .post("/postCertificate")
            .set("x-test-auth-user", "user-1")
            .send({ certId: "c1", username: "john", userId: "user-1" });

        expect(res.status).toBe(200);
    });

    // checks createTest 429 branch when AI limit is exhausted
    it("GET /createTest/:testDifficulty returns 429 when AI limit is exhausted", async () => {
        hoisted.getAiLimitMock.mockResolvedValueOnce(1);

        const res = await request(app).get("/createTest/easy");

        expect(res.status).toBe(429);
    });

    // checks easy createTest flow: selecting questions, decreasing AI limit, and response payload
    it("GET /createTest/:testDifficulty returns generated easy test and decreases AI limit", async () => {
        const easyQuestions = Array.from({ length: 8 }).map((_, i) => ({
            id: `e${i}`,
            difficulty: "easy",
            free_answer: false,
            answers: [
                { text: "a", correct: true },
                { text: "b", correct: false },
                { text: "c", correct: false },
                { text: "d", correct: false },
                { text: "Neodpovedat", correct: null },
            ],
        }));
        const mediumQuestions = Array.from({ length: 5 }).map((_, i) => ({
            id: `m${i}`,
            difficulty: "medium",
            free_answer: false,
            answers: [
                { text: "a", correct: true },
                { text: "b", correct: false },
                { text: "c", correct: false },
                { text: "d", correct: false },
                { text: "Neodpovedat", correct: null },
            ],
        }));

        hoisted.getQuestionsBasedOnDifficultyMock
            .mockResolvedValueOnce(easyQuestions)
            .mockResolvedValueOnce(mediumQuestions);

        const res = await request(app).get("/createTest/easy");

        expect(res.status).toBe(200);
        expect(res.body.createdTest).toHaveLength(10);
        expect(hoisted.decreaseAiLimitMock).toHaveBeenCalledTimes(1);
    });

    // checks successful submitTest branch including addTest call and response payload
    it("POST /submitTest returns calculated result payload when insert succeeds", async () => {
        hoisted.calculateTestScoreMock.mockResolvedValueOnce(8);
        hoisted.getGradeMock.mockReturnValueOnce("B");
        hoisted.getMedalMock.mockReturnValueOnce("none");
        hoisted.addTestMock.mockResolvedValueOnce(true);

        const res = await request(app).post("/submitTest").send({
            userId: "user-1",
            testId: "t1",
            testDifficulty: "easy",
            testStructure: [{ id: 1 }],
        });

        expect(res.status).toBe(200);
        expect(res.body).toEqual({
            results: { percentage: "61.54", points: 8, medal: "none", grade: "B" },
            structure: [{ id: 1 }],
        });
        expect(hoisted.addTestMock).toHaveBeenCalledTimes(1);
    });

    // checks submitTest 500 branch when addTest returns false
    it("POST /submitTest returns 500 when addTest returns false", async () => {
        hoisted.addTestMock.mockResolvedValueOnce(false);

        const res = await request(app).post("/submitTest").send({
            userId: "user-1",
            testId: "t1",
            testDifficulty: "easy",
            testStructure: [{ id: 1 }],
        });

        expect(res.status).toBe(500);
    });

    // checks submitTest 500 branch when addTest throws
    it("POST /submitTest returns 500 when addTest throws", async () => {
        hoisted.addTestMock.mockRejectedValueOnce(new Error("insert failed"));

        const res = await request(app).post("/submitTest").send({
            userId: "user-1",
            testId: "t1",
            testDifficulty: "easy",
            testStructure: [{ id: 1 }],
        });

        expect(res.status).toBe(500);
    });

    // checks getAiLimit mapping from DB value to response object
    it("GET /getAiLimit returns aiLimit value", async () => {
        hoisted.queryMock.mockResolvedValueOnce({ rows: [{ ai_limit: 12 }] });

        const res = await request(app).get("/getAiLimit");

        expect(res.status).toBe(200);
        expect(res.body).toEqual({ aiLimit: 12 });
    });

    // checks getAiLimit 400 branch when no row is returned
    it("GET /getAiLimit returns 400 when no AI limit row exists", async () => {
        hoisted.queryMock.mockResolvedValueOnce({ rows: [] });

        const res = await request(app).get("/getAiLimit");

        expect(res.status).toBe(400);
    });
});

