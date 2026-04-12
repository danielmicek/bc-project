import request from "supertest";
import crypto from "node:crypto";
import {beforeEach, describe, expect, it, vi} from "vitest";
import {createRouterApp} from "../helpers/createRouterApp.js";
import router from "../../endpoints/testEndpoints.js";

const TEST_SESSION_SECRET = process.env.TEST_SESSION_SECRET ?? "dev-test-session-secret";

function createTestSessionToken(payloadObject) {
    const payload = Buffer.from(JSON.stringify(payloadObject)).toString("base64url");
    const signature = crypto
        .createHmac("sha256", TEST_SESSION_SECRET)
        .update(payload)
        .digest("base64url");
    return `${payload}.${signature}`;
}

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
    createTestSessionTokenMock: vi.fn(),
    verifyTestSessionTokenMock: vi.fn(),
    getTestLengthMinutesMock: vi.fn(),
    getAiResponseMock: vi.fn(),
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
    createTestSessionToken: hoisted.createTestSessionTokenMock,
    verifyTestSessionToken: hoisted.verifyTestSessionTokenMock,
    getTestLengthMinutes: hoisted.getTestLengthMinutesMock,
    shuffleArray: hoisted.shuffleArrayMock,
}));

vi.mock("../../steps/geminiSteps.js", () => ({
    getAiResponse: hoisted.getAiResponseMock,
}));

vi.mock("@clerk/clerk-sdk-node", () => ({
    ClerkExpressRequireAuth: () => (req, _res, next) => {
        req.auth = { userId: req.headers["x-test-auth-user"] ?? "user-1" };
        next();
    },
}));

describe("testEndpoints", () => {
    const app = createRouterApp(router);

    beforeEach(() => {
        process.env.AI_LIMIT_RESET_SECRET = "test-reset-secret";
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
        hoisted.createTestSessionTokenMock.mockReset();
        hoisted.verifyTestSessionTokenMock.mockReset();
        hoisted.getTestLengthMinutesMock.mockReset();
        hoisted.getAiResponseMock.mockReset();

        hoisted.getBestTestScoreMock.mockReturnValue(88.5);
        hoisted.getAiLimitMock.mockResolvedValue(10);
        hoisted.getRandomElementsFromArrayMock.mockImplementation((fromArray, toArray, numberOfElements) => {
            toArray.push(...fromArray.slice(0, numberOfElements));
        });
        hoisted.getTestLengthMinutesMock.mockImplementation((difficulty) => {
            switch (difficulty) {
                case "easy":
                    return 20;
                case "medium":
                    return 40;
                case "hard":
                    return 60;
                default:
                    return null;
            }
        });
        hoisted.createTestSessionTokenMock.mockImplementation((payloadObject, secret) => {
            const payload = Buffer.from(JSON.stringify(payloadObject)).toString("base64url");
            const signature = crypto
                .createHmac("sha256", secret)
                .update(payload)
                .digest("base64url");
            return `${payload}.${signature}`;
        });
        hoisted.verifyTestSessionTokenMock.mockImplementation((token, secret) => {
            if (!token || typeof token !== "string" || !token.includes(".")) {
                return null;
            }
            const [payload, signature] = token.split(".");
            const expectedSignature = crypto
                .createHmac("sha256", secret)
                .update(payload)
                .digest("base64url");
            if (signature !== expectedSignature) {
                return null;
            }
            try {
                return JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
            } catch {
                return null;
            }
        });
        hoisted.shuffleArrayMock.mockImplementation(() => {});
        hoisted.decreaseAiLimitMock.mockResolvedValue(undefined);
        hoisted.calculateTestScoreMock.mockResolvedValue(8);
        hoisted.getGradeMock.mockReturnValue("B");
        hoisted.getMedalMock.mockReturnValue("None");
        hoisted.getCurrentTimestampMock.mockReturnValue("2026-04-05T10:00:00.000Z");
        hoisted.addTestMock.mockResolvedValue(true);
        hoisted.getAiResponseMock.mockResolvedValue(JSON.stringify([]));
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
                    medal: "None",
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
                    medal: "None",
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
            rows: [{ percentage: "90.00", points: 9, medal: "Silver", grade: "A", structure: [{ id: 1 }] }],
        });

        const res = await request(app)
            .get("/getTestByTestId/t1/user-1")
            .set("x-test-auth-user", "user-1");

        expect(res.status).toBe(200);
        expect(res.body).toEqual({
            results: { percentage: "90.00", points: 9, medal: "Silver", grade: "A" },
            structure: [{ id: 1 }],
        });
    });

    // checks getTestByTestId 404 branch when the test does not exist
    it("GET /getTestByTestId/:testId/:userId returns 404 when test does not exist", async () => {
        hoisted.queryMock.mockResolvedValueOnce({ rows: [] });

        const res = await request(app)
            .get("/getTestByTestId/t1/user-1")
            .set("x-test-auth-user", "user-1");

        expect(res.status).toBe(404);
        expect(res.body).toEqual({ error: "Test nenájdený", tests: [], bestScore: 0 });
    });

    // checks getTestByTestId 500 branch on DB failure
    it("GET /getTestByTestId/:testId/:userId returns 500 on DB error", async () => {
        hoisted.queryMock.mockRejectedValueOnce(new Error("db failed"));

        const res = await request(app)
            .get("/getTestByTestId/t1/user-1")
            .set("x-test-auth-user", "user-1");

        expect(res.status).toBe(500);
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
            .send({ certId: "c1", userId: "user-2" });

        expect(res.status).toBe(403);
        expect(hoisted.queryMock).not.toHaveBeenCalled();
    });

    // checks certificate insert when authenticated user matches body userId
    it("POST /postCertificate returns 200 on successful insert", async () => {
        hoisted.queryMock.mockResolvedValueOnce({ rowCount: 1 });

        const res = await request(app)
            .post("/postCertificate")
            .set("x-test-auth-user", "user-1")
            .send({ certId: "c1", userId: "user-1" });

        expect(res.status).toBe(200);
    });

    // checks postCertificate 500 branch when insert fails
    it("POST /postCertificate returns 500 on insert failure", async () => {
        hoisted.queryMock.mockRejectedValueOnce(new Error("insert failed"));

        const res = await request(app)
            .post("/postCertificate")
            .set("x-test-auth-user", "user-1")
            .send({ certId: "c1", userId: "user-1" });

        expect(res.status).toBe(500);
    });

    // checks createTest 429 branch when AI limit is exhausted
    it("GET /createTest/:testDifficulty returns 429 when AI limit is exhausted", async () => {
        hoisted.getAiLimitMock.mockResolvedValueOnce(1);

        const res = await request(app).get("/createTest/easy");

        expect(res.status).toBe(429);
    });

    // checks createTest 400 branch when testId query param is missing
    it("GET /createTest/:testDifficulty returns 400 when testId is missing", async () => {
        const res = await request(app).get("/createTest/easy");

        expect(res.status).toBe(400);
    });

    // checks createTest 400 branch when difficulty is invalid
    it("GET /createTest/:testDifficulty returns 400 on invalid difficulty", async () => {
        const res = await request(app)
            .get("/createTest/unknown")
            .query({ testId: "t-create-x" });

        expect(res.status).toBe(400);
    });

    // checks createTest 500 branch when AI returns null
    it("GET /createTest/:testDifficulty returns 500 when AI response is missing", async () => {
        hoisted.getQuestionsBasedOnDifficultyMock
            .mockResolvedValueOnce(Array.from({ length: 8 }).map((_, i) => ({
                id: `e${i}`,
                difficulty: "easy",
                free_answer: false,
                answers: [{ text: "a", correct: true }, { text: "x", correct: false }, { text: "y", correct: false }, { text: "z", correct: false }, { text: "Neodpovedat", correct: null }],
            })))
            .mockResolvedValueOnce(Array.from({ length: 5 }).map((_, i) => ({
                id: `m${i}`,
                difficulty: "medium",
                free_answer: false,
                answers: [{ text: "a", correct: true }, { text: "x", correct: false }, { text: "y", correct: false }, { text: "z", correct: false }, { text: "Neodpovedat", correct: null }],
            })));
        hoisted.getAiResponseMock.mockResolvedValueOnce(null);

        const res = await request(app).get("/createTest/easy").query({ testId: "t-create-2" });

        expect(res.status).toBe(500);
    });

    // checks createTest 500 branch when AI returns invalid JSON
    it("GET /createTest/:testDifficulty returns 500 when AI JSON parsing fails", async () => {
        hoisted.getQuestionsBasedOnDifficultyMock
            .mockResolvedValueOnce(Array.from({ length: 8 }).map((_, i) => ({
                id: `e${i}`,
                difficulty: "easy",
                free_answer: false,
                answers: [{ text: "a", correct: true }, { text: "x", correct: false }, { text: "y", correct: false }, { text: "z", correct: false }, { text: "Neodpovedat", correct: null }],
            })))
            .mockResolvedValueOnce(Array.from({ length: 5 }).map((_, i) => ({
                id: `m${i}`,
                difficulty: "medium",
                free_answer: false,
                answers: [{ text: "a", correct: true }, { text: "x", correct: false }, { text: "y", correct: false }, { text: "z", correct: false }, { text: "Neodpovedat", correct: null }],
            })));
        hoisted.getAiResponseMock.mockResolvedValueOnce("{invalid-json");

        const res = await request(app).get("/createTest/easy").query({ testId: "t-create-3" });

        expect(res.status).toBe(500);
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
        hoisted.getAiResponseMock.mockResolvedValueOnce(
            JSON.stringify([...easyQuestions.slice(0, 7), ...mediumQuestions.slice(0, 3)]),
        );

        const res = await request(app).get("/createTest/easy").query({ testId: "t-create-1" });

        expect(res.status).toBe(200);
        expect(res.body.createdTest).toHaveLength(10);
        expect(typeof res.body.testSessionToken).toBe("string");
        expect(res.body.testLengthMinutes).toBe(20);
        expect(hoisted.decreaseAiLimitMock).toHaveBeenCalledTimes(1);
    });

    // checks medium createTest path with extra hard and free-answer question sources
    it("GET /createTest/:testDifficulty returns generated medium test with expected length", async () => {
        const easyQuestions = Array.from({ length: 5 }).map((_, i) => ({
            id: `e${i}`,
            difficulty: "easy",
            free_answer: false,
            answers: [{ text: "a", correct: true }, { text: "b", correct: false }, { text: "c", correct: false }, { text: "d", correct: false }, { text: "Neodpovedat", correct: null }],
        }));
        const mediumQuestions = Array.from({ length: 8 }).map((_, i) => ({
            id: `m${i}`,
            difficulty: "medium",
            free_answer: false,
            answers: [{ text: "a", correct: true }, { text: "b", correct: false }, { text: "c", correct: false }, { text: "d", correct: false }, { text: "Neodpovedat", correct: null }],
        }));
        const hardQuestions = Array.from({ length: 5 }).map((_, i) => ({
            id: `h${i}`,
            difficulty: "hard",
            free_answer: false,
            answers: [{ text: "a", correct: true }, { text: "b", correct: false }, { text: "c", correct: false }, { text: "d", correct: false }, { text: "Neodpovedat", correct: null }],
        }));
        const mediumFree = [{ id: "mf1", difficulty: "medium", free_answer: true, answers: [] }];
        const hardFree = [{ id: "hf1", difficulty: "hard", free_answer: true, answers: [] }];

        const allQuestions = [...easyQuestions, ...mediumQuestions, ...hardQuestions, ...mediumFree, ...hardFree];

        hoisted.getQuestionsBasedOnDifficultyMock
            .mockResolvedValueOnce(easyQuestions)
            .mockResolvedValueOnce(mediumQuestions)
            .mockResolvedValueOnce(hardQuestions)
            .mockResolvedValueOnce(mediumFree)
            .mockResolvedValueOnce(hardFree);
        hoisted.getAiResponseMock.mockResolvedValueOnce(JSON.stringify(allQuestions));

        const res = await request(app).get("/createTest/medium").query({ testId: "t-create-4" });

        expect(res.status).toBe(200);
        expect(res.body.createdTest).toHaveLength(20);
        expect(res.body.testLengthMinutes).toBe(40);
    });

    // checks successful submitTest branch including addTest call and response payload
    it("POST /submitTest returns calculated result payload when insert succeeds", async () => {
        hoisted.calculateTestScoreMock.mockResolvedValueOnce(8);
        hoisted.getGradeMock.mockReturnValueOnce("B");
        hoisted.getMedalMock.mockReturnValueOnce("None");
        hoisted.addTestMock.mockResolvedValueOnce(true);

        const token = createTestSessionToken({
            userId: "user-1",
            testId: "t1",
            testDifficulty: "easy",
            issuedAt: Date.now() - 10_000,
            expiresAt: Date.now() + 60_000,
        });

        const res = await request(app).post("/submitTest").send({
            userId: "user-1",
            testId: "t1",
            testDifficulty: "easy",
            testStructure: [{ id: 1 }],
            testSessionToken: token,
        });

        expect(res.status).toBe(200);
        expect(res.body).toEqual({
            results: { percentage: "61.54", points: 8, medal: "None", grade: "B" },
            structure: [{ id: 1 }],
        });
        expect(hoisted.addTestMock).toHaveBeenCalledTimes(1);
    });

    // checks submitTest 403 on auth mismatch before token work starts
    it("POST /submitTest returns 403 when authenticated user mismatches body userId", async () => {
        const res = await request(app)
            .post("/submitTest")
            .set("x-test-auth-user", "user-2")
            .send({
                userId: "user-1",
                testId: "t1",
                testDifficulty: "easy",
                testStructure: [{ id: 1 }],
                testSessionToken: "invalid-token",
            });

        expect(res.status).toBe(403);
        expect(hoisted.calculateTestScoreMock).not.toHaveBeenCalled();
    });

    // checks submitTest 500 because insert test into DB failed
    it("POST /submitTest returns 500 when adding test to db fails", async () => {
        hoisted.addTestMock.mockResolvedValueOnce(false);
        const token = createTestSessionToken({
            userId: "user-1",
            testId: "t1",
            testDifficulty: "easy",
            issuedAt: Date.now() - 10_000,
            expiresAt: Date.now() + 60_000,
        });

        const res = await request(app).post("/submitTest").send({
            userId: "user-1",
            testId: "t1",
            testDifficulty: "easy",
            testStructure: [{ id: 1 }],
            testSessionToken: token,
        });

        expect(res.status).toBe(500);
    });

    // checks submitTest 403 when token userId does not match request
    it("POST /submitTest returns 403 when token userId mismatches body userId", async () => {
        const token = createTestSessionToken({
            userId: "user-2",
            testId: "t1",
            testDifficulty: "easy",
            issuedAt: Date.now() - 10_000,
            expiresAt: Date.now() + 60_000,
        });

        const res = await request(app).post("/submitTest").send({
            userId: "user-1",
            testId: "t1",
            testDifficulty: "easy",
            testStructure: [{ id: 1 }],
            testSessionToken: token,
        });

        expect(res.status).toBe(403);
    });

    // checks submitTest 403 when token testId mismatches body testId
    it("POST /submitTest returns 403 when token testId mismatches body testId", async () => {
        const token = createTestSessionToken({
            userId: "user-1",
            testId: "other-test",
            testDifficulty: "easy",
            issuedAt: Date.now() - 10_000,
            expiresAt: Date.now() + 60_000,
        });

        const res = await request(app).post("/submitTest").send({
            userId: "user-1",
            testId: "t1",
            testDifficulty: "easy",
            testStructure: [{ id: 1 }],
            testSessionToken: token,
        });

        expect(res.status).toBe(403);
    });

    // checks submitTest 403 when token difficulty mismatches body difficulty
    it("POST /submitTest returns 403 when token difficulty mismatches body difficulty", async () => {
        const token = createTestSessionToken({
            userId: "user-1",
            testId: "t1",
            testDifficulty: "medium",
            issuedAt: Date.now() - 10_000,
            expiresAt: Date.now() + 60_000,
        });

        const res = await request(app).post("/submitTest").send({
            userId: "user-1",
            testId: "t1",
            testDifficulty: "easy",
            testStructure: [{ id: 1 }],
            testSessionToken: token,
        });

        expect(res.status).toBe(403);
    });

    // checks submitTest 500 when score calculation throws
    it("POST /submitTest returns 500 when calculateTestScore throws", async () => {
        hoisted.calculateTestScoreMock.mockRejectedValueOnce(new Error("calc failed"));
        const token = createTestSessionToken({
            userId: "user-1",
            testId: "t1",
            testDifficulty: "easy",
            issuedAt: Date.now() - 10_000,
            expiresAt: Date.now() + 60_000,
        });

        const res = await request(app).post("/submitTest").send({
            userId: "user-1",
            testId: "t1",
            testDifficulty: "easy",
            testStructure: [{ id: 1 }],
            testSessionToken: token,
        });

        expect(res.status).toBe(500);
    });

    // checks submitTest 500 branch when addTest throws Error
    it("POST /submitTest returns 500 when addTest throws Error", async () => {
        hoisted.addTestMock.mockRejectedValueOnce(new Error("insert failed"));
        const token = createTestSessionToken({
            userId: "user-1",
            testId: "t1",
            testDifficulty: "easy",
            issuedAt: Date.now() - 10_000,
            expiresAt: Date.now() + 60_000,
        });

        const res = await request(app).post("/submitTest").send({
            userId: "user-1",
            testId: "t1",
            testDifficulty: "easy",
            testStructure: [{ id: 1 }],
            testSessionToken: token,
        });

        expect(res.status).toBe(500);
    });

    // checks submitTest rejects invalid token
    it("POST /submitTest returns 403 when token is invalid", async () => {
        const res = await request(app).post("/submitTest").send({
            userId: "user-1",
            testId: "t1",
            testDifficulty: "easy",
            testStructure: [{ id: 1 }],
            testSessionToken: "invalid-token",
        });

        expect(res.status).toBe(403);
        expect(hoisted.calculateTestScoreMock).not.toHaveBeenCalled();
    });

    // checks submitTest rejects expired token
    it("POST /submitTest returns 408 when token is expired", async () => {
        const token = createTestSessionToken({
            userId: "user-1",
            testId: "t1",
            testDifficulty: "easy",
            issuedAt: Date.now() - 120_000,
            expiresAt: Date.now() - 1_000,
        });

        const res = await request(app).post("/submitTest").send({
            userId: "user-1",
            testId: "t1",
            testDifficulty: "easy",
            testStructure: [{ id: 1 }],
            testSessionToken: token,
        });

        expect(res.status).toBe(408);
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

    // checks getAiLimit 500 branch on DB failure
    it("GET /getAiLimit returns 500 on DB error", async () => {
        hoisted.queryMock.mockRejectedValueOnce(new Error("db failed"));

        const res = await request(app).get("/getAiLimit");

        expect(res.status).toBe(500);
    });

    // checks resetAiLimit success branch
    it("GET /resetAiLimit returns 200 after successful update", async () => {
        hoisted.queryMock.mockResolvedValueOnce({ rowCount: 1 });

        const res = await request(app)
            .get("/resetAiLimit")
            .set("ai_limit_reset_secret", "test-reset-secret");

        expect(res.status).toBe(200);
        expect(hoisted.queryMock).toHaveBeenCalledTimes(1);
    });

    // checks resetAiLimit rejects invalid secret header
    it("GET /resetAiLimit returns 403 when secret header is invalid", async () => {
        const res = await request(app)
            .get("/resetAiLimit")
            .set("ai_limit_reset_secret", "wrong-secret");

        expect(res.status).toBe(403);
        expect(hoisted.queryMock).not.toHaveBeenCalled();
    });

    // checks keepBackendAlive status code
    it("GET /keepBackendAlive returns 204", async () => {
        const res = await request(app).get("/keepBackendAlive");

        expect(res.status).toBe(204);
    });
});
