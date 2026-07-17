import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [sizeFilter, setSizeFilter] = useState('');
    const [brandFilter, setBrandFilter] = useState('');
    const [sizes, setSizes] = useState([]);
    const [brands, setBrands] = useState([]);

    useEffect(() => {
        fetchProducts();
    }, [search, sizeFilter, brandFilter]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (search) params.append('search', search);
            if (sizeFilter) params.append('size', sizeFilter);
            if (brandFilter) params.append('brand', brandFilter);
            
            const response = await api.get(`/products?${params.toString()}`);
            const data = response.data.data.data || [];
            setProducts(data);
            
            // Extract unique sizes and brands for filters
            const allProducts = response.data.data.data || [];
            const uniqueSizes = [...new Set(allProducts.map(p => p.size))];
            const uniqueBrands = [...new Set(allProducts.map(p => p.brand))];
            setSizes(uniqueSizes);
            setBrands(uniqueBrands);
            
            setLoading(false);
        } catch (error) {
            console.error('Error fetching products:', error);
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchProducts();
    };

    const resetFilters = () => {
        setSearch('');
        setSizeFilter('');
        setBrandFilter('');
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
            <h1 className="mb-4">Daftar Produk Ban</h1>
            
            {/* Filter Section */}
            <div className="card mb-4">
                <div className="card-body">
                    <form onSubmit={handleSearch} className="row g-3">
                        <div className="col-md-4">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Cari nama atau merek..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="col-md-3">
                            <select 
                                className="form-select"
                                value={sizeFilter}
                                onChange={(e) => setSizeFilter(e.target.value)}
                            >
                                <option value="">Semua Ukuran</option>
                                {sizes.map(size => (
                                    <option key={size} value={size}>{size}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-3">
                            <select 
                                className="form-select"
                                value={brandFilter}
                                onChange={(e) => setBrandFilter(e.target.value)}
                            >
                                <option value="">Semua Merek</option>
                                {brands.map(brand => (
                                    <option key={brand} value={brand}>{brand}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-2">
                            <button type="submit" className="btn btn-primary w-100">Filter</button>
                        </div>
                    </form>
                    <div className="mt-2">
                        <button className="btn btn-sm btn-secondary" onClick={resetFilters}>
                            Reset Filter
                        </button>
                    </div>
                </div>
            </div>

            {/* Product Grid */}
            <div className="row">
                {products.length === 0 ? (
                    <div className="col-12">
                        <div className="alert alert-info">
                            <i className="fas fa-info-circle"></i> Tidak ada produk ditemukan.
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
                                        <strong>{product.brand}</strong> - {product.size}<br />
                                        Stok: {product.stock} pcs
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

export default Products;