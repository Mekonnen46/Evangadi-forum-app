import { useContext, useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "../../utiltis/api/api";
import style from "./answer.module.css";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Pagination from "../Pagination/Pagination";
import { AppState } from "../../App";
import LiveHelpIcon from "@mui/icons-material/LiveHelp";

function Answers() {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [answerText, setAnswerText] = useState("");
const {user}=useContext(AppState)
  const navigate = useNavigate();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const answersPerPage = 4;

  // Calculate pagination values based on real answers
  const indexOfLastAnswer = currentPage * answersPerPage;
  const indexOfFirstAnswer = indexOfLastAnswer - answersPerPage;
  const currentAnswers = answers.slice(indexOfFirstAnswer, indexOfLastAnswer);
  const totalItems = answers.length;

  useEffect(() => {
    async function fetchData() {
      try {
        const qRes = await axios.get(`/questions/${id}`);
        setQuestion(qRes.data.rows[0]);

        const aRes = await axios.get(`/answers/${id}`);
        setAnswers(aRes.data.answers);
      } catch (err) {
        console.error("Error fetching data", err);
        if (err.response?.status === 404) {
          setAnswers([]);
        }
      }
    }

    fetchData();
  }, [id]);

  const handleAnswerSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `/answers/${id}`,
        {
          answer: answerText,
        }
      );

      setAnswerText("");

      const { data } = await axios.get(`/answers/${id}`);

      setAnswers(data.answers);
    } catch (err) {
      console.error("Error submitting answer", err);
    }
  };

  const handleDelete = async (e, id) => {
    e.preventDefault();
    if (window.confirm("Are you sure you want to delete this answer?")) {
      try {
        await axios.delete(`/answers/${id}`);

        setAnswers((prevAnswers) =>
          prevAnswers.filter((a) => a.answerid !== id)
        );
      } catch (err) {
        console.error("Error deleting answer:", err);
      }
    }
  };

  const handleEditAnswer = (id) => navigate(`/update/answers/${id}`);
  return (
    <div className={style.container}>
      <div className={style.questionIcon}>
        <LiveHelpIcon />
        <h2>Question</h2>
      </div>
      <h6>{question?.title}</h6>
      <p>{question?.description}</p>
      <hr />
      <h4 style={{ textAlign: "center" }}>All Answers From The Community</h4>

      <div>
        <div>
          {currentAnswers.map((a) => (
            <div className={style.answerBox} key={a.answerid}>
              <li>
                <div className={style.user}>
                  <AccountCircleIcon />
                  <p>
                    <strong>{a.username}</strong>
                  </p>
                </div>
                <p>
                  {a.answer}
                  {a.isEdited ? (
                    <span className={style.editedLabel}> (edited)</span>
                  ) : null}
                </p>
              </li>
              {user?.username === a.username && (
                <div className={style.btnIcon}>
                  <button
                    className={style.editButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditAnswer(a.answerid);
                    }}
                  >
                    <EditIcon /> Edit
                  </button>

                  <button
                    className={style.deleteButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(e, a.answerid);
                    }}
                  >
                    <DeleteIcon /> Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Post Your Answer Form */}
      <div className={style.form}>
        <h3 style={{ textAlign: "center", marginTop: "1px" }}>
          Answer The Top Question
        </h3>
        <p style={{ textAlign: "center" }}>
          {" "}
          <Link to={"/"}>🏠Home page?</Link>
        </p>
        <form onSubmit={handleAnswerSubmit}>
          <textarea
            placeholder="Your Answer..."
            value={answerText}
            onChange={(e) => setAnswerText(e.target.value)}
            required
            className={style.inputArea}
          />
          <button className={style.submitBtn} type="submit">
            Post Your Answer
          </button>
        </form>
      </div>
      {/* Pagination Component */}
      <Pagination
        itemsPerPage={answersPerPage}
        totalItems={totalItems}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}

export default Answers;
