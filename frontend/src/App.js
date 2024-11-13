import "./App.css";
import { BrowserRouter,Routes,Route } from "react-router-dom";
import LoginPage from "./Pages/Login";
import HomePage from "./Pages/HomePage";
import Register from "./Pages/Register";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/Home" element={<HomePage />} />
          <Route path="/Register" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
export default App;
