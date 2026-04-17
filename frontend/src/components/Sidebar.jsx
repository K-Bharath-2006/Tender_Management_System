import React from 'react';
import { NavLink } from 'react-router-dom';
import { MdSpaceDashboard, MdPostAdd, MdListAlt, MdGavel } from 'react-icons/md';

const Sidebar = () => {
    const navItems = [
        { path: '/dashboard', label: 'Dashboard', icon: <MdSpaceDashboard className="w-5 h-5" /> },
        { path: '/create-tender', label: 'Create Tender', icon: <MdPostAdd className="w-5 h-5" /> },
        { path: '/manage-tenders', label: 'Manage Tenders', icon: <MdListAlt className="w-5 h-5" /> },
        { path: '/view-bids', label: 'View Bids', icon: <MdGavel className="w-5 h-5" /> },
    ];

    return (
        <aside className="w-64 bg-slate-900 text-slate-300 h-[calc(100vh-4rem)] sticky top-16 shadow-xl flex-shrink-0">
            <div className="py-6 px-4">
                <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-3">Admin Menu</h2>
                <nav className="space-y-1">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-3 rounded-md transition-colors ${isActive
                                    ? 'bg-primary-600 text-white font-medium'
                                    : 'hover:bg-slate-800 hover:text-white'
                                }`
                            }
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>
            </div>
        </aside>
    );
};

export default Sidebar;
