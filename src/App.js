import { BrowserRouter,Route,Routes } from 'react-router-dom';
import './App.css';
// import { Login } from '@mui/icons-material';   icon for login use may like <Login />
import Login from './Components/Login';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login/>} />
    </Routes>
    </BrowserRouter>
  );
}

export default App;
