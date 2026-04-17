import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { BiEdit, BiTrash, BiListUl } from 'react-icons/bi';

const ManageTenders = () => {
    const { user } = useAuth();
    const [tenders, setTenders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchTenders = async () => {
        try {
            const response = await api.get('/tenders');
            // Assuming the backend returns all tenders, filter if department logic remains
            // Alternatively, backend might already filter for ADMIN based on their department, but we'll do it if necessary.
            // Let's just set response.data since backend does role-based logic or we can filter it:
            setTenders(response.data);
        } catch (error) {
            console.error("Failed to fetch tenders", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTenders();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this tender?")) {
            try {
                await api.delete(`/tenders/${id}`);
                setTenders(tenders.filter(t => t.id !== id));
                toast.success("Tender deleted!");
            } catch (error) {
                console.error("Error deleting tender", error);
                toast.error("Could not delete tender");
            }
        }
    };

    // Assuming we want to toggle status via API PUT
    const handleToggleStatus = async (tender) => {
        const newStatus = tender.status === 'Open' ? 'Closed' : 'Open';
        try {
            const updatedTender = { ...tender, status: newStatus };
            await api.put(`/tenders/${tender.id}`, updatedTender);
            setTenders(tenders.map(t => t.id === tender.id ? updatedTender : t));
            toast.success(`Tender status updated to ${newStatus}`);
        } catch (error) {
            console.error("Error toggling status", error);
            toast.error("Could not update tender status");
        }
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Manage Tenders</h1>
                <p className="text-slate-500">Edit, close, or delete existing tenders</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="p-8 text-center text-slate-500">Loading tenders...</div>
                    ) : (
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Title</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Location</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Budget</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-100">
                            {tenders.map((tender) => (
                                <tr key={tender.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="font-medium text-slate-900 truncate max-w-[200px]">{tender.title}</div>
                                        <div className="text-xs text-slate-500">ID: {tender.id}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{tender.location}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-800">{tender.budget}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button
                                            onClick={() => handleToggleStatus(tender)}
                                            className={`text-xs font-semibold px-2.5 py-1 rounded-full border border-transparent transition-all hover:opacity-80 ${tender.status === 'Closed' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-green-50 text-green-700 border-green-200'
                                                }`}
                                            title="Click to toggle status"
                                        >
                                            {tender.status || 'Open'}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end gap-3">
                                            <Link to={`/admin/view-bids/${tender.id}`} className="text-primary-600 hover:text-primary-800 flex items-center gap-1" title="View Bids">
                                                <BiListUl className="w-5 h-5" />
                                            </Link>
                                            <button className="text-slate-400 hover:text-slate-600 flex items-center gap-1" title="Edit (Dummy)">
                                                <BiEdit className="w-5 h-5" />
                                            </button>
                                            <button onClick={() => handleDelete(tender.id)} className="text-red-400 hover:text-red-600 flex items-center gap-1" title="Delete">
                                                <BiTrash className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {tenders.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-slate-500">No tenders found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManageTenders;
