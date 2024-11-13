import React, { useState } from 'react';
import './Styles/register.css';
import { Link } from 'react-router-dom';

const RegistrationPage = () => {
  const [fullName, setFullName] = useState('');
  const [userName, setUserName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [emailID, setEmailID] = useState('');
  const [password, setPassword] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent the default form submission

    // Create the data object
    const userData = {
      fullName,
      userName,
      mobileNumber,
      emailID,
      password,
    };

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
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
      setResponseMessage(data.message);
      showAlert(data.message, 'success');
      resetForm();

      // Redirect to login page after 1 second
      setTimeout(() => {
        window.location.href = "login.html";
      }, 1000);
    } catch (error) {
      console.error("Error:", error);
      setResponseMessage("An error occurred. Please try again.");
      showAlert("An error occurred. Please try again.", 'error');
    }
  };

  const showAlert = (message, type) => {
    setResponseMessage(message);
    setMessageType(type);

    // Automatically hide the alert after 3 seconds
    setTimeout(() => {
      setResponseMessage('');
    }, 3000);
  };

  const resetForm = () => {
    setFullName('');
    setUserName('');
    setMobileNumber('');
    setEmailID('');
    setPassword('');
  };

  return (
    <div className="container">
      <h1>Register</h1>
      <form id="registrationForm" onSubmit={handleSubmit}>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Full Name"
          minLength="3"
          maxLength="20"
          required
        />
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="User  Name"
          minLength="3"
          maxLength="20"
          required
        />
        <input
          type="text"
          value={mobileNumber}
          onChange={(e) => setMobileNumber(e.target.value)}
          placeholder="Mobile Number"
          minLength="10"
        />
        <input
          type="email"
          value={emailID}
          onChange={(e) => setEmailID(e.target.value)}
          placeholder="Email ID"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          minLength="8"
          required
        />
        <div className="button-box">
          <button type="submit">Register</button>
        </div>
      </form>
      {responseMessage && (
        <div id="responseMessage" className={messageType}>
          {responseMessage}
        </div>
      )}
      <div id="line">
        If already registered then <Link to="/"> Login</Link>
      </div>
    </div>
  );
};

export default RegistrationPage;