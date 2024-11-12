document
  .getElementById("loginForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the default form submission

    const userName = document.getElementById("userName").value;
    const password = document.getElementById("password").value;

    // Create the data object
    const userData = {
      userInput: userName,
      password: password,
    };

    // Send the data to the backend
    fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        if (data.token) {
          document.getElementById("responseMessage").innerText = data.message;
          showAlert(data.message, "success");
          document.getElementById("loginForm").reset();

          // Store the token in sessionStorage
          sessionStorage.setItem("authToken", data.token);

          // Redirect to homepage if login is successful
          setTimeout(() => {
            window.location.href = "homepage.html";
          }, 1000);
        } else {
          showAlert(data.message, "error");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        document.getElementById("responseMessage").innerText =
          "An error occurred. Please try again.";
      });
  });
function showAlert(message, type) {
  const alertBox = document.getElementById("responseMessage");
  alertBox.innerText = message;
  alertBox.className = type; // Set the class for styling
  alertBox.style.display = "block"; // Show the alert

  // Automatically hide the alert after 3 seconds
  setTimeout(() => {
    alertBox.style.display = "none";
  }, 3000);
}