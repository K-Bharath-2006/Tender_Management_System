import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import AdminLayout from '../layouts/AdminLayout';

import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import TenderList from '../pages/TenderList';
import TenderDetails from '../pages/TenderDetails';
import SubmitBid from '../pages/SubmitBid';
import Results from '../pages/Results';

import Dashboard from '../pages/Dashboard';
import MyBids from '../pages/MyBids';
import CreateTender from '../pages/CreateTender';
import ManageTenders from '../pages/ManageTenders';
import ViewBids from '../pages/ViewBids';

const AppRoutes = () => {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/results" element={<Results />} />

            {/* Protected VENDOR Routes */}
            <Route element={<ProtectedRoute allowedRoles={['ROLE_VENDOR', 'ROLE_ADMIN']} />}>
                <Route path="/tenders" element={<TenderList />} />
                <Route path="/tender-details/:id" element={<TenderDetails />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['ROLE_VENDOR']} />}>
                <Route path="/submit-bid/:id" element={<SubmitBid />} />
                <Route path="/my-bids" element={<MyBids />} />
            </Route>

            {/* Protected Admin Routes */}
            <Route element={<ProtectedRoute allowedRoles={['ROLE_ADMIN']} />}>
                <Route element={<AdminLayout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/create-tender" element={<CreateTender />} />
                    <Route path="/manage-tenders" element={<ManageTenders />} />
                    <Route path="/view-bids/:tenderId?" element={<ViewBids />} />
                </Route>
            </Route>
        </Routes>
    );
};

export default AppRoutes;
