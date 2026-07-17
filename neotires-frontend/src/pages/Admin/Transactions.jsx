import React, { useState, useEffect } from 'react';
import api from '../../api/axios';

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            const response = await api.get('/admin/transactions');
            setTransactions(response.data.data.data || []);
            setLoading(false);
        } catch (error) {
            console.error('Error:', error);
            setLoading(false);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await api.put(`/admin/transactions/${id}/status`, { status });
            setMessage('Status pesanan berhasil diupdate!');
            fetchTransactions();
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            alert('Gagal update status');
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
        <div className="container py-4">
            <h1 className="mb-4">Kelola Transaksi</h1>
            
            {message && (
                <div className="alert alert-success alert-dismissible fade show">
                    {message}
                    <button type="button" className="btn-close" onClick={() => setMessage('')}></button>
                </div>
            )}
            
            <div className="card">
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-bordered table-hover">
                            <thead className="table-light">
                                <tr>
                                    <th>ID</th>
                                    <th>Customer</th>
                                    <th>Tanggal</th>
                                    <th>Total</th>
                                    <th>Metode</th>
                                    <th>Status</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((transaction) => (
                                    <tr key={transaction.id}>
                                        <td>{transaction.id}</td>
                                        <td>
                                            {transaction.user?.name || 'Unknown'}<br />
                                            <small>{transaction.user?.email || ''}</small>
                                        </td>
                                        <td>{new Date(transaction.transaction_date).toLocaleString('id-ID')}</td>
                                        <td>Rp {new Intl.NumberFormat('id-ID').format(transaction.total_price)}</td>
                                        <td>{transaction.payment_method}</td>
                                        <td>
                                            <span className={`badge bg-${getStatusBadge(transaction.status)}`}>
                                                {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="d-flex gap-1">
                                                <select 
                                                    className="form-select form-select-sm" 
                                                    style={{ width: '130px' }}
                                                    value={transaction.status}
                                                    onChange={(e) => updateStatus(transaction.id, e.target.value)}
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="diproses">Diproses</option>
                                                    <option value="dikirim">Dikirim</option>
                                                    <option value="selesai">Selesai</option>
                                                </select>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Transactions;