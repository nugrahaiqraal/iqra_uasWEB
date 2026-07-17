import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../contexts/AuthContext';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            fetchCart();
        } else {
            setLoading(false);
        }
    }, [user]);

    const fetchCart = async () => {
        try {
            const response = await api.get('/cart');
            setCartItems(response.data.data.items || []);
            setTotal(response.data.data.total || 0);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching cart:', error);
            setLoading(false);
        }
    };

    const updateQuantity = async (cartId, quantity) => {
        if (quantity < 1) return;
        
        try {
            await api.put(`/cart/update/${cartId}`, { quantity });
            setSuccess('Keranjang berhasil diupdate!');
            fetchCart();
            setTimeout(() => setSuccess(''), 3000);
        } catch (error) {
            setError(error.response?.data?.message || 'Gagal update keranjang');
            setTimeout(() => setError(''), 3000);
        }
    };

    const removeItem = async (cartId) => {
        if (!window.confirm('Hapus item ini dari keranjang?')) return;
        
        try {
            await api.delete(`/cart/remove/${cartId}`);
            setSuccess('Item dihapus dari keranjang!');
            fetchCart();
            setTimeout(() => setSuccess(''), 3000);
        } catch (error) {
            setError(error.response?.data?.message || 'Gagal hapus item');
            setTimeout(() => setError(''), 3000);
        }
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
            <h1 className="mb-4">Keranjang Belanja</h1>
            
            {error && (
                <div className="alert alert-danger alert-dismissible fade show">
                    <i className="fas fa-exclamation-circle"></i> {error}
                    <button type="button" className="btn-close" onClick={() => setError('')}></button>
                </div>
            )}
            {success && (
                <div className="alert alert-success alert-dismissible fade show">
                    <i className="fas fa-check-circle"></i> {success}
                    <button type="button" className="btn-close" onClick={() => setSuccess('')}></button>
                </div>
            )}

            {cartItems.length === 0 ? (
                <div className="alert alert-info">
                    <i className="fas fa-shopping-cart"></i> Keranjang Anda kosong.
                    <Link to="/products" className="alert-link ms-2">Belanja sekarang</Link>
                </div>
            ) : (
                <div className="row">
                    <div className="col-md-8">
                        <div className="card">
                            <div className="card-body">
                                {cartItems.map((item) => (
                                    <div className="row mb-3 pb-3 border-bottom" key={item.id}>
                                        <div className="col-md-2">
                                            {item.product.image ? (
                                                <img 
                                                    src={`http://localhost:8000/storage/${item.product.image}`} 
                                                    className="img-fluid rounded" 
                                                    alt={item.product.name}
                                                    style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                                                />
                                            ) : (
                                                <img 
                                                    src="https://via.placeholder.com/80x80?text=No+Image" 
                                                    className="img-fluid rounded" 
                                                    alt="Placeholder"
                                                    style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                                                />
                                            )}
                                        </div>
                                        <div className="col-md-4">
                                            <h5>{item.product.name}</h5>
                                            <p className="text-muted">{item.product.brand} - {item.product.size}</p>
                                        </div>
                                        <div className="col-md-2">
                                            <div className="d-flex align-items-center">
                                                <button 
                                                    className="btn btn-sm btn-outline-secondary"
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                >
                                                    -
                                                </button>
                                                <span className="mx-2">{item.quantity}</span>
                                                <button 
                                                    className="btn btn-sm btn-outline-secondary"
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    disabled={item.quantity >= item.product.stock}
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                        <div className="col-md-2">
                                            <div className="price">
                                                Rp {new Intl.NumberFormat('id-ID').format(item.product.price * item.quantity)}
                                            </div>
                                        </div>
                                        <div className="col-md-2 text-end">
                                            <button 
                                                className="btn btn-danger btn-sm"
                                                onClick={() => removeItem(item.id)}
                                            >
                                                <i className="fas fa-trash"></i> Hapus
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    
                    <div className="col-md-4">
                        <div className="card">
                            <div className="card-header" style={{ backgroundColor: '#1E3A8A', color: 'white' }}>
                                <h5 className="mb-0">Ringkasan Belanja</h5>
                            </div>
                            <div className="card-body">
                                <table className="table">
                                    <tbody>
                                        <tr>
                                            <td>Total Item:</td>
                                            <td className="text-end">
                                                {cartItems.reduce((sum, item) => sum + item.quantity, 0)} pcs
                                            </td>
                                        </tr>
                                        <tr>
                                            <td><strong>Total Harga:</strong></td>
                                            <td className="text-end">
                                                <strong className="price">
                                                    Rp {new Intl.NumberFormat('id-ID').format(total)}
                                                </strong>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <Link to="/checkout" className="btn btn-success w-100">
                                    <i className="fas fa-credit-card"></i> Checkout
                                </Link>
                                <Link to="/products" className="btn btn-secondary w-100 mt-2">
                                    <i className="fas fa-shopping-bag"></i> Lanjutkan Belanja
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;