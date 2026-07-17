import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Transactions from './pages/Transactions';
import Profile from './pages/Profile';

// Admin
import AdminDashboard from './pages/Admin/Dashboard';
import AdminProducts from './pages/Admin/Products/Index';
import AdminCreateProduct from './pages/Admin/Products/Create';
import AdminEditProduct from './pages/Admin/Products/Edit';
import AdminTransactions from './pages/Admin/Transactions';

import './index.css';

const PrivateRoute = ({ children, adminOnly = false }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="text-center mt-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (!user) {
        window.location.href = '/login';
        return null;
    }

    if (adminOnly && user.role !== 'admin') {
        window.location.href = '/';
        return null;
    }

    return children;
};

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            
            <Route path="/cart" element={
                <PrivateRoute><Cart /></PrivateRoute>
            } />
            <Route path="/checkout" element={
                <PrivateRoute><Checkout /></PrivateRoute>
            } />
            <Route path="/transactions" element={
                <PrivateRoute><Transactions /></PrivateRoute>
            } />
            <Route path="/profile" element={
    <PrivateRoute><Profile /></PrivateRoute>
} />
            
            {/* Admin */}
            <Route path="/admin/dashboard" element={
                <PrivateRoute adminOnly={true}><AdminDashboard /></PrivateRoute>
            } />
            <Route path="/admin/products" element={
                <PrivateRoute adminOnly={true}><AdminProducts /></PrivateRoute>
            } />
            <Route path="/admin/products/create" element={
                <PrivateRoute adminOnly={true}><AdminCreateProduct /></PrivateRoute>
            } />
            <Route path="/admin/products/edit/:id" element={
                <PrivateRoute adminOnly={true}><AdminEditProduct /></PrivateRoute>
            } />
            <Route path="/admin/transactions" element={
                <PrivateRoute adminOnly={true}><AdminTransactions /></PrivateRoute>
            } />
        </Routes>
    );
}

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <div className="d-flex flex-column min-vh-100">
                    <Navbar />
                    <main className="flex-grow-1">
                        <AppRoutes />
                    </main>
                    <Footer />
                </div>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;