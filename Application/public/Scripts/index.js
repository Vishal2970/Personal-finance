document
  .getElementById("registrationForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the default form submission
    const fullName = document.getElementById("fullName").value;
    const userName = document.getElementById("userName").value;
    const mobileNumber = document.getElementById("mobileNumber").value;
    const emailID = document.getElementById("emailID").value;
    const password = document.getElementById("password").value;

    // Create the data object
    const userData = {
      fullName: fullName,
      userName: userName,
      mobileNumber: mobileNumber,
      emailID: emailID,
      password: password,
    };

    // Send the data to the backend
    fetch("https://personal-finance-cfz3.onrender.com/api/auth/register", {
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
        document.getElementById("responseMessage").innerText = data.message;
        showAlert(data.message, "success");
        document.getElementById("registrationForm").reset();
        setTimeout(() => {
          window.location.href = "login.html";
        }, 1000);
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