const { StatusCodes } = require("http-status-codes");
const dbCon = require("../db/dbConfig");
const { v4: uuidv4 } = require("uuid");

//get all question
async function allQuestions(req, res) {
  try {
    const [questions] = await dbCon.query(`
      SELECT 
         questionsTable.questionid AS question_id,
        questionsTable.title,
       questionsTable.description AS content,
      questionsTable.created_at,
        usersTable.username AS user_name,
        COUNT(answersTable.answerid) AS answerCount
      FROM questionsTable 
      JOIN usersTable ON questionsTable.userid = usersTable.userid
      LEFT JOIN answersTable  ON questionsTable.questionid = answersTable.questionid
      GROUP BY questionsTable.questionid, questionsTable.title, questionsTable.description, questionsTable.created_at, usersTable.username
      ORDER BY questionsTable.created_at DESC
    `);
    return res.status(StatusCodes.OK).json({ questions });
  } catch (err) {
    console.error(err.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Error fetching questions",
    });
  }
}

// Get question by id
async function getQuestionById(req, res) {
  const questionid = req.params.id;
  if (!questionid) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "No question ID provided" });
  }

  try {
    const [rows] = await dbCon.query(
      `SELECT 
         questionsTable.questionid, 
         questionsTable.title, 
         questionsTable.description, 
         usersTable.username 
       FROM questionsTable 
       JOIN usersTable ON questionsTable.userid = usersTable.userid 
       WHERE questionsTable.questionid = ?`,
      [questionid]
    );
    

    if (rows.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        msg: "The requested question could not be found",
      });
    }
    return res.status(StatusCodes.OK).json({ rows });
  } catch (error) {
    console.error("Database error:", error.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "An unexpected error occurred",
    });
  }
}

// // Create a new question
async function createQuestion(req, res) {
  const { title, description, tag } = req.body;
  if (!title || !description) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: "All fields are required",
    });
  }
  try {
    const questionid = uuidv4(); 
    const userid = req.user.userid; 
    const insertQuery = `INSERT INTO questionsTable ( questionid,
      userid, title, description,tag) VALUES (?, ?, ?, ?, ?)`;
    await dbCon.query(insertQuery, [
      questionid,
      userid,
      title,
      description,
      tag,
    ]);

    return res
      .status(StatusCodes.CREATED)
      .json({ msg: "Question created successfully" });
  } catch (error) {
    console.error("Error creating question:", error);

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "An unexpected error occurred.",
    });
  }
}

async function updateQuestion(req, res) {
  const { id } = req.params;
  const { title, description } = req.body;
  try {
    const [answers] = await dbCon.query(
      "SELECT * FROM answersTable WHERE questionid = ?",
      [id]
    );

    if (answers.length > 0) {
      return res.status(StatusCodes.FORBIDDEN).json({
        msg: "You can't edit this question because it already has answers!",
      });
    }

    await dbCon.query(
      "UPDATE questionsTable SET title = ?, description = ? WHERE questionid = ?",
      [title, description, id]
    );
    return res.status(StatusCodes.OK).json({ msg: "Question updated!" });
  } catch (err) {
    console.error(err.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Failed to update question",
    });
  }
}

// delete question function
async function deleteQuestion(req, res) {
  const { id } = req.params;
  try {
    await dbCon.query("DELETE FROM answersTable WHERE questionid = ?", [id]);
    await dbCon.query("DELETE FROM questionsTable WHERE questionid = ?", [id]);
    return res.status(StatusCodes.OK).json({ msg: "Question deleted!" });
  } catch (err) {
    console.error(err.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Failed to delete question",
    });
  }
}
module.exports = {
  allQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
};
