import './App.css';
import Game from './Game';
import ContextProvider from './components/ContextProvider';

const App = () => {
    return (
        <ContextProvider>
            <Game />
        </ContextProvider>
    );
};

export default App;
