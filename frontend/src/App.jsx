import { useContext, useEffect, useState } from 'react';
import { BrowserRouter as Router,Route,Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';
import './App.css';
import { chatState } from './context/chatProvider';
function App() {
  const {user}=chatState();
  useEffect(()=>{
console.log(user);
  },[]);
  return (
    <div className="App">
    <Router>
<Routes>
<Route exact path="/" element={<HomePage/>}></Route>
<Route exact path="/chats"  element={<ChatPage/>}></Route>
</Routes>
    </Router>
    </div>
  )
}

export default App
