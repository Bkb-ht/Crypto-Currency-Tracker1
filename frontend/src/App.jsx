import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Portfolio from './pages/Portfolio';
import Watchlist from './pages/Watchlist';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import DCACalculator from './pages/DCACalculator';
import TradingBots from './pages/TradingBots';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    <Route element={<Layout />}>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/portfolio" element={<Portfolio />} />
                        <Route path="/watchlist" element={<Watchlist />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/dca-calculator" element={<DCACalculator />} />
                        <Route path="/trading-bots" element={<TradingBots />} />
                    </Route>
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
