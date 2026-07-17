import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../contexts/AuthContext';

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
            const response = await api.get(`/products/${id}`);
            setProduct(response.data.data);
            setLoading(false);
        } catch (error) {
            setError('Produk tidak ditemukan');
            setLoading(false);
        }
    };

    const addToCart = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        try {
            await api.post(`/cart/add/${id}`);
            setSuccess('Produk ditambahkan ke keranjang!');
            setTimeout(() => setSuccess(''), 3000);
        } catch (error) {
            setError(error.response?.data?.message || 'Gagal menambahkan ke keranjang');
            setTimeout(() => setError(''), 3000);
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

    if (!product) {
        return (
            <div className="container mt-5">
                <div className="alert alert-danger">Produk tidak ditemukan</div>
                <Link to="/products" className="btn btn-primary">Kembali</Link>
            </div>
        );
    }

    return (
        <div className="container py-5">
            {success && (
                <div className="alert alert-success alert-dismissible fade show">
                    <i className="fas fa-check-circle"></i> {success}
                    <button type="button" className="btn-close" onClick={() => setSuccess('')}></button>
                </div>
            )}
            {error && (
                <div className="alert alert-danger alert-dismissible fade show">
                    <i className="fas fa-exclamation-circle"></i> {error}
                    <button type="button" className="btn-close" onClick={() => setError('')}></button>
                </div>
            )}

            <div className="row">
                <div className="col-md-6">
                    {product.image ? (
                        <img 
                            src={`http://localhost:8000/storage/${product.image}`} 
                            className="img-fluid rounded" 
                            alt={product.name}
                        />
                    ) : (
                        <img 
                            src="https://via.placeholder.com/500x400?text=No+Image" 
                            className="img-fluid rounded" 
                            alt="Placeholder"
                        />
                    )}
                </div>
                <div className="col-md-6">
                    <h1>{product.name}</h1>
                    <p className="text-muted">Merek: {product.brand} | Ukuran: {product.size}</p>
                    <div className="price display-4 mb-3" style={{ color: '#2563EB', fontWeight: 'bold' }}>
                        Rp {new Intl.NumberFormat('id-ID').format(product.price)}
                    </div>
                    <p><strong>Stok:</strong> {product.stock} pcs</p>
                    <p><strong>Deskripsi:</strong></p>
                    <p>{product.description || 'Tidak ada deskripsi untuk produk ini.'}</p>
                    
                    {user ? (
                        user.role === 'admin' ? (
                            <div className="alert alert-info">
                                <i className="fas fa-info-circle"></i> Anda login sebagai admin.
                            </div>
                        ) : product.stock > 0 ? (
                            <button className="btn btn-primary btn-lg" onClick={addToCart}>
                                <i className="fas fa-shopping-cart"></i> Tambah ke Keranjang
                            </button>
                        ) : (
                            <div className="alert alert-danger">Maaf, produk ini sedang habis.</div>
                        )
                    ) : (
                        <div className="alert alert-info">
                            <i className="fas fa-info-circle"></i> Silakan <Link to="/login">login</Link> untuk membeli.
                        </div>
                    )}
                    
                    <div className="mt-3">
                        <Link to="/products" className="btn btn-secondary">
                            <i className="fas fa-arrow-left"></i> Kembali
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;