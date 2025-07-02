const express = require("express");
const router = express.Router();
const {
  allQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} = require("../controller/questionController");

// get all questions
router.get("/", allQuestions);
// get question by id
router.get("/:id", getQuestionById);
router.put("/:id", updateQuestion);
router.delete("/:id", deleteQuestion);
// create a new question
router.post("/", createQuestion);

module.exports = router;
