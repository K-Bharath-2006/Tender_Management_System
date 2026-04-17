import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const ViewBids = () => {
    const { tenderId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [bids, setBids] = useState([]);
    const [tenders, setTenders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBidsData = async () => {
            try {
                let currentTenders = [];
                // 1. Fetch tenders first to get context, especially if no tenderId is provided
                const tendersRes = await api.get('/tenders');
                currentTenders = tendersRes.data;
                setTenders(currentTenders);

                // 2. Fetch bids based on route
                if (tenderId) {
                    const bidsRes = await api.get(`/tenders/${tenderId}/bids`);
                    setBids(bidsRes.data);
                } else {
                    let allBids = [];
                    for (const tender of currentTenders) {
                        try {
                            const bidsRes = await api.get(`/tenders/${tender.id}/bids`);
                            allBids = [...allBids, ...bidsRes.data];
                        } catch (e) {
                            // ignore error for a single tender
                        }
                    }
                    setBids(allBids);
                }
            } catch (error) {
                console.error("Failed to fetch bids", error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchBidsData();
        }
    }, [tenderId, user]);

    const handleUpdateStatus = async (bidId, newStatus) => {
        if (window.confirm(`Are you sure you want to mark this bid as ${newStatus}?`)) {
            try {
                await api.put(`/bids/${bidId}/status`, { status: newStatus });
                
                // Update local state
                setBids(bids.map(b => b.id === bidId ? { ...b, status: newStatus } : b));
                
                toast.success(`Bid ${newStatus} successfully.`);
            } catch (error) {
                console.error("Failed to update bid status", error);
                toast.error("Failed to update bid status.");
            }
        }
    };

    if (loading) {
        return <div className="p-8 text-center text-slate-500">Loading bids...</div>;
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">
                    {tenderId ? `Bids for Tender #${tenderId}` : 'All Received Bids'}
                </h1>
                <p className="text-slate-500">Review technical proposals and award contracts</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Vendor Email</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Tender ID</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Proposal Summary</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Bid Amount</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-100">
                            {bids.map((bid) => {
                                const targetTender = tenders.find(t => t.id === bid.tenderId);
                                const isTenderClosed = targetTender?.status === 'Closed' || targetTender?.status === 'CLOSED';

                                return (
                                    <tr key={bid.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-900">{bid.vendorEmail}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">#{bid.tenderId}</td>
                                        <td className="px-6 py-4 w-1/3 text-sm text-slate-600">
                                            <p className="line-clamp-2" title={bid.proposal}>{bid.proposal}</p>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap font-bold text-primary-700">₹{bid.amount}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${bid.status === 'APPROVED' ? 'bg-green-50 text-green-700 border-green-200' :
                                                bid.status === 'REJECTED' ? 'bg-red-50 text-red-700 border-red-200' :
                                                    'bg-yellow-50 text-yellow-700 border-yellow-200'
                                                }`}>
                                                {bid.status || 'PENDING'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                            {isTenderClosed || (bid.status === 'APPROVED' || bid.status === 'REJECTED') ? (
                                                <span className="text-slate-400 italic text-xs">Action completed</span>
                                            ) : (
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleUpdateStatus(bid.id, 'APPROVED')}
                                                        className="bg-green-50 text-green-600 hover:bg-green-100 border border-green-200 font-medium px-3 py-1 rounded shadow-sm transition-colors"
                                                    >
                                                        Accept
                                                    </button>
                                                    <button
                                                        onClick={() => handleUpdateStatus(bid.id, 'REJECTED')}
                                                        className="bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 font-medium px-3 py-1 rounded shadow-sm transition-colors"
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                            {bids.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="px-6 py-8 text-center text-slate-500">No bids found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ViewBids;
