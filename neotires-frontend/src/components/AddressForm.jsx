import React, { useState } from 'react';
import api from '../api/axios';

const AddressForm = ({ onSuccess, onCancel, initialData = null }) => {
    const [formData, setFormData] = useState({
        label: initialData?.label || 'Rumah',
        recipient_name: initialData?.recipient_name || '',
        phone: initialData?.phone || '',
        address: initialData?.address || '',
        city: initialData?.city || '',
        province: initialData?.province || '',
        postal_code: initialData?.postal_code || '',
        is_default: initialData?.is_default || false
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (initialData) {
                await api.put(`/addresses/${initialData.id}`, formData);
            } else {
                await api.post('/addresses', formData);
            }
            onSuccess();
        } catch (error) {
            setError(error.response?.data?.message || 'Gagal menyimpan alamat');
            setLoading(false);
        }
    };

    return (
        <div className="card">
            <div className="card-header" style={{ backgroundColor: '#1E3A8A', color: 'white' }}>
                <h5 className="mb-0">{initialData ? 'Edit Alamat' : 'Tambah Alamat Baru'}</h5>
            </div>
            <div className="card-body">
                {error && <div className="alert alert-danger">{error}</div>}
                
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Label</label>
                            <select
                                name="label"
                                className="form-select"
                                value={formData.label}
                                onChange={handleChange}
                                required
                            >
                                <option value="Rumah">Rumah</option>
                                <option value="Kantor">Kantor</option>
                                <option value="Kost">Kost</option>
                                <option value="Lainnya">Lainnya</option>
                            </select>
                        </div>
                        
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Nama Penerima</label>
                            <input
                                type="text"
                                name="recipient_name"
                                className="form-control"
                                value={formData.recipient_name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Nomor Telepon</label>
                            <input
                                type="text"
                                name="phone"
                                className="form-control"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Kota</label>
                            <input
                                type="text"
                                name="city"
                                className="form-control"
                                value={formData.city}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Provinsi</label>
                            <input
                                type="text"
                                name="province"
                                className="form-control"
                                value={formData.province}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Kode Pos</label>
                            <input
                                type="text"
                                name="postal_code"
                                className="form-control"
                                value={formData.postal_code}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        
                        <div className="col-12 mb-3">
                            <label className="form-label">Alamat Lengkap</label>
                            <textarea
                                name="address"
                                className="form-control"
                                rows="3"
                                value={formData.address}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        
                        <div className="col-12 mb-3">
                            <div className="form-check">
                                <input
                                    type="checkbox"
                                    name="is_default"
                                    className="form-check-input"
                                    checked={formData.is_default}
                                    onChange={handleChange}
                                />
                                <label className="form-check-label">
                                    Jadikan alamat utama
                                </label>
                            </div>
                        </div>
                    </div>
                    
                    <div className="d-flex gap-2">
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Menyimpan...' : 'Simpan Alamat'}
                        </button>
                        <button type="button" className="btn btn-secondary" onClick={onCancel}>
                            Batal
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddressForm;