import {beforeEach, describe, expect, it, vi} from "vitest";
import {readFileSync} from "node:fs";
import {
    addTest,
    calculateTestScore,
    createTestSessionToken,
    decreaseAiLimit,
    getAiLimit,
    getBestTestScore,
    getCurrentTimestamp,
    getGrade,
    getMedal,
    getRandomElementsFromArray,
    getTestLengthMinutes,
    shuffleArray,
    verifyTestSessionToken,
} from "../../steps/testSteps.js";

const hoisted = vi.hoisted(() => ({
    queryMock: vi.fn(),
    aiCorrectFreeAnswerQuestionsMock: vi.fn(),
}));

vi.mock("../../database.js", () => ({
    default: {
        query: hoisted.queryMock,
    },
}));

vi.mock("../../steps/geminiSteps.js", () => ({
    aiCorrectFreeAnswerQuestions: hoisted.aiCorrectFreeAnswerQuestionsMock,
}));

const scoreFixtures = JSON.parse(
    readFileSync(new URL("./testStructures/calculateScoreStructures.json", import.meta.url), "utf8"),
);

function cloneScoreFixture(testDifficulty) {
    return JSON.parse(JSON.stringify(scoreFixtures[testDifficulty]));
}

describe("testSteps helpers", () => {
    beforeEach(() => {
        hoisted.queryMock.mockReset();
        hoisted.aiCorrectFreeAnswerQuestionsMock.mockReset();
    });

    // checks that getBestTestScore returns the highest percentage in the list
    it("getBestTestScore returns the maximum percentage", () => {
        const best = getBestTestScore([
            { percentage: 51.2 },
            { percentage: 87.9 },
            { percentage: 73.4 },
        ]);

        expect(best).toBe(87.9);
    });

    // checks grade boundaries
    it("getGrade returns expected grade at boundaries", () => {
        expect(getGrade(92)).toBe("A");
        expect(getGrade(83)).toBe("B");
        expect(getGrade(74)).toBe("C");
        expect(getGrade(65)).toBe("D");
        expect(getGrade(56)).toBe("E");
        expect(getGrade(55.99)).toBe("Fx");
    });

    // checks medal rules by grade and difficulty
    it("getMedal returns medal only for grade A with matching difficulty", () => {
        expect(getMedal("A", "easy")).toBe("Bronze");
        expect(getMedal("A", "medium")).toBe("Silver");
        expect(getMedal("A", "hard")).toBe("Gold");
        expect(getMedal("B", "hard")).toBe("None");
    });

    // checks that timestamp helper returns a valid ISO string
    it("getCurrentTimestamp returns a valid ISO timestamp", () => {
        const ts = getCurrentTimestamp();
        expect(Number.isNaN(Date.parse(ts))).toBe(false);
    });

    // checks duration lookup for each known difficulty and invalid input
    it("getTestLengthMinutes returns expected values for valid and invalid difficulties", () => {
        expect(getTestLengthMinutes("easy")).toBe(20);
        expect(getTestLengthMinutes("medium")).toBe(40);
        expect(getTestLengthMinutes("hard")).toBe(60);
        expect(getTestLengthMinutes("unknown")).toBeNull();
    });

    // checks that shuffle keeps elements and length, only order may change
    it("shuffleArray keeps same elements and length", () => {
        const arr = [1, 2, 3, 4, 5];
        shuffleArray(arr);

        expect(arr).toHaveLength(5);
        expect([...arr].sort((a, b) => a - b)).toEqual([1, 2, 3, 4, 5]);
    });

    // checks that a random selector pushes exactly N items from source to target
    it("getRandomElementsFromArray pushes required number of items", () => {
        const from = ["a", "b", "c", "d"];
        const to = [];
        getRandomElementsFromArray(from, to, 2);

        expect(to).toHaveLength(2);
        expect(from).toContain(to[0]);
        expect(from).toContain(to[1]);
    });

    // checks that addTest returns true when insert affects at least one row
    it("addTest returns true on successful insert", async () => {
        hoisted.queryMock.mockResolvedValueOnce({ rowCount: 1 });

        const inserted = await addTest("t1", 10, "50.00", "2026-01-01", "C", "None", "u1", [{ id: 1 }], "easy");
        expect(inserted).toBe(true);
    });

    // checks that addTest returns false when insert affects no rows
    it("addTest returns false when no row was inserted", async () => {
        hoisted.queryMock.mockResolvedValueOnce({ rowCount: 0 });

        const inserted = await addTest("t1", 10, "50.00", "2026-01-01", "C", "None", "u1", [{ id: 1 }], "easy");
        expect(inserted).toBe(false);
    });

    // checks reading AI limit from database row
    it("getAiLimit returns ai_limit from database row", async () => {
        hoisted.queryMock.mockResolvedValueOnce({ rows: [{ ai_limit: 17 }] });
        const limit = await getAiLimit();
        expect(limit).toBe(17);
    });

    // checks that decreaseAiLimit executes an update query
    it("decreaseAiLimit executes update query", async () => {
        hoisted.queryMock.mockResolvedValueOnce({ rowCount: 1 });
        await decreaseAiLimit();
        expect(hoisted.queryMock).toHaveBeenCalledTimes(1);
    });

    // checks decreaseAiLimit swallows DB errors and does not throw
    it("decreaseAiLimit does not throw when update query fails", async () => {
        hoisted.queryMock.mockRejectedValueOnce(new Error("update failed"));
        await expect(decreaseAiLimit()).resolves.toBeUndefined();
    });

    // checks token roundtrip between create and verify helpers
    it("createTestSessionToken and verifyTestSessionToken roundtrip the payload", () => {
        const payload = {
            userId: "user-1",
            testId: "t1",
            testDifficulty: "medium",
            issuedAt: 1,
            expiresAt: 2,
        };

        const token = createTestSessionToken(payload, "secret");
        const parsed = verifyTestSessionToken(token, "secret");

        expect(parsed).toEqual(payload);
    });

    // checks verifyTestSessionToken rejects invalid or malformed tokens
    it("verifyTestSessionToken returns null for invalid token formats and signatures", () => {
        const validToken = createTestSessionToken({ userId: "u1" }, "secret");
        const tamperedToken = validToken.replace(/\.[^.]+$/, ".wrong-signature");

        expect(verifyTestSessionToken(null, "secret")).toBeNull();
        expect(verifyTestSessionToken("plain-string", "secret")).toBeNull();
        expect(verifyTestSessionToken(tamperedToken, "secret")).toBeNull();
    });

    // checks verifyTestSessionToken rejects tokens with invalid JSON payload
    it("verifyTestSessionToken returns null for malformed payload JSON", () => {
        const payload = Buffer.from("{bad-json", "utf8").toString("base64url");
        const signature = Buffer.from("sig", "utf8").toString("base64url");

        expect(verifyTestSessionToken(`${payload}.${signature}`, "secret")).toBeNull();
    });

    // checks score calculation on a larger easy test structure
    it("calculateTestScore returns expected score for complex easy test", async () => {
        const testStructure = cloneScoreFixture("easy");
        const points = await calculateTestScore(testStructure, "easy");

        expect(points).toBeCloseTo(5.4, 5);
        expect(hoisted.aiCorrectFreeAnswerQuestionsMock).not.toHaveBeenCalled();
    });

    // checks score calculation on a larger medium test structure with free-answer correction
    it("calculateTestScore returns expected score for complex medium test", async () => {
        const testStructure = cloneScoreFixture("medium");
        hoisted.aiCorrectFreeAnswerQuestionsMock.mockResolvedValueOnce(
            JSON.stringify([
                { aiResponse: true, free_answer_text: testStructure[3].free_answer_text, difficulty: "medium" },
                { aiResponse: false, free_answer_text: testStructure[4].free_answer_text, difficulty: "hard" },
            ]),
        );
        hoisted.queryMock.mockResolvedValueOnce({ rowCount: 1 });

        const points = await calculateTestScore(testStructure, "medium");

        expect(points).toBeCloseTo(10.25, 5);
        expect(hoisted.aiCorrectFreeAnswerQuestionsMock).toHaveBeenCalledTimes(1);
        expect(hoisted.queryMock).toHaveBeenCalledTimes(1);
    });

    // checks score calculation on a larger hard test structure with mixed question types
    it("calculateTestScore returns expected score for complex hard test", async () => {
        const testStructure = cloneScoreFixture("hard");
        hoisted.aiCorrectFreeAnswerQuestionsMock.mockResolvedValueOnce(
            JSON.stringify([
                { aiResponse: true, free_answer_text: testStructure[3].free_answer_text, difficulty: "hard" },
                { aiResponse: true, free_answer_text: testStructure[4].free_answer_text, difficulty: "medium" },
            ]),
        );
        hoisted.queryMock.mockResolvedValueOnce({ rowCount: 1 });

        const points = await calculateTestScore(testStructure, "hard");

        expect(points).toBeCloseTo(12.45833, 5);
        expect(hoisted.aiCorrectFreeAnswerQuestionsMock).toHaveBeenCalledTimes(1);
        expect(hoisted.queryMock).toHaveBeenCalledTimes(1);
    });

    // checks score clamping so negative totals never go below zero
    it("calculateTestScore clamps negative score to zero", async () => {
        const testStructure = [
            {
                difficulty: "hard",
                multiselect: false,
                free_answer: false,
                answers: [
                    { selected: true, correct: false },
                    { selected: false, correct: false },
                    { selected: false, correct: false },
                    { selected: false, correct: false },
                    { selected: false, correct: null },
                ],
            },
            {
                difficulty: "hard",
                multiselect: false,
                free_answer: false,
                answers: [
                    { selected: true, correct: false },
                    { selected: false, correct: false },
                    { selected: false, correct: false },
                    { selected: false, correct: false },
                    { selected: false, correct: null },
                ],
            },
        ];

        const points = await calculateTestScore(testStructure, "hard");
        expect(points).toBe(0);
    });

    // checks free-answer path when AI returns no result
    it("calculateTestScore skips free-answer bonus when AI response is missing", async () => {
        const testStructure = [
            {
                difficulty: "medium",
                multiselect: false,
                free_answer: true,
                body: "Explain X",
                free_answer_text: "answer",
                answers: [{ selected: false }, { selected: false }, { selected: false }, { selected: false }, { selected: false }],
            },
        ];
        hoisted.aiCorrectFreeAnswerQuestionsMock.mockResolvedValueOnce(null);

        const points = await calculateTestScore(testStructure, "medium");

        expect(points).toBe(0);
        expect(hoisted.queryMock).not.toHaveBeenCalled();
    });
});
