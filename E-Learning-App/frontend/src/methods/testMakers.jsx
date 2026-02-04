import {GET_Questions} from "./fetchMethods.jsx";

const EASY = "easy"
const MEDIUM = "medium"
const HARD = "hard"

// 10 questions -> 7 easy, 3 medium
// only single-select
export async function easyTestMaker(){
    let easyQuestions = [];
    let mediumQuestions = [];
    let generatedTestQuestions = [];
    const NUM_OF_EASY_QUESTIONS = 7;
    const NUM_OF_MEDIUM_QUESTIONS = 3;

    try{
        easyQuestions = await GET_Questions(EASY, false)
        mediumQuestions = await GET_Questions(MEDIUM, false)
    }
    catch(err){
        console.log("Error during getting questions from databse.");
    }

    // add easy questions
    getRandomElementsFromArray(easyQuestions, generatedTestQuestions, NUM_OF_EASY_QUESTIONS)
    // add medium questions
    getRandomElementsFromArray(mediumQuestions, generatedTestQuestions, NUM_OF_MEDIUM_QUESTIONS)

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


// 200 questions -> 5 easy, 10 medium, 5 hard
// can be either single or multiselect, but the user will know which it is
export async function mediumTestMaker(){
    let easyQuestions = [];
    let mediumQuestions = [];
    let hardQuestions = [];
    let generatedTestQuestions = [];
    const NUM_OF_EASY_QUESTIONS = 5;
    const NUM_OF_MEDIUM_QUESTIONS = 10;
    const NUM_OF_HARD_QUESTIONS = 5;

    try{
        easyQuestions = await GET_Questions(EASY, false)
        mediumQuestions = await GET_Questions(MEDIUM, true)
        hardQuestions = await GET_Questions(HARD, true)
    }
    catch(err){
        console.log("Error during getting questions from databse.");
    }

    // add easy questions
    getRandomElementsFromArray(easyQuestions, generatedTestQuestions, NUM_OF_EASY_QUESTIONS)
    // add medium questions
    getRandomElementsFromArray(mediumQuestions, generatedTestQuestions, NUM_OF_MEDIUM_QUESTIONS)
    // add hard questions
    getRandomElementsFromArray(hardQuestions, generatedTestQuestions, NUM_OF_HARD_QUESTIONS)

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

export async function hardTestMaker(){

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