import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { BiBuildingHouse } from 'react-icons/bi';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'VENDOR',
        // Backend currently only expects name, email, password, role. 
        // We keep extra fields in state if needed for later scale, but backend will ignore them if not in DTO
        registrationNumber: '',
        address: '',
        department: 'Public Works',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();
    const { register } = useAuth();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Prepare object mapping exactly to Backend RegisterRequest Dto
        const payload = {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            role: formData.role
        };

        const result = await register(payload);

        if (result.success) {
            setSuccess(true);
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <Navbar />
            <div className="flex-1 flex items-center justify-center p-4 py-12">
                <div className="max-w-xl w-full bg-white rounded-2xl shadow-xl overflow-hidden p-8 border border-slate-100">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 text-primary-600 mb-4">
                            <BiBuildingHouse className="h-8 w-8" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-100 pb-4">Create Account</h2>
                        <p className="text-sm text-slate-500 mt-4">Join GovTender as a Department Admin or Contractor</p>
                    </div>

                    {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm mb-6 border border-red-100">{error}</div>}
                    {success && <div className="bg-green-50 text-green-600 p-4 rounded-lg text-sm mb-6 border border-green-100">Registration successful! Redirecting to login...</div>}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-2 gap-5">
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Registration Role</label>
                                <select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                >
                                    <option value="VENDOR">Company / Contractor</option>
                                    <option value="ADMIN">Government Admin</option>
                                </select>
                            </div>

                            <div className="col-span-2 sm:col-span-1">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-primary-500 outline-none" />
                            </div>

                            <div className="col-span-2 sm:col-span-1">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                                <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-primary-500 outline-none" />
                            </div>

                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                                <input type="password" name="password" value={formData.password} onChange={handleChange} required className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-primary-500 outline-none" />
                            </div>

                            {formData.role === 'VENDOR' && (
                                <>
                                    <div className="col-span-2 sm:col-span-1">
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
                                        <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-primary-500 outline-none" placeholder="Same as Full Name" />
                                    </div>
                                    <div className="col-span-2 sm:col-span-1">
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Registration Number</label>
                                        <input type="text" name="registrationNumber" value={formData.registrationNumber} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-primary-500 outline-none" />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Company Address</label>
                                        <textarea name="address" value={formData.address} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-primary-500 outline-none" rows="2"></textarea>
                                    </div>
                                </>
                            )}

                            {formData.role === 'ADMIN' && (
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Department Assigned</label>
                                    <select
                                        name="department"
                                        value={formData.department}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                    >
                                        <option value="Public Works">Public Works Department</option>
                                        <option value="Transport">Transport Department</option>
                                        <option value="Health">Health Department</option>
                                        <option value="Water Resources">Water Resources Department</option>
                                    </select>
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 rounded-lg transition-colors shadow-md shadow-primary-500/30 mt-4"
                        >
                            Complete Registration
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-slate-600">
                        Already have an account? <Link to="/login" className="text-primary-600 font-semibold hover:text-primary-700">Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
