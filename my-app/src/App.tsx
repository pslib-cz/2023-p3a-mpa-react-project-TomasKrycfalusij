import './App.css';
import Game from './pages/Game';
import ContextProvider from './components/ContextProvider';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Updated import statements
import MainMenu from './pages/MainMenu';
import Levels from './pages/Levels';


const App = () => {
    return (
        <ContextProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<MainMenu />} />
                    <Route path="/game" element={<Game />} />
                    <Route path="/levels" element={<Levels />} />
                </Routes>
            </Router>
        </ContextProvider>
    );
};

export default App;
