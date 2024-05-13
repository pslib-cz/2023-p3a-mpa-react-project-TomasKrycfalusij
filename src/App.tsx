import './App.css';
import Game from './pages/Game';
import ContextProvider from './components/ContextProvider';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Updated import statements
import MainMenu from './pages/MainMenu';
import Levels from './pages/Levels';
import Shop from './pages/Shop';


const App = () => {
    return (
        <ContextProvider>
            <Router basename="/2023-p3a-mpa-react-project-TomasKrycfalusij">
                <Routes>
                    <Route path="/" element={<MainMenu />} />
                    <Route path="/game" element={<Game />} />
                    <Route path="/levels" element={<Levels />} />
                    <Route path="/shop" element={<Shop />} />
                </Routes>
            </Router>
        </ContextProvider>
    );
};

export default App;
