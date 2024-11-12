{
  /* <script> */
}
// Get the token from sessionStorage
const token = sessionStorage.getItem("authToken");

if (!token) {
  alert("You are not authorized. Please log in.");
  window.location.href = "login.html"; // Redirect to login if not authorized
} else {
  // Fetch the list of transactions with the token in headers
  fetch("http://localhost:5000/api/page/list_of_transaction", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: token, // Attach the token in the Authorization header
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch transactions.");
      }
      return response.json();
    })
    .then((data) => {
      const transactionList = document.getElementById("transactionList");
      if (data.amountList && data.amountList.length > 0) {
        data.amountList.forEach((transaction) => {
          const transactionItem = document.createElement("div");
          transactionItem.classList.add("transaction");

          // Format and display transaction details
          transactionItem.innerHTML = `
                <h3>${transaction.nameOfTransaction}</h3>
                <p><strong>Amount Added:</strong> ${transaction.amountAdded}</p>
                <p><strong>Date:</strong> ${new Date(
                  transaction.date
                ).toLocaleDateString()}</p>
              `;

          transactionList.appendChild(transactionItem);
        });
      } else {
        transactionList.innerHTML = "<p>No transactions found.</p>";
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      document.getElementById("transactionList").innerHTML =
        "<p>An error occurred while fetching transactions.</p>";
    });
}
{
  /* </script> */
}
