import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";

function Login() {
  const [errorMessages, setErrorMessages] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);

  const navigate = useNavigate();

  // User Login info
  const database = [
    {
      username: "user1",
      password: "pass1"
    },
    {
      username: "user2",
      password: "pass2"
    }
  ];

  const errors = {
    uname: "Invalid username",
    pass: "Invalid password"
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    var { uname, pass } = document.forms[0];

    // Find user login info
    const userData = database.find((user) => user.username === uname.value);

    if (userData) {
      if (userData.password !== pass.value) {
        setErrorMessages({ name: "pass", message: errors.pass });
        setLoginAttempts((prev) => prev + 1); // Increment login attempts
      } else {
        setIsSubmitted(true);
        // Redirect to dashboard and pass loginAttempts as state
        navigate("/dashboard", { state: { loginAttempts: loginAttempts + 1 } });
      }
    } else {
      setErrorMessages({ name: "uname", message: errors.uname });
      setLoginAttempts((prev) => prev + 1); // Increment login attempts
    }
  };

  const renderErrorMessage = (name) =>
    name === errorMessages.name && (
      <div className="error">{errorMessages.message}</div>
    );

  const renderForm = (
    <div className="form">
      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <label>Username </label>
          <input type="text" name="uname" required />
          {renderErrorMessage("uname")}
        </div>
        <div className="input-container">
          <label>Password </label>
          <input type="password" name="pass" required />
          {renderErrorMessage("pass")}
        </div>
        <div className="button-container">
          <input type="submit" value="Login" />
        </div>
      </form>
    </div>
  );

  return (
    <div className="app">
      <div className="login-form">
        <div className="title">Log In</div>
        {isSubmitted ? <div>Redirecting to Dashboard...</div> : renderForm}
        {/* <div style={{ marginTop: "10px", color: "red" }}>
          Login Attempts: {loginAttempts}
        </div> */}
      </div>
    </div>
  );
}

export default Login;
