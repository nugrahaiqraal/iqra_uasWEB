import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/products')
            .then(response => {
                setProducts(response.data.data.data || []);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching products:', error);
                setLoading(false);
            });
    }, []);

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
            <div className="text-center mb-5">
                <h1 style={{ color: '#1E3A8A' }}>Selamat Datang di NeoTires</h1>
                <p className="lead">Temukan ban berkualitas untuk kendaraan Anda</p>
            </div>

            <div className="row">
                {products.length === 0 ? (
                    <div className="col-12">
                        <div className="alert alert-info">
                            <i className="fas fa-info-circle"></i> Belum ada produk. Silakan tambahkan produk melalui admin.
                        </div>
                    </div>
                ) : (
                    products.map(product => (
                        <div className="col-md-3 mb-4" key={product.id}>
                            <div className="card h-100">
                                {product.image ? (
                                    <img 
                                        src={`http://localhost:8000/storage/${product.image}`} 
                                        className="card-img-top" 
                                        alt={product.name}
                                        style={{ height: '200px', objectFit: 'cover' }}
                                    />
                                ) : (
                                    <img 
                                        src="https://via.placeholder.com/300x200?text=No+Image" 
                                        className="card-img-top" 
                                        alt="Placeholder"
                                        style={{ height: '200px', objectFit: 'cover' }}
                                    />
                                )}
                                <div className="card-body">
                                    <h5 className="card-title">{product.name}</h5>
                                    <p className="card-text">
                                        <strong>{product.brand}</strong> - {product.size}
                                    </p>
                                    <div className="price" style={{ color: '#2563EB', fontWeight: 'bold', fontSize: '1.25rem' }}>
                                        Rp {new Intl.NumberFormat('id-ID').format(product.price)}
                                    </div>
                                    <Link to={`/products/${product.id}`} className="btn btn-primary w-100 mt-3">
                                        Detail
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Home;