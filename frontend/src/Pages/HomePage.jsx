import React, { useEffect, useState } from "react";
import "./Styles/homepage.css"; // Ensure your CSS file is correctly imported
import { useNavigate } from "react-router-dom";

const TransactionList = () => {
  const [transactions, setTransactions] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [transactionName, setTransactionName] = useState("");
  const [amount, setAmount] = useState(0);
  const [transactionType, setTransactionType] = useState("Deposit");
  const [message, setMessage] = useState("");
  const [sortBy, setSortBy] = useState(null); // State for sorting
  const [sortOrder, setSortOrder] = useState("asc"); // State for sort order
  const token = sessionStorage.getItem("authToken");
  const isAdmin = sessionStorage.getItem("isAdmin");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      alert("You are not authorized. Please log in.");
      navigate("/");
    } else {
      const userName = sessionStorage.getItem("userName");
      document.getElementById("user-name").textContent = userName.toLocaleUpperCase();
      fetchTransactions();
      fetchTotalAmount();
    }
    // eslint-disable-next-line
  }, [token]);

  const fetchTransactions = async () => {
    try {
      //const response = await fetch("http://localhost:5000/api/page/list_of_transaction", {
      const response = await fetch("https://personal-finance-29bb.onrender.com/api/page/list_of_transaction", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch transactions.");
      }
      const data = await response.json();
      setTransactions(data.amountList || []);
    } catch (error) {
      console.error("Error:", error);
      setTransactions([]);
    }
  };

  const fetchTotalAmount = async () => {
    try {
      //const response = await fetch("http://localhost:5000/api/page/addamount", {
      const response = await fetch("https://personal-finance-29bb.onrender.com/api/page/addamount", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch total amount.");
      }

      const data = await response.json();
      setTotalAmount(data.totalAmount || 0);
    } catch (error) {
      console.error("Error:", error);
      setTotalAmount(0);
    }
  };

  const handleAddTransaction = async () => {
    const transactionData = {
      Amount: parseFloat(amount),
      Withdrawal: transactionType === "Withdrawal",
      nameOfTransaction: transactionName.trim(),
    };

    if (!transactionData.nameOfTransaction || isNaN(transactionData.Amount) || transactionData.Amount === 0) {
      alert("Please fill in all fields correctly");
      return;
    }

    try {
      //const response = await fetch("http://localhost:5000/api/page/insertamount", {
      const response = await fetch("https://personal-finance-29bb.onrender.com/api/page/insertamount", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(transactionData),
      });

      if (!response.ok) {
        throw new Error("Failed to add transaction.");
      }

      const data = await response.json();
      setMessage(data.message);
      fetchTransactions();
      fetchTotalAmount();
      resetForm();
    } catch (error) {
      console.error("Error:", error);
      setMessage(error.message);
    }
  };

  const resetForm = () => {
    setTransactionName("");
    setAmount(0);
  };

  const handleLogout = () => {
    sessionStorage.clear(); // Clear the session storage
    navigate("/");
  };

  const handleDeleteTransaction = async (transactionID) => {
    try {
      const response = await fetch(`https://personal-finance-29bb.onrender.com/api/page/deleteOne`, {
      //const response = await fetch(`http://localhost:5000/api/page/deleteOne`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ id: transactionID })
      });

      if (!response.ok) {
        throw new Error("Failed to delete transaction.");
      }
      fetchTransactions();
      fetchTotalAmount();
    } catch (error) {
      console.error("Error:", error);
      setMessage(error.message);
    }
  };

  const handleSort = (field) => {
    const order = sortBy === field && sortOrder === "asc" ? "desc" : "asc";
    setSortBy(field);
    setSortOrder(order);
    setTransactions((prevTransactions) => 
      [...prevTransactions].sort((a, b) => {
        if (order === "asc") {
          return a[field] > b[field] ? 1 : -1;
        } else {
          return a[field] < b[field] ? 1 : -1;
        }
      })
    );
  };

  return (
    <div>
      <nav className="navbar" id="navbar">
        <h1 id="user-name"></h1>
        <button className="btn" id="logout-btn" onClick={handleLogout}>Log Out</button>
      </nav>
      <div className="container">
        <div className="box">
          <h3>Add Transaction</h3>
          <form id="transactionForm">
            <div className="input-group">
              <label>
                <input
                  type="radio"
                  name="transactionType"
                  value="Deposit"
                  checked={transactionType === "Deposit"}
                  onChange={() => setTransactionType("Deposit")}
                />
                Deposit
              </label>
              <label>
                <input
                  type="radio"
                  name="transactionType"
                  value="Withdrawal"
                  checked={transactionType === "Withdrawal"}
                  onChange={() => setTransactionType("Withdrawal")}
                />
                Withdrawal
              </label>
            </div>
            <input
              type="text"
              value={transactionName}
              onChange={(e) => setTransactionName(e.target.value)}
              placeholder="Transaction Name"
            />
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Amount"
            />
            <button type="button" id="addTransaction" onClick={handleAddTransaction}>Add</button>
          </form>
          {message && <div id="transactionMessage">{message}</div>}
          <h3>Transactions</h3>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  {isAdmin && isAdmin === 'true' && <th>User Name</th>}
                  <th onClick={() => handleSort('nameOfTransaction')}>Transaction Name</th>
                  <th onClick={() => handleSort('amountAdded')}>Amount Added</th>
                  <th onClick={() => handleSort('date')}>Date</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody id="transactionList">
                {transactions.length > 0 ? (
                  transactions.map((transaction) => (
                    <tr key={transaction._id}>
                      {isAdmin && isAdmin === 'true' && <td>{transaction.userName}</td>}
                      <td>{transaction.nameOfTransaction}</td>
                      <td>{transaction.amountAdded}</td>
                      <td>{new Date(transaction.date).toLocaleDateString()}</td>
                      <td>
                        <button onClick={() => handleDeleteTransaction(transaction._id)} className="addTransaction">Delete</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5">No transactions available.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <h3>Total you have</h3>
          <div id="totalAmount">
            <p>{totalAmount}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionList;