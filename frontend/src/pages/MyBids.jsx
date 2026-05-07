import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const MyBids = () => {
    const { user } = useAuth();
    const [myBids, setMyBids] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMyBids = async () => {
            try {
                // Fetch all tenders
                const tendersRes = await api.get('/tenders');
                const allTenders = tendersRes.data;

                // Fetch bids for each tender and filter by user email
                let vendorBids = [];
                for (const tender of allTenders) {
                    try {
                        const bidsRes = await api.get(`/tenders/${tender.id}/bids`);
                        const myBidForTender = bidsRes.data.find(b => b.vendorEmail === user.email);
                        if (myBidForTender) {
                            vendorBids.push({
                                ...myBidForTender,
                                tenderTitle: tender.title
                            });
                        }
                    } catch (e) {
                        // ignore error for a single tender
                    }
                }
                setMyBids(vendorBids);
            } catch (error) {
                console.error("Failed to fetch my bids", error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchMyBids();
        }
    }, [user]);

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <Navbar />
            <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">My Submitted Bids</h1>
                    <p className="text-slate-500">Track the status of all your submitted proposals</p>
                </div>

                {loading ? (
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center text-slate-500">
                        Loading your bids...
                    </div>
                ) : myBids.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center text-slate-500">
                        You have not submitted any bids yet.
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-200">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Tender</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">My Proposal</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Bid Amount</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-slate-100">
                                    {myBids.map((bid) => (
                                        <tr key={bid.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="font-medium text-slate-900 truncate max-w-[200px]">{bid.tenderTitle || `Tender #${bid.tenderId}`}</div>
                                                <div className="text-xs text-slate-500">
                                                    <Link to={`/tender-details/${bid.tenderId}`} className="text-primary-600 hover:text-primary-800 hover:underline">
                                                        View Details
                                                    </Link>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 w-1/3 text-sm text-slate-600">
                                                <p className="line-clamp-2" title={bid.proposal}>{bid.proposal}</p>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap font-bold text-slate-800">₹{bid.amount}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                                                    bid.status === 'APPROVED' ? 'bg-green-50 text-green-700 border-green-200' :
                                                    bid.status === 'REJECTED' ? 'bg-red-50 text-red-700 border-red-200' :
                                                    'bg-yellow-50 text-yellow-700 border-yellow-200'
                                                }`}>
                                                    {bid.status || 'PENDING'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default MyBids;
