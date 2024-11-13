const token = sessionStorage.getItem("authToken");
if (!token) {
  alert("You are not authorized. Please log in.");
  window.location.href = "login.html"; // Redirect to login if not authorized
} else {
   // Get the navbar element
   const userNameElement = document.getElementById("user-name");
   const logoutButton = document.getElementById("logout-btn");

   // Set the username if it exists in sessionStorage
   const userName = sessionStorage.getItem("userName");
   if (userName) {
       userNameElement.textContent = userName; // Set the username
   }

   // Add click event listener to the logout button
   logoutButton.addEventListener("click", function() {
       sessionStorage.clear(); // Clear the session storage
       // Optionally, redirect to the login page or another page
       window.location.href = "login.html"; // Change this to your desired page
   });

  functionlistOftrxn(token);
  functionaddAlltrxn(token);
  functioninsertData(token);

  // Fetch the total trnx from the API
  function functionlistOftrxn(token) {
    // fetch("http://localhost:5000/api/page/list_of_transaction", {
    fetch(".././Controllers/pageController/list_of_transaction",{
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
        // Clear previous transaction data
        transactionList.innerHTML = ""; // Clear the table body before adding new rows
        if (data.amountList && data.amountList.length > 0) {
          data.amountList.forEach((transaction) => {
            const transactionItem = document.createElement("tr");
            transactionItem.innerHTML = `
                    <td>${transaction.nameOfTransaction}</td>
                    <td>${transaction.amountAdded}</td>
                    <td>${new Date(transaction.date).toLocaleDateString()}</td>
                    <td><button id="delete" onClick=${functionDeleteParticular(token,transaction._id)} class="addTransaction">Delete</button></td>
                `;
            transactionList.appendChild(transactionItem);
          });
        } else {
          transactionList.innerHTML = `<p>${data.message}</p>`;
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        document.getElementById("transactionList").innerHTML =
          "<tr><td colspan='3'>An error occurred while fetching transactions.</td></tr>";
      });
  }
  // Fetch the total amount from the API
  function functionaddAlltrxn(token) {
    fetch("http://localhost:5000/api/page/addamount", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token, // Attach the token in the Authorization header
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch total amount.");
        }
        return response.json();
      })
      .then((data) => {
        const totalAmountDiv = document.getElementById("totalAmount");

        // Check if totalAmount exists
        if (data.totalAmount !== undefined) {
          totalAmountDiv.innerHTML = `<p>${data.totalAmount}</p>`;
        }
        // If totalAmount doesn't exist but a message is provided
        else if (data.message) {
          totalAmountDiv.innerHTML = `<p>${data.message}</p>`;
        }
        // If neither totalAmount nor message is provided
        else {
          totalAmountDiv.innerHTML = "<p>No data available.</p>"; // Default message
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        document.getElementById(
          "totalAmount"
        ).innerHTML = `<p>${error.message}</p>`;
        // "<p>An error occurred while fetching the total amount.</p>";
      });
  }
  // Add data using API in database
  function functioninsertData(token) {
    document
      .getElementById("addTransaction")
      .addEventListener("click", function () {
        const Amount = parseFloat(document.getElementById("amount").value);
        const transactionType = document.querySelector(
          'input[name="transactionType"]:checked'
        ).value;
        const transactionName = document
          .getElementById("transactionName")
          .value.trim();

        // Validate inputs
        if (!transactionName || isNaN(Amount)) {
          alert("Please fill in all fields correctly");
          return;
        }

        const isWithdrawal = transactionType === "Withdrawal";
        // Object of transaction
        const transactionData = {
          Amount: Amount,
          Withdrawal: isWithdrawal,
          nameOfTransaction: transactionName,
        };

        // Start sending data
        fetch("http://localhost:5000/api/page/insertamount", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify(transactionData),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Failed to add transaction.");
            }
            return response.json();
          })
          .then((data) => {
            document.getElementById("transactionMessage").innerText =
              data.message;
            functionlistOftrxn(token);
            functionaddAlltrxn(token);
            document.getElementById("transactionForm").reset();
          })
          .catch((error) => {
            console.error("Error:", error);
            document.getElementById("transactionMessage").innerText =
              error.message;
          });
      });
  }

  //delete particular transaction
  function functionDeleteParticular(token,transactionID){
    
  } 
}
