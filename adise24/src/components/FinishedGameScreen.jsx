import { useLocation } from 'react-router-dom';

function FinishedGameScreen(){

    const location = useLocation();

    return <h1>`Winner: ${location.state.winner}`</h1>
}

export default FinishedGameScreen