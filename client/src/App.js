import React, { useState, useEffect } from 'react';
import './styles/style.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandPage from './components/LandPage';
import Library from './components/Library';
import Account from './components/Account';
import NavBar from './components/NavBar';
import CreatePage from './components/CreatePage';
import Quiz from './components/Quiz';
import Register from './components/Register'
import Login from './components/Login'
import Communities from './components/Communities'
import CreatePost from './components/CreatePost'
import Chat from './components/Chat.jsx'
import { createContext } from 'react'

export const ThemeContext = createContext({
  mode: 'light',
  toggleMode: () => {}
});

function App() {

  const [mode, setMode] = useState('dark');

  const toggleMode = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    console.log(newMode)
    localStorage.setItem('themeMode', newMode);
  };

  useEffect(() => {
    let modeReal = localStorage.getItem('themeMode');
    document.body.classList.add(modeReal);
    if(modeReal === 'dark'){
      document.body.classList.remove('light')
    }else if(modeReal === 'light'){
      document.body.classList.add(modeReal)
    }
  }, [mode]);

  return (
    <ThemeContext.Provider value={{ mode, toggleMode }}>
      <div className={`App ${mode}`}>
        <Router>
          <div className="navigation-top">
            <NavBar />
          </div>
          <Routes>
            <Route path="/" element={<LandPage />} />
            <Route path="/library" element={<Library />} />
            <Route path="/profile/:userid/:username" element={<Account />} />
            <Route path="/create" element={<CreatePage />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/quiz/:quizid/:quizname" element={<Quiz />} />
            <Route path="/submit" element={<CreatePost />} />
            <Route path="/chats" element={<Communities />} />
            <Route path="/chat/:chatid/:title" element={<Chat />} />
          </Routes>
        </Router>
      </div>
    </ThemeContext.Provider>
  );
}

export default App;