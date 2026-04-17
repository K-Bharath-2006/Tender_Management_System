import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import TenderCard from '../components/TenderCard';
import api from '../api/axios';

const TenderList = () => {
    const [tenders, setTenders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTenders = async () => {
            try {
                const response = await api.get('/tenders');
                setTenders(response.data);
            } catch (error) {
                console.error("Failed to fetch tenders", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTenders();
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <Navbar />
            <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Available Tenders</h1>
                    <p className="text-slate-500">Browse and apply for active government procurement projects</p>
                </div>

                {loading ? (
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center text-slate-500">
                        Loading tenders...
                    </div>
                ) : tenders.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center text-slate-500">
                        No tenders available at the moment.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {tenders.map((tender) => (
                            <TenderCard key={tender.id} tender={tender} />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default TenderList;
