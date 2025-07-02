import { useContext } from "react";
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../utiltis/api/api";
import classes from "./Register.module.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useEffect } from "react";
import { AppState } from "../../App";
function Register() {
  const navigate = useNavigate();
const { isLoggedIn } = useContext(AppState);
  // refs
  const usernameDome = useRef();
  const firstnameDome = useRef();
  const lastnameDome = useRef();
  const emailDom = useRef();
  const passwordDome = useRef();

  // states
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  useEffect(() => {
    if (isLoggedIn) {
      navigate("/", { replace: true });
    }
  }, [isLoggedIn]);
  const validateFields = () => {
    const newErrors = {};
    if (!usernameDome.current.value.trim()) newErrors.username = true;
    if (!firstnameDome.current.value.trim()) newErrors.firstname = true;
    if (!lastnameDome.current.value.trim()) newErrors.lastname = true;
    if (!emailDom.current.value.trim()) newErrors.email = true;
    if (!passwordDome.current.value.trim()) newErrors.password = true;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validateFields()) return;

    try {
      await api.post("/users/register", {
        username: usernameDome.current.value,
        firstname: firstnameDome.current.value,
        lastname: lastnameDome.current.value,
        email: emailDom.current.value,
        password: passwordDome.current.value,
      });

      navigate("/login");
    } catch (error) {
      const serverMsg = error.response?.data?.msg || "Registration failed";
      console.error("Registration error:", serverMsg);
      setErrors({ server: serverMsg });
    }
    
  }

  return (
    <section className={classes.Registercontainer}>
      <div className={classes.container}>
        <section className={classes.registration_section}>
          <form className={classes.RegisterForm} onSubmit={handleSubmit}>
            <h3>Join the Network</h3>
            {errors.server && (
              <p className={classes.serverError}>{errors.server}</p>
            )}

            <p>
              Already have an account?
              <Link className={classes.loginLink} to="/login">
                sign in
              </Link>
            </p>
            <input
              className={`${classes.RegisterFormHeader} ${
                errors.username ? classes.error : ""
              }`}
              ref={usernameDome}
              type="text"
              placeholder="Username *"
            />

            <div className={classes.form_flex}>
              <input
                className={`${classes.RegisterFormHeader} ${
                  errors.firstname ? classes.error : ""
                }`}
                ref={firstnameDome}
                type="text"
                placeholder="First name *"
              />

              <input
                className={`${classes.RegisterFormHeader} ${
                  errors.lastname ? classes.error : ""
                }`}
                ref={lastnameDome}
                type="text"
                placeholder="Last name *"
              />
            </div>

            <input
              className={`${classes.RegisterFormHeader} ${
                errors.email ? classes.error : ""
              }`}
              ref={emailDom}
              type="email"
              placeholder="Email *"
            />

            <div className={classes.passwordField}>
              <input
                className={`${classes.RegisterFormHeader} ${
                  errors.password ? classes.error : ""
                }`}
                ref={passwordDome}
                type={showPassword ? "text" : "password"}
                placeholder="Password *"
              />
              <span onClick={() => setShowPassword((prev) => !prev)}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <p>
              I agree to the <a href="#">privacy policy</a> and{" "}
              <a href="#">terms of service</a>
            </p>

            <button type="submit">Agree and Join</button>
            <p>Already have an account?</p>
          </form>
        </section>
      </div>
    </section>
  );
}
export default Register;
