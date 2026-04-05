import {beforeEach, describe, expect, it, vi} from "vitest";
import getQuestionsBasedOnDifficulty from "../../steps/questionsSteps.js";

const { queryMock } = vi.hoisted(() => ({
    queryMock: vi.fn(),
}));

vi.mock("../../database.js", () => ({
    default: {
        query: queryMock,
    },
}));

describe("questionsSteps helpers", () => {
    beforeEach(() => {
        queryMock.mockReset();
    });

    // checks that helper returns null when no questions match the difficulty
    it("returns null when no questions are found", async () => {
        queryMock.mockResolvedValueOnce({ rowCount: 0, rows: [] });

        const result = await getQuestionsBasedOnDifficulty("easy", "easy");
        expect(result).toBeNull();
    });

    // checks that helper returns null when a question exists but answers are missing
    it("returns null when question exists but answers are missing", async () => {
        queryMock
            .mockResolvedValueOnce({
                rowCount: 1,
                rows: [{ id: 1, body: "Q1", difficulty: "easy", free_answer: false }],
            })
            .mockResolvedValueOnce({ rowCount: 0, rows: [] });

        const result = await getQuestionsBasedOnDifficulty("easy", "easy");
        expect(result).toBeNull();
    });

    // checks that each question is returned with its related answers
    it("returns merged question + answers list for non-free questions", async () => {
        queryMock
            .mockResolvedValueOnce({
                rowCount: 2,
                rows: [
                    { id: 1, body: "Q1", difficulty: "easy", free_answer: false },
                    { id: 2, body: "Q2", difficulty: "easy", free_answer: false },
                ],
            })
            .mockResolvedValueOnce({
                rowCount: 1,
                rows: [{ id: 101, text: "A1", correct: true, question_id: 1 }],
            })
            .mockResolvedValueOnce({
                rowCount: 1,
                rows: [{ id: 201, text: "B1", correct: false, question_id: 2 }],
            });

        const result = await getQuestionsBasedOnDifficulty("easy", "easy");

        expect(result).toHaveLength(2);
        expect(result[0].answers).toEqual([{ id: 101, text: "A1", correct: true, question_id: 1 }]);
        expect(result[1].answers).toEqual([{ id: 201, text: "B1", correct: false, question_id: 2 }]);
    });

    // checks that easy mode filters to single-select questions
    it("uses multiselect=false filter for easy test mode", async () => {
        queryMock.mockResolvedValueOnce({ rowCount: 0, rows: [] });

        await getQuestionsBasedOnDifficulty("easy", "easy");

        const firstQuery = queryMock.mock.calls[0][0];
        expect(firstQuery).toContain("multiselect = false");
    });

    // checks that freeQuestion=true uses the free-answer query branch
    it("uses free_answer query branch when freeQuestion=true", async () => {
        queryMock.mockResolvedValueOnce({ rowCount: 0, rows: [] });

        await getQuestionsBasedOnDifficulty("medium", "hard", true);

        const firstQuery = queryMock.mock.calls[0][0];
        expect(firstQuery).toContain("free_answer = true");
    });
});

