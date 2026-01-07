import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { TrendingUp, Menu, X, LogOut, LayoutDashboard, Briefcase, Star, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { user, logout } = useAuth();
    const location = useLocation();

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
        { icon: Briefcase, label: 'Portfolio', path: '/portfolio' },
        { icon: Star, label: 'Watchlist', path: '/watchlist' },
        { icon: User, label: 'Profile', path: '/profile' },
    ];

    return (
        <nav className="glass sticky top-0 z-50 md:hidden p-4 border-b border-white/5">
            <div className="flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2">
                    <TrendingUp className="text-primary" size={24} />
                    <h1 className="text-lg font-bold">CryptoTrack</h1>
                </Link>
                <button onClick={() => setIsOpen(!isOpen)} className="text-gray-400">
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {isOpen && (
                <div className="absolute top-full left-0 w-full glass-card border-t border-white/5 p-4 space-y-2 flex flex-col items-center animate-in slide-in-from-top duration-200">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setIsOpen(false)}
                            className={`flex items-center gap-3 w-full p-3 rounded-xl transition-all ${location.pathname === item.path ? 'bg-primary text-white' : 'text-gray-400 hover:bg-surface-lighter hover:text-white'
                                }`}
                        >
                            <item.icon size={20} />
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    ))}
                    <button
                        onClick={() => {
                            logout();
                            setIsOpen(false);
                        }}
                        className="flex items-center gap-3 w-full p-3 rounded-xl text-danger hover:bg-danger/10 transition-all font-medium mt-4 border-t border-white/5 pt-4"
                    >
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
