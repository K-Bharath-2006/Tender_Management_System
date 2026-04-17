import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import { BiBuildingHouse } from 'react-icons/bi';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="bg-white shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center gap-2">
                            <BiBuildingHouse className="h-8 w-8 text-primary-600" />
                            <span className="text-xl font-bold text-slate-800">GovTender</span>
                        </Link>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link to="/" className="text-slate-600 hover:text-primary-600 font-medium px-3 py-2 rounded-md transition-colors">Home</Link>
                        <Link to="/results" className="text-slate-600 hover:text-primary-600 font-medium px-3 py-2 rounded-md transition-colors">Results</Link>
                        {user?.role === 'ROLE_VENDOR' && (
                            <Link to="/tenders" className="text-slate-600 hover:text-primary-600 font-medium px-3 py-2 rounded-md transition-colors">Tenders</Link>
                        )}
                        {user?.role === 'ROLE_ADMIN' && (
                            <Link to="/dashboard" className="text-slate-600 hover:text-primary-600 font-medium px-3 py-2 rounded-md transition-colors">Dashboard</Link>
                        )}

                        {!user ? (
                            <div className="flex items-center gap-2 ml-4 border-l border-slate-200 pl-4">
                                <Link to="/login" className="text-slate-600 hover:text-primary-600 font-medium px-4 py-2 rounded-md transition-colors">Login</Link>
                                <Link to="/register" className="bg-primary-600 hover:bg-primary-700 text-white font-medium px-4 py-2 rounded-md transition-colors shadow-sm">Register</Link>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4 ml-4 border-l border-slate-200 pl-4">
                                <div className="flex items-center gap-2 text-slate-700">
                                    <div className="bg-primary-100 text-primary-700 p-1.5 rounded-full">
                                        <span className="font-semibold text-sm px-1">{user.name.charAt(0).toUpperCase()}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-semibold">{user.name}</span>
                                        <span className="text-xs text-slate-500 capitalize">{user.role.replace('ROLE_', '')}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                    title="Logout"
                                >
                                    <FaSignOutAlt className="w-5 h-5" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
