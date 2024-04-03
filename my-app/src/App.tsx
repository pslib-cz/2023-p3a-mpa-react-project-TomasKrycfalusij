import './App.css';
import Game from './Game';
import ContextProvider from './components/ContextProvider';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Updated import statements
import Begin from './Begin';
import Home from './Home';

const App = () => {
    return (
        <ContextProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Begin />} />
                    <Route path="/game" element={<Game />} /> {/* Updated path for the Game component */}
                    <Route path="/home" element={<Home />} /> {/* Added a separate route for Home */}
                </Routes>
            </Router>
        </ContextProvider>
    );
};

export default App;
