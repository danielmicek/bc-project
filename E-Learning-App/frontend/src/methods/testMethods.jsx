import {GET_Questions} from "./fetchMethods.jsx";

const EASY = "easy"
const MEDIUM = "medium"
const HARD = "hard"

export async function testMaker(testDifficulty){
    let easyQuestions
    let mediumQuestions
    let hardQuestions
    let generatedTestQuestions = [];
    let NUM_OF_EASY_QUESTIONS;
    let NUM_OF_MEDIUM_QUESTIONS;
    let NUM_OF_HARD_QUESTIONS

    easyQuestions = await GET_Questions(EASY, testDifficulty)
    mediumQuestions = await GET_Questions(MEDIUM, testDifficulty)
    if(testDifficulty === "medium" || testDifficulty === "hard") hardQuestions = await GET_Questions(HARD, testDifficulty)

    try{
        switch (testDifficulty) {
            case "easy":
                NUM_OF_EASY_QUESTIONS = 7
                NUM_OF_MEDIUM_QUESTIONS = 3
                break
            case "medium":
                NUM_OF_EASY_QUESTIONS = 5
                NUM_OF_MEDIUM_QUESTIONS = 10
                NUM_OF_HARD_QUESTIONS = 5
                break
            case "hard":
                NUM_OF_EASY_QUESTIONS = 5
                NUM_OF_MEDIUM_QUESTIONS = 10
                NUM_OF_HARD_QUESTIONS = 15
        }
    }
    catch(err){
        console.log("Error during getting questions from database.");
    }

    // add easy questions
    getRandomElementsFromArray(easyQuestions, generatedTestQuestions, NUM_OF_EASY_QUESTIONS)
    // add medium questions
    getRandomElementsFromArray(mediumQuestions, generatedTestQuestions, NUM_OF_MEDIUM_QUESTIONS)
    // add hard questions (medium and hard test)
    if(testDifficulty === "medium" || testDifficulty === "hard") getRandomElementsFromArray(hardQuestions, generatedTestQuestions, NUM_OF_HARD_QUESTIONS)

    //shuffle each question's answers (from a,b,c,d,e to e.g. c,a,d,b,e  -> e is always last)
    for(const question of generatedTestQuestions){
        const lastElement = question.answers[question.answers.length - 1]
        const allElementsExceptLast = question.answers.slice(0, -1)

        shuffleArray(allElementsExceptLast)
        question.answers = [...allElementsExceptLast, lastElement];   // the last choice - "neodpovedať" stays last after shuffle
    }


    // TODO funguje to, zakomentoval som to aby to nezralo tokeny pri kazdom nacitani stranky
    /*const aiResponse =
        await GET_ai_response(
            "You will receive JSON. Edit it in-place.\n" +
            "GOAL: Paraphrase each item.body and each answers[i].text EXCEPT the last answer in each answers array. Preserve meaning strictly.\n" +
            "OUTPUT (MUST):\n" +
            "- Return ONLY raw JSON (no markdown, no ```).\n" +
            "- Output must start with [ or { and end with ] or }.\n" +
            "- Keep EXACT same JSON structure: same keys, nesting, array lengths, and order.\n" +
            "- Do NOT add/remove/rename keys. Do NOT add extra fields or text.\n" +
            "- Do NOT change ids, numbers, names, units, code, punctuation that changes meaning or language (KEEP SLOVAK)\n" +
            "- Leave the last answers element unchanged (answers[answers.length-1]).\n" +
            "INPUT:\n" + JSON.stringify(generatedTestQuestions)
        )

    generatedTestQuestions = JSON.parse(aiResponse.result)*/

    return generatedTestQuestions;
}


export function getBestTestScore(tests){
    if(tests.length === 0) return "N/A"
    let bestScore = 0
    for(const test of tests){
        if(test.percentage > bestScore) bestScore = test.percentage
    }
    return bestScore;
}
// ----------- HELPER METHODS --------------------------------------------------------

function getRandomElementsFromArray(fromArray, toArray, numberOfElements) {
    shuffleArray(fromArray)
    toArray.push(...fromArray.slice(0, numberOfElements));
}

function shuffleArray(array) {
    let currentIndex = array.length;

    while (currentIndex !== 0) {
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
}