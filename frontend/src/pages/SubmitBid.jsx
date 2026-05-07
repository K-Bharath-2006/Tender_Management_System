import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { BiArrowBack } from 'react-icons/bi';

const SubmitBid = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [tender, setTender] = useState(null);
    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        amount: '',
        proposal: '',
    });

    useEffect(() => {
        const fetchTender = async () => {
            try {
                const response = await api.get(`/tenders/${id}`);
                setTender(response.data);
            } catch (error) {
                console.error("Failed to fetch tender", error);
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
                <div className="flex-1 flex items-center justify-center p-8 text-slate-500">Loading tender...</div>
            </div>
        );
    }

    if (!tender) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col">
                <Navbar />
                <div className="flex-1 flex items-center justify-center p-8 text-slate-500">Tender not found.</div>
            </div>
        );
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Dto has amount, proposal
            await api.post(`/tenders/${tender.id}/bids`, formData);
            toast.success("Bid submitted successfully!");
            navigate('/tenders');
        } catch (error) {
            console.error("Failed to submit bid", error);
            toast.error("Could not submit bid. You might have already bid on this tender or validation failed.");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <Navbar />
            <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto w-full">
                <Link to={`/tender-details/${tender.id}`} className="inline-flex items-center gap-2 text-slate-500 hover:text-primary-600 mb-6 font-medium transition-colors">
                    <BiArrowBack /> Back to Tender
                </Link>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 bg-slate-50">
                        <h1 className="text-2xl font-bold text-slate-900">Submit Bid Proposal</h1>
                        <p className="text-sm text-slate-600 mt-1">For: <span className="font-semibold text-slate-800">{tender.title}</span></p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-slate-800 mb-2">Bid Amount (in ₹)</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">₹</span>
                                <input
                                    type="number"
                                    name="amount"
                                    value={formData.amount}
                                    onChange={handleChange}
                                    placeholder="e.g. 50000000"
                                    className="w-full pl-8 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-800 mb-2">Technical Proposal & Description</label>
                            <textarea
                                name="proposal"
                                value={formData.proposal}
                                onChange={handleChange}
                                rows="6"
                                placeholder="Describe your execution plan, timeline, and company capabilities here..."
                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-all resize-none"
                                required
                            ></textarea>
                        </div>



                        <div className="pt-4 flex justify-end">
                            <button
                                type="submit"
                                className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors shadow-md shadow-primary-600/20"
                            >
                                Submit Final Bid
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default SubmitBid;
