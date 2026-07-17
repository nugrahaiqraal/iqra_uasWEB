import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../api/axios';

const Index = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await api.get('/admin/products');
            setProducts(response.data.data.data || []);
            setLoading(false);
        } catch (error) {
            console.error('Error:', error);
            setLoading(false);
        }
    };

    const deleteProduct = async (id) => {
        if (!window.confirm('Yakin ingin menghapus produk ini?')) return;
        
        try {
            await api.delete(`/admin/products/${id}`);
            setMessage('Produk berhasil dihapus!');
            fetchProducts();
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            alert('Gagal menghapus produk');
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
        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>Manajemen Produk</h1>
                <Link to="/admin/products/create" className="btn btn-success">
                    <i className="fas fa-plus"></i> Tambah Produk
                </Link>
            </div>
            
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
                                    <th>Gambar</th>
                                    <th>Nama</th>
                                    <th>Merek</th>
                                    <th>Ukuran</th>
                                    <th>Harga</th>
                                    <th>Stok</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => (
                                    <tr key={product.id}>
                                        <td>{product.id}</td>
                                        <td>
                                            {product.image ? (
                                                <img 
                                                    src={`http://localhost:8000/storage/${product.image}`} 
                                                    width="50" 
                                                    height="50" 
                                                    style={{ objectFit: 'cover' }} 
                                                    className="rounded"
                                                    alt={product.name}
                                                />
                                            ) : (
                                                <img 
                                                    src="https://via.placeholder.com/50x50?text=No+Image" 
                                                    width="50" 
                                                    height="50" 
                                                    className="rounded"
                                                    alt="Placeholder"
                                                />
                                            )}
                                        </td>
                                        <td>{product.name}</td>
                                        <td>{product.brand}</td>
                                        <td>{product.size}</td>
                                        <td>Rp {new Intl.NumberFormat('id-ID').format(product.price)}</td>
                                        <td>{product.stock}</td>
                                        <td>
                                            <Link to={`/admin/products/edit/${product.id}`} className="btn btn-sm btn-warning me-1">
                                                <i className="fas fa-edit"></i> Edit
                                            </Link>
                                            <button 
                                                className="btn btn-sm btn-danger"
                                                onClick={() => deleteProduct(product.id)}
                                            >
                                                <i className="fas fa-trash"></i> Hapus
                                            </button>
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

export default Index;