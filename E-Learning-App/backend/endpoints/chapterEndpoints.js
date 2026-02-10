import express from "express";
import pool from "../database.js";

const router = express.Router();

// ------------------GET REQUEST - GET CHAPTER's NOTION ID---------------------------------------------------------------
router.get("/getNotionId/:chapter_number", (request, response)=> {
    const { chapter_number } = request.params;

    const getQuery = 'SELECT notion_page_id FROM chapters WHERE chapter = $1';
    pool.query(getQuery, [chapter_number])
        .then((result) => {
            console.log(result);
            if (result.rows.length === 0) {
                response.status(404);
                response.send("Notion ID not found");
            }
            else{
                response.status(200);
                response.send({
                    notionId: result.rows[0].notion_page_id
                });
            }

        })
        .catch((error) => {
            response.status(500);
            console.log(error);
        })
});

// ------------------GET REQUEST - GET ALL CHAPTERS---------------------------------------------------------------
router.get("/getAllChapters", (request, response)=> {
    const getQuery = 'SELECT * FROM chapters ORDER BY chapter';
    pool.query(getQuery)
        .then((result) => {
            console.log(result);
            if (result.rows.length === 0) {
                response.status(404).send("No chapters found");
            }
            else{
                let foundChapters = result.rows.map(row => ({
                    chapter: row.chapter,
                    notionPageId: row.notion_page_id,
                    imgPath: row.img_path,
                    description: row.description,
                    estimatedTime: row.estimated_time,
                }));
                response.status(200).send(foundChapters);
            }

        })
        .catch((error) => {
            response.status(500);
            console.log(error);
        })
});

export default router;