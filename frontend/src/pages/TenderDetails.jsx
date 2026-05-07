import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { BiBuilding, BiMap, BiRupee, BiCalendar, BiInfoCircle } from 'react-icons/bi';

const TenderDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [tender, setTender] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTender = async () => {
            try {
                const response = await api.get(`/tenders/${id}`);
                setTender(response.data);
            } catch (error) {
                console.error("Failed to fetch tender details", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTender();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col">
                <Navbar />
                <div className="flex-1 flex items-center justify-center p-8 text-slate-500 font-medium text-lg">
                    Loading tender details...
                </div>
            </div>
        );
    }

    if (!tender) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col">
                <Navbar />
                <div className="flex-1 flex items-center justify-center p-8 text-slate-500 font-medium text-lg">
                    Tender not found.
                </div>
            </div>
        );
    }

    const isClosed = tender.status === 'Closed' || tender.status === 'CLOSED';

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <Navbar />
            <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
                <div className="mb-6 flex items-center gap-2 text-sm text-slate-500 font-medium">
                    <Link to="/tenders" className="hover:text-primary-600 transition-colors">Tenders</Link>
                    <span>/</span>
                    <span className="text-slate-800">Tender #{tender.id}</span>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-8 border-b border-slate-100 bg-slate-800 text-white">
                        <div className="flex justify-between items-start mb-4">
                            <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${isClosed ? 'bg-red-500/20 text-red-200 border-red-500/30' : 'bg-green-500/20 text-green-200 border-green-500/30'
                                }`}>
                                {tender.status || 'OPEN'}
                            </span>
                        </div>
                        <h1 className="text-3xl font-extrabold mb-4">{tender.title}</h1>
                        <div className="flex flex-wrap gap-6 text-slate-300">
                            <div className="flex items-center gap-2">
                                <BiBuilding className="w-5 h-5" />
                                <span>{tender.department || 'General'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <BiMap className="w-5 h-5" />
                                <span>{tender.location}</span>
                            </div>
                        </div>
                    </div>

                    <div className="p-8">
                        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <BiInfoCircle className="text-primary-600" />
                            Tender Details
                        </h2>
                        <p className="text-slate-600 leading-relaxed mb-8 bg-slate-50 p-6 rounded-xl border border-slate-100 whitespace-pre-line">
                            {tender.description}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            <div className="border border-slate-200 p-6 rounded-xl bg-white shadow-sm">
                                <p className="text-sm text-slate-500 flex items-center gap-2 mb-2">
                                    <BiRupee className="w-4 h-4" /> Estimated Budget
                                </p>
                                <p className="text-2xl font-bold text-slate-800">₹{tender.budget}</p>
                            </div>
                            <div className="border border-slate-200 p-6 rounded-xl bg-white shadow-sm">
                                <p className="text-sm text-slate-500 flex items-center gap-2 mb-2">
                                    <BiCalendar className="w-4 h-4" /> Submission Deadline
                                </p>
                                <p className="text-2xl font-bold text-slate-800 truncate">{new Date(tender.deadline).toLocaleString()}</p>
                            </div>
                        </div>

                        {user?.role === 'ROLE_VENDOR' && !isClosed && (
                            <div className="border-t border-slate-200 mt-8 pt-8 flex justify-end">
                                <Link
                                    to={`/submit-bid/${tender.id}`}
                                    className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors shadow-md shadow-primary-600/20"
                                >
                                    Submit Bid Proposal
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default TenderDetails;
