import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../../api/axios';

const Create = () => {
    const [formData, setFormData] = useState({
        name: '',
        brand: '',
        size: '',
        price: '',
        stock: '',
        description: '',
        image: null
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState({});
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === 'file') {
            setFormData({ ...formData, image: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError({});

        const data = new FormData();
        Object.keys(formData).forEach(key => {
            if (formData[key] !== null && formData[key] !== '') {
                data.append(key, formData[key]);
            }
        });

        try {
            await api.post('/admin/products', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            navigate('/admin/products');
        } catch (error) {
            if (error.response?.data?.errors) {
                setError(error.response.data.errors);
            } else {
                alert('Gagal menambahkan produk');
            }
            setLoading(false);
        }
    };

    return (
        <div className="container py-4">
            <div className="card">
                <div className="card-header" style={{ backgroundColor: '#1E3A8A', color: 'white' }}>
                    <h4 className="mb-0">Tambah Produk Ban</h4>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit} encType="multipart/form-data">
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Nama Produk *</label>
                                <input
                                    type="text"
                                    className={`form-control ${error.name ? 'is-invalid' : ''}`}
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                                {error.name && <div className="invalid-feedback">{error.name[0]}</div>}
                            </div>
                            
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Merek *</label>
                                <input
                                    type="text"
                                    className={`form-control ${error.brand ? 'is-invalid' : ''}`}
                                    name="brand"
                                    value={formData.brand}
                                    onChange={handleChange}
                                    required
                                />
                                {error.brand && <div className="invalid-feedback">{error.brand[0]}</div>}
                            </div>
                            
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Ukuran Ban *</label>
                                <select
                                    className={`form-select ${error.size ? 'is-invalid' : ''}`}
                                    name="size"
                                    value={formData.size}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Pilih Ukuran</option>
                                    <option value="R13">R13</option>
                                    <option value="R14">R14</option>
                                    <option value="R15">R15</option>
                                    <option value="R16">R16</option>
                                    <option value="R17">R17</option>
                                    <option value="R18">R18</option>
                                    <option value="R19">R19</option>
                                    <option value="R20">R20</option>
                                </select>
                                {error.size && <div className="invalid-feedback">{error.size[0]}</div>}
                            </div>
                            
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Harga (Rp) *</label>
                                <input
                                    type="number"
                                    className={`form-control ${error.price ? 'is-invalid' : ''}`}
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    required
                                />
                                {error.price && <div className="invalid-feedback">{error.price[0]}</div>}
                            </div>
                            
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Stok *</label>
                                <input
                                    type="number"
                                    className={`form-control ${error.stock ? 'is-invalid' : ''}`}
                                    name="stock"
                                    value={formData.stock}
                                    onChange={handleChange}
                                    required
                                />
                                {error.stock && <div className="invalid-feedback">{error.stock[0]}</div>}
                            </div>
                            
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Gambar Produk</label>
                                <input
                                    type="file"
                                    className={`form-control ${error.image ? 'is-invalid' : ''}`}
                                    name="image"
                                    onChange={handleChange}
                                    accept="image/*"
                                />
                                {error.image && <div className="invalid-feedback">{error.image[0]}</div>}
                                <small className="text-muted">Format: JPG, PNG, JPEG (Max 2MB)</small>
                            </div>
                            
                            <div className="col-12 mb-3">
                                <label className="form-label">Deskripsi</label>
                                <textarea
                                    className={`form-control ${error.description ? 'is-invalid' : ''}`}
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows="4"
                                />
                                {error.description && <div className="invalid-feedback">{error.description[0]}</div>}
                            </div>
                        </div>
                        
                        <div className="d-flex justify-content-between">
                            <Link to="/admin/products" className="btn btn-secondary">Batal</Link>
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? 'Menyimpan...' : 'Simpan Produk'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Create;