import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../api/axios';
import { Link } from 'react-router-dom';

const Results = () => {
    const [publishedResults, setPublishedResults] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                // Fetch all tenders
                const tendersRes = await api.get('/tenders');
                const allTenders = tendersRes.data;

                // Find only CLOSED tenders
                const closedTenders = allTenders.filter(t => t.status === 'Closed' || t.status === 'CLOSED');

                // For each closed tender, find its APPROVED bid
                let finalResults = [];
                for (const tender of closedTenders) {
                    try {
                        const bidsRes = await api.get(`/tenders/${tender.id}/bids`);
                        const winningBid = bidsRes.data.find(b => b.status === 'APPROVED');
                        if (winningBid) {
                            finalResults.push({
                                ...tender,
                                winningBid
                            });
                        }
                    } catch(err) {
                        // ignore if unable to fetch bids for one tender
                    }
                }
                
                setPublishedResults(finalResults);
            } catch (error) {
                console.error("Failed to fetch results", error);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <Navbar />
            <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Published Results</h1>
                    <p className="text-slate-500">View recent tender awards and winning contractor details</p>
                </div>

                {loading ? (
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center text-slate-500">
                        Loading results...
                    </div>
                ) : publishedResults.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center text-slate-500">
                        No results published yet.
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-200">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Tender</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Winning Vendor</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Award Amount</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-slate-100">
                                    {publishedResults.map((result) => (
                                        <tr key={result.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <Link to={`/tender-details/${result.id}`} className="text-primary-600 hover:text-primary-800 font-medium block truncate max-w-[200px]">
                                                    {result.title}
                                                </Link>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-800">{result.winningBid?.vendorEmail || 'N/A'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-medium">₹{result.winningBid?.amount || 'N/A'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-1 rounded-full border border-green-200">
                                                    Awarded
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

export default Results;
