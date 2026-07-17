import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

const Dashboard = () => {
    const [stats, setStats] = useState({
        total_products: 0,
        total_orders: 0,
        total_customers: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {
        try {
            const response = await api.get('/admin/dashboard');
            setStats(response.data.data);
            setLoading(false);
        } catch (error) {
            console.error('Error:', error);
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="container mt-5 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid py-4">
            <h1 className="mb-4">Dashboard Admin</h1>
            
            <div className="row mb-4">
                <div className="col-md-4">
                    <div className="card text-white bg-primary mb-3">
                        <div className="card-body">
                            <h5 className="card-title">Total Produk</h5>
                            <h2>{stats.total_products}</h2>
                            <p className="mb-0">Produk terdaftar</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card text-white bg-success mb-3">
                        <div className="card-body">
                            <h5 className="card-title">Total Pesanan</h5>
                            <h2>{stats.total_orders}</h2>
                            <p className="mb-0">Transaksi</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card text-white bg-info mb-3">
                        <div className="card-body">
                            <h5 className="card-title">Total Customer</h5>
                            <h2>{stats.total_customers}</h2>
                            <p className="mb-0">User terdaftar</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-md-12">
                    <div className="card">
                        <div className="card-header" style={{ backgroundColor: '#1E3A8A', color: 'white' }}>
                            <h5 className="mb-0">Menu Cepat</h5>
                        </div>
                        <div className="card-body">
                            <div className="d-grid gap-2">
                                <Link to="/admin/products" className="btn btn-primary">
                                    <i className="fas fa-box"></i> Kelola Produk
                                </Link>
                                <Link to="/admin/products/create" className="btn btn-success">
                                    <i className="fas fa-plus"></i> Tambah Produk
                                </Link>
                                <Link to="/admin/transactions" className="btn btn-info text-white">
                                    <i className="fas fa-shopping-cart"></i> Kelola Transaksi
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;