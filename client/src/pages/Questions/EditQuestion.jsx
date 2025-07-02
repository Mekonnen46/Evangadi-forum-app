import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../utiltis/api/api";
import styles from "./edit.module.css";

function EditQuestion() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", description: "" });
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function fetchQuestion() {
      try {
        const { data } = await api.get(`/questions/${id}`);
        const question = data.rows[0];
        setForm({
          title: question.title,
          description: question.description,
        });
      } catch (err) {
        console.error("Failed to load question:", err);
        navigate("/");
      }
    }

    fetchQuestion();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/questions/${id}`, form);
      navigate(`/`);
    } catch (err) {
      if (err.response?.status === 403) {
        setErrorMessage(err.response.data.msg);
    }
  }
};

  return (
    <div className={styles.container}>
      <h2>Edit Question</h2>
      {errorMessage && (
        <p className={`${styles.errorMessage} ${styles.messageBounce}`}>
          {errorMessage}
        </p>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
          className={styles.input}
        />
        <textarea
          name="description"
          placeholder="Your question..."
          value={form.description}
          onChange={handleChange}
          required
          className={styles.textarea}
        />
        <button type="submit" className={styles.submitBtn}>
          Save Changes
        </button>
      </form>
    </div>
  );
}

export default EditQuestion;
