import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { BiLayer, BiCheckCircle, BiXCircle, BiMessageSquareDetail } from 'react-icons/bi';

const Dashboard = () => {
    const { user } = useAuth();
    const [tenders, setTenders] = useState([]);
    const [bids, setBids] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch tenders
                const tendersRes = await api.get('/tenders');
                // Normally backend filters by department, assuming it does or we filter client-side:
                const myTenders = tendersRes.data; // You may add filter condition if need: .filter(t => t.department === user.department)
                setTenders(myTenders);

                // Fetch bids for each tender
                let allBids = [];
                for (const tender of myTenders) {
                    try {
                        const bidsRes = await api.get(`/tenders/${tender.id}/bids`);
                        allBids = [...allBids, ...bidsRes.data];
                    } catch (err) {
                        // Ignore individual tender bid fetch failures
                    }
                }
                setBids(allBids);

            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        if (user && (user.role === 'ROLE_ADMIN' || user.role === 'ADMIN')) {
            fetchDashboardData();
        } else {
            setLoading(false); // Vendor dashboard may just skip this or show only their bids, but currently it's designed for ADMIN
        }
    }, [user]);


    const totalTenders = tenders.length;
    const activeTenders = tenders.filter(t => !t.status || t.status.toUpperCase() === 'OPEN').length;
    const closedTenders = tenders.filter(t => t.status && t.status.toUpperCase() === 'CLOSED').length;
    const totalBids = bids.length;

    const statCards = [
        { title: 'Total Tenders', value: totalTenders, icon: <BiLayer className="w-8 h-8 text-blue-500" />, bg: 'bg-blue-50' },
        { title: 'Active Tenders', value: activeTenders, icon: <BiCheckCircle className="w-8 h-8 text-green-500" />, bg: 'bg-green-50' },
        { title: 'Closed Tenders', value: closedTenders, icon: <BiXCircle className="w-8 h-8 text-red-500" />, bg: 'bg-red-50' },
        { title: 'Total Bids Received', value: totalBids, icon: <BiMessageSquareDetail className="w-8 h-8 text-purple-500" />, bg: 'bg-purple-50' },
    ];

    if (loading) {
        return <div className="p-8 text-center text-slate-500">Loading dashboard...</div>;
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome, {user.name}</h1>
                <p className="text-slate-500 text-lg flex items-center gap-2">
                    <span className="font-semibold text-slate-700 bg-slate-200 px-3 py-1 rounded-full text-sm">
                        {user.role.replace('ROLE_', '')} View
                    </span>
                    Overview of your tender activities
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {statCards.map((stat, idx) => (
                    <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
                        <div className={`p-4 rounded-xl ${stat.bg}`}>
                            {stat.icon}
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-slate-500 mb-1">{stat.title}</p>
                            <h3 className="text-3xl font-bold text-slate-800">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <h2 className="text-xl font-bold text-slate-800 mb-6">Recent Activity</h2>
                <div className="space-y-4">
                    {bids.slice().reverse().slice(0, 5).map((bid) => (
                        <div key={bid.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                            <div className="flex flex-col">
                                <span className="font-semibold text-slate-800">{bid.companyName} submitted a bid</span>
                                <span className="text-sm text-slate-500">Tender #{bid.tenderId}</span>
                            </div>
                            <span className="text-sm font-semibold text-primary-600 border border-primary-200 bg-primary-50 px-3 py-1 rounded-full">
                                ₹{bid.amount}
                            </span>
                        </div>
                    ))}
                    {bids.length === 0 && (
                        <p className="text-slate-500 text-center py-4">No recent activity.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
