import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';

const CreateTender = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: '',
        budget: '',
        deadline: '',
        location: '',
        description: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Note: The backend expects TenderDto constraints (we may need to check the backend DTO if the keys map exactly. e.g. location, budget, etc. For now sending formData directly)
            await api.post('/tenders', formData);
            toast.success("Tender created successfully!");
            navigate('/manage-tenders');
        } catch (error) {
            console.error("Error creating tender", error);
            toast.error("Error creating tender: " + (error.response?.data?.message || "Unknown error"));
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Create New Tender</h1>
                <p className="text-slate-500">Publish a new procurement opportunity</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="col-span-2">
                            <label className="block text-sm font-semibold text-slate-800 mb-2">Tender Title</label>
                            <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" placeholder="e.g. Highway Expansion Project" required />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-800 mb-2">Location</label>
                            <input type="text" name="location" value={formData.location} onChange={handleChange} className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" required />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-800 mb-2">Estimated Budget (Amount)</label>
                            <input type="number" name="budget" value={formData.budget} onChange={handleChange} className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" placeholder="e.g. 50000000" required />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-800 mb-2">Submission Deadline</label>
                            <input type="datetime-local" name="deadline" value={formData.deadline} onChange={handleChange} className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" required />
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-semibold text-slate-800 mb-2">Detailed Description</label>
                            <textarea name="description" value={formData.description} onChange={handleChange} rows="5" className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none resize-none" placeholder="Describe the requirements and scope of work..." required></textarea>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex justify-end">
                        <button type="submit" className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors shadow-md shadow-primary-600/20">
                            Publish Tender
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateTender;
