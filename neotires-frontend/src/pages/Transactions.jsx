import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../contexts/AuthContext';

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            fetchTransactions();
        } else {
            setLoading(false);
        }
    }, [user]);

    const fetchTransactions = async () => {
        try {
            const response = await api.get('/transactions');
            setTransactions(response.data.data || []);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching transactions:', error);
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const map = {
            'pending': 'warning',
            'diproses': 'info',
            'dikirim': 'primary',
            'selesai': 'success'
        };
        return map[status] || 'secondary';
    };

    if (!user) {
        return (
            <div className="container mt-5">
                <div className="alert alert-warning">
                    <i className="fas fa-exclamation-triangle"></i> Silakan login terlebih dahulu.
                    <Link to="/login" className="alert-link ms-2">Login di sini</Link>
                </div>
            </div>
        );
    }

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
        <div className="container py-5">
            <h1 className="mb-4">Riwayat Transaksi</h1>
            
            {transactions.length === 0 ? (
                <div className="alert alert-info">
                    <i className="fas fa-history"></i> Belum ada transaksi.
                    <Link to="/products" className="alert-link ms-2">Mulai belanja</Link>
                </div>
            ) : (
                <div className="row">
                    {transactions.map((transaction) => (
                        <div className="col-md-6 mb-4" key={transaction.id}>
                            <div className="card">
                                <div className="card-header" style={{ backgroundColor: '#1E3A8A', color: 'white' }}>
                                    <div className="d-flex justify-content-between">
                                        <span>Transaksi #{transaction.id}</span>
                                        <span className={`badge bg-${getStatusBadge(transaction.status)}`}>
                                            {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                                        </span>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <p>
                                        <strong>Tanggal:</strong> {new Date(transaction.transaction_date).toLocaleString('id-ID')}
                                    </p>
                                    // Di card transaction, tambahkan:
<p><strong>Alamat Pengiriman:</strong></p>
<p className="text-muted" style={{ whiteSpace: 'pre-line' }}>
    {transaction.shipping_address}
</p>
                                    <p><strong>Metode:</strong> {transaction.payment_method}</p>
                                    <p>
                                        <strong>Total:</strong>{' '}
                                        <span className="price">
                                            Rp {new Intl.NumberFormat('id-ID').format(transaction.total_price)}
                                        </span>
                                    </p>
                                    <p>
                                        <strong>Jumlah Item:</strong>{' '}
                                        {transaction.details.reduce((sum, item) => sum + item.quantity, 0)} pcs
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Transactions;