import React from "react";
import styles from "./pages.module.css";
import { Link } from "react-router-dom";
import SearchOffIcon from "@mui/icons-material/SearchOff";


function PagesNotFound() {
  return (
    <div className={styles.container}>
      <h1 className="fw-bold text-danger">404</h1>

      <h2 className="fw-bold">
        <SearchOffIcon fontSize="large" color="warning"/>
        This page doesn't exist or has been moved.
      </h2>
      <Link to="/" className={styles.homeLink}>
        Go back to Home
      </Link>
    </div>
  );
}

export default PagesNotFound;
