import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, Calendar, LogOut, Settings } from 'lucide-react';

const Profile = () => {
    const { user, logout } = useAuth();

    const formatDate = (dateString) => {
        if (!dateString) return 'Member since Dec 2025';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-3xl font-bold">User Profile</h1>
                <p className="text-gray-400">View and manage your account settings</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Profile Card */}
                <div className="md:col-span-1">
                    <div className="glass-card text-center flex flex-col items-center">
                        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-3xl font-bold mb-6 shadow-xl shadow-primary/20 rotate-3">
                            {user?.name?.[0].toUpperCase()}
                        </div>
                        <h2 className="text-2xl font-bold mb-1">{user?.name}</h2>
                        <p className="text-gray-400 text-sm mb-6 capitalize">{user?.role} Account</p>

                        <div className="w-full pt-6 border-t border-white/5 mt-4 space-y-3">
                            <button className="w-full btn-secondary flex items-center justify-center gap-2">
                                <Settings size={18} />
                                Edit Profile
                            </button>
                        </div>
                    </div>
                </div>

                {/* Account Details */}
                <div className="md:col-span-2 space-y-6">
                    <div className="glass-card">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Shield size={20} className="text-primary" />
                            Account Information
                        </h3>

                        <div className="space-y-6">
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 transition-colors hover:bg-white/10">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                        <User size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Full Name</p>
                                        <p className="font-semibold">{user?.name}</p>
                                    </div>
                                </div>
                                <button className="text-primary text-sm font-medium hover:underline">Change</button>
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 transition-colors hover:bg-white/10">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-secondary/10 rounded-lg text-secondary">
                                        <Mail size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Email Address</p>
                                        <p className="font-semibold">{user?.email}</p>
                                    </div>
                                </div>
                                <button className="text-primary text-sm font-medium hover:underline">Verify</button>
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 transition-colors hover:bg-white/10 opacity-75">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-accent/10 rounded-lg text-accent">
                                        <Calendar size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Created At</p>
                                        <p className="font-semibold">{formatDate(user?.createdAt)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card border-danger/10">
                        <h3 className="text-xl font-bold mb-2 text-danger">Safety & Logout</h3>
                        <p className="text-gray-400 text-sm mb-6">Manage your session and account security</p>

                        <div className="flex gap-4">
                            <button
                                onClick={logout}
                                className="flex-1 btn bg-danger/10 hover:bg-danger text-danger hover:text-white border border-danger/20 flex items-center justify-center gap-2 transition-all duration-300"
                            >
                                <LogOut size={18} />
                                Sign Out from Device
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
