import { Routes, Route, /*Link*/ } from "react-router-dom";
import Navbar from "./components/Navbar";
import Landing from "./components/Landing";
import Home from "./components/Home";
import GameDetails from "./components/GameDetails";
import GameCreate from "./components/GameCreate";

import './App.css';

function App() {
  return (
    <div className="App">
      <Navbar/>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Home />} />
        <Route path="/game/:id" element={<GameDetails />} />
        <Route path="/create-new-game" element={<GameCreate />} />
      </Routes>
    </div>
  );
}

export default App;
