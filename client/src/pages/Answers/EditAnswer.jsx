import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../utiltis/api/api";
import style from "./answer.module.css";
function EditAnswer() {
  const { id } = useParams(); 
  const [questionId, setQuestionId] = useState(null);
  const navigate = useNavigate();
const [form,setForm]=useState({answer:""})
  useEffect(() => {
    async function fetchAnswer() {
      try {
        const res = await axios.get(`/answers/single/${id}`);
        setForm({ answer: res.data.answer});
        setQuestionId(res.data.questionid);
      } catch (err) {
        console.error("Error fetching answer:", err);
        alert("Failed to load answer.");
      }
    }
    fetchAnswer();
  }, [id]);
const handleChange=(e)=>{
  setForm({...form,[e.target.name]:e.target.value})
}
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `/answers/${id}`,
       form);
      alert("Answer updated!");
      navigate(`/question/${questionId}`);
    } catch (err) {
      console.error("Error updating answer:", err);
      alert("Failed to update answer.");
    }
  };

  return (
    <div
      style={{ padding: "20px", margin: "7% auto 0 auto", maxWidth: "900px" }}
    >
      <h2>Edit Answer</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          value={form.answer}
          name="answer"
          onChange={handleChange}
          style={{
            width: "100%",
            minHeight: "150px",
            padding: "10px",
            marginBottom: "10px",
            border: "1px solid #ccc"
          }}
          className={style.inputArea}
        />
        <button type="submit">Update Answer</button>
      </form>
    </div>
  );
}

export default EditAnswer;
