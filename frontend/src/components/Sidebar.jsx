import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Briefcase, Star, User, LogOut, TrendingUp, Bot, Calculator, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const SidebarItem = ({ icon: Icon, label, path, active }) => (
    <Link
        to={path}
        className={twMerge(
            clsx(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                active
                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                    : "text-gray-400 hover:bg-surface-lighter hover:text-white"
            )
        )}
    >
        <Icon size={20} className={active ? "text-white" : "group-hover:text-primary"} />
        <span className="font-medium text-sm">{label}</span>
    </Link>
);

const Sidebar = () => {
    const location = useLocation();
    const { logout, user } = useAuth();

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
        { icon: Briefcase, label: 'Portfolio', path: '/portfolio' },
        { icon: Star, label: 'Watchlist', path: '/watchlist' },
        { icon: Bot, label: 'Trading Bots', path: '/trading-bots' },
        { icon: Calculator, label: 'DCA Calculator', path: '/dca-calculator' },
        { icon: FileText, label: 'Tax Reports', path: '/tax-reports' },
        { icon: User, label: 'Profile', path: '/profile' },
    ];

    return (
        <div className="w-64 h-screen glass border-r border-white/5 flex flex-col p-6 sticky top-0 hidden md:flex">
            <div className="flex items-center gap-3 mb-10 px-2">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                    <TrendingUp className="text-white" size={24} />
                </div>
                <h1 className="text-xl font-bold tracking-tight">Crypto<span className="text-primary">Track</span></h1>
            </div>

            <nav className="flex-1 space-y-2">
                {menuItems.map((item) => (
                    <SidebarItem
                        key={item.path}
                        {...item}
                        active={location.pathname === item.path}
                    />
                ))}
            </nav>

            <div className="mt-auto space-y-4 pt-6 border-t border-white/5">
                <div className="flex items-center gap-3 px-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-sm font-bold">
                        {user?.name?.[0].toUpperCase()}
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-sm font-semibold truncate">{user?.name}</p>
                        <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                    </div>
                </div>

                <button
                    onClick={logout}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-danger/10 hover:text-danger w-full transition-all duration-200 group"
                >
                    <LogOut size={20} className="group-hover:text-danger" />
                    <span className="font-medium text-sm">Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
