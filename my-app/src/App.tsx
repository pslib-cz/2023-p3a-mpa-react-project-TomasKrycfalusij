import './App.css';
import Game from './pages/Game';
import ContextProvider from './components/ContextProvider';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Updated import statements
import MainMenu from './pages/MainMenu';
import Home from './pages/Home';


const App = () => {
    return (
        <ContextProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<MainMenu />} />
                    <Route path="/game" element={<Game />} /> {/* Updated path for the Game component */}
                    <Route path="/home" element={<Home />} /> {/* Added a separate route for Home */}
                </Routes>
            </Router>
        </ContextProvider>
    );
};

export default App;
