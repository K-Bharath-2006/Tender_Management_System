import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import TenderCard from '../components/TenderCard';
import api from '../api/axios';
import { BiSearchAlt, BiTrendingUp, BiShieldQuarter } from 'react-icons/bi';

const Home = () => {
    const [tenders, setTenders] = useState([]);

    useEffect(() => {
        const fetchTenders = async () => {
            try {
                const response = await api.get('/tenders');
                // Get the top 3 latest tenders (assuming id sorting gives latest or we just slice)
                setTenders(response.data.slice(0, 3));
            } catch (error) {
                console.error("Failed to fetch recent tenders", error);
            }
        };

        fetchTenders();
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <Navbar />

            {/* Hero Section */}
            <main className="flex-grow">
                <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                    <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <span className="bg-primary-500/20 text-primary-300 border border-primary-500/30 font-semibold px-4 py-1.5 rounded-full text-sm inline-block shadow-sm">
                                Transparent & Efficient
                            </span>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight">
                                Modernizing <br />
                                Government <span className="text-primary-400">Procurement</span>
                            </h1>
                            <p className="text-lg text-slate-300 max-w-xl leading-relaxed">
                                A unified portal for publishing state tenders, managing transparent bidding, and empowering infrastructure development with absolute clarity.
                            </p>
                            <div className="flex gap-4 pt-4">
                                <Link to="/login" className="bg-primary-600 hover:bg-primary-500 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-lg shadow-primary-600/30">
                                    Login to Portal
                                </Link>
                                <Link to="/results" className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-medium transition-colors border border-white/20 backdrop-blur-sm">
                                    View Results
                                </Link>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl flex flex-col gap-3 transform translate-y-4">
                                <div className="w-12 h-12 bg-primary-500/20 rounded-xl flex items-center justify-center text-primary-400">
                                    <BiSearchAlt className="w-6 h-6" />
                                </div>
                                <h3 className="font-bold text-lg">Discover</h3>
                                <p className="text-sm text-slate-400">Find active government tenders across various sectors easily.</p>
                            </div>

                            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl flex flex-col gap-3">
                                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center text-green-400">
                                    <BiTrendingUp className="w-6 h-6" />
                                </div>
                                <h3 className="font-bold text-lg">Bid</h3>
                                <p className="text-sm text-slate-400">Submit competitive proposals securely using our platform.</p>
                            </div>

                            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl flex flex-col gap-3 transform translate-y-4 col-span-2">
                                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center text-purple-400">
                                    <BiShieldQuarter className="w-6 h-6" />
                                </div>
                                <h3 className="font-bold text-lg">Publish Results</h3>
                                <p className="text-sm text-slate-400">Transparent awarding processes with public results tracking ensuring complete accountability.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Featured Tenders */}
                <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                    <div className="flex justify-between items-end mb-10">
                        <div>
                            <h2 className="text-3xl font-bold text-slate-900 mb-2">Featured Tenders</h2>
                            <p className="text-slate-500">Latest active procurement opportunities</p>
                        </div>
                        <Link to="/tenders" className="text-primary-600 font-semibold hover:text-primary-700 hidden sm:block">
                            View All Tenders &rarr;
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {tenders.map((tender) => (
                            <TenderCard key={tender.id} tender={tender} />
                        ))}
                        {tenders.length === 0 && (
                            <p className="text-slate-500 col-span-1 md:col-span-2 lg:col-span-3 text-center">No tenders currently available.</p>
                        )}
                    </div>
                    <div className="mt-8 text-center sm:hidden">
                        <Link to="/tenders" className="text-primary-600 font-semibold hover:text-primary-700">
                            View All Tenders &rarr;
                        </Link>
                    </div>
                </section>

            </main>

            {/* Footer */}
            <footer className="bg-slate-900 border-t border-slate-800 py-12 text-center text-slate-400">
                <div className="max-w-7xl mx-auto px-4">
                    <p className="mb-2">© {new Date().getFullYear()} GovTender Portal. All rights reserved.</p>
                    <p className="text-sm">Built for transparency and efficiency.</p>
                </div>
            </footer>
        </div>
    );
};

export default Home;
