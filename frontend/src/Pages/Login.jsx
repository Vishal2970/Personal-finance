import React, { useState } from "react";
import "./Styles/login.css";
import { Link, useNavigate } from "react-router-dom";
const LoginPage = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Create the data object
    const userData = {
      userInput: userName,
      password: password,
    };

    try {
      const response = await fetch("https://personal-finance-29bb.onrender.com/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      if (data.token) {
        setResponseMessage(data.message);
        setMessageType("success");
        setUserName("");
        setPassword("");

        // Store the token in sessionStorage
        sessionStorage.setItem("authToken", data.token);
        sessionStorage.setItem("userName", data.name);

        // Redirect to homepage if login is successful
        setTimeout(() => {
          navigate("/Home");
        }, 1000);
      } else {
        showAlert(data.message, "error");
      }
    } catch (error) {
      console.error("Error:", error);
      setResponseMessage("An error occurred. Please try again.");
      setMessageType("error");
    }
  };

  const showAlert = (message, type) => {
    setResponseMessage(message);
    setMessageType(type);

    // Automatically hide the alert after 3 seconds
    setTimeout(() => {
      setResponseMessage("");
    }, 3000);
  };

  return (
    <div className="container">
      <h1>Login</h1>
      <form id="loginForm" onSubmit={handleSubmit}>
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="User  Name/Email ID"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <div className="button-box">
          <button type="submit">Login</button>
        </div>
      </form>
      {responseMessage && (
        <div id="responseMessage" className={messageType}>
          {responseMessage}
        </div>
      )}
      <div id="line">
        If not registered yet then <Link to="/Register"> Register</Link>
      </div>
    </div>
  );
};

export default LoginPage;
