
require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");

const port = process.env.PORT || 5500;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
//check connection
const dbCon = require("./db/dbConfig");
//auth middleware
const authMiddleware = require("./middleware/authMiddleware");

app.get("/", (req, res) => {
  res.send("Welcome to the Evangadi Forum API");
  console.log("request received at root endpoint");
});

//user routes middleware
const userRoutes = require("./routes/userRoutes");

//user routes middleware
app.use("/api/users", userRoutes);

//question routes middleware
const questionRoutes = require("./routes/questionRoutes");
app.use("/api/questions", authMiddleware, questionRoutes);
// answer routes middleware
const answerRoutes = require("./routes/answerRoutes");
app.use("/api/answers", authMiddleware, answerRoutes);

async function start() {
  try {
    // Test database connection
    await dbCon.execute("select 'test'");
    //create table if not exists
    const createTable = require("./migrate/createTable");
    await createTable();

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}
start();