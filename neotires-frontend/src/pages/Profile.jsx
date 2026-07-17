import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import AddressForm from '../components/AddressForm';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
    const { user } = useAuth();
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);

    useEffect(() => {
        fetchAddresses();
    }, []);

    const fetchAddresses = async () => {
        try {
            const response = await api.get('/addresses');
            setAddresses(response.data.data || []);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching addresses:', error);
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Yakin ingin menghapus alamat ini?')) return;
        
        try {
            await api.delete(`/addresses/${id}`);
            fetchAddresses();
        } catch (error) {
            alert('Gagal menghapus alamat');
        }
    };

    const handleSetDefault = async (id) => {
        try {
            await api.put(`/addresses/${id}/default`);
            fetchAddresses();
        } catch (error) {
            alert('Gagal mengubah alamat default');
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
        <div className="container py-5">
            <h1 className="mb-4">Profil Saya</h1>
            
            <div className="row">
                <div className="col-md-4">
                    <div className="card">
                        <div className="card-body">
                            <h5>Informasi Akun</h5>
                            <p><strong>Nama:</strong> {user?.name}</p>
                            <p><strong>Email:</strong> {user?.email}</p>
                            <p><strong>Role:</strong> {user?.role}</p>
                        </div>
                    </div>
                </div>
                
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-header" style={{ backgroundColor: '#1E3A8A', color: 'white' }}>
                            <div className="d-flex justify-content-between align-items-center">
                                <h5 className="mb-0">Daftar Alamat</h5>
                                <button 
                                    className="btn btn-light btn-sm"
                                    onClick={() => {
                                        setEditingAddress(null);
                                        setShowForm(!showForm);
                                    }}
                                >
                                    <i className="fas fa-plus"></i> Tambah Alamat
                                </button>
                            </div>
                        </div>
                        <div className="card-body">
                            {showForm && (
                                <AddressForm 
                                    onSuccess={() => {
                                        setShowForm(false);
                                        setEditingAddress(null);
                                        fetchAddresses();
                                    }}
                                    onCancel={() => {
                                        setShowForm(false);
                                        setEditingAddress(null);
                                    }}
                                    initialData={editingAddress}
                                />
                            )}
                            
                            {addresses.length === 0 ? (
                                <div className="alert alert-info">
                                    Belum ada alamat tersimpan.
                                </div>
                            ) : (
                                addresses.map((addr) => (
                                    <div className="border-bottom pb-3 mb-3" key={addr.id}>
                                        <div className="d-flex justify-content-between">
                                            <div>
                                                <h6>
                                                    {addr.label}
                                                    {addr.is_default && (
                                                        <span className="badge bg-success ms-2">Default</span>
                                                    )}
                                                </h6>
                                                <p className="mb-0">{addr.recipient_name} - {addr.phone}</p>
                                                <p className="mb-0">{addr.address}</p>
                                                <p className="mb-0">{addr.city}, {addr.province}</p>
                                                <p className="mb-0">Kode Pos: {addr.postal_code}</p>
                                            </div>
                                            <div>
                                                {!addr.is_default && (
                                                    <button 
                                                        className="btn btn-sm btn-outline-success me-1"
                                                        onClick={() => handleSetDefault(addr.id)}
                                                    >
                                                        Jadikan Default
                                                    </button>
                                                )}
                                                <button 
                                                    className="btn btn-sm btn-outline-primary me-1"
                                                    onClick={() => {
                                                        setEditingAddress(addr);
                                                        setShowForm(true);
                                                    }}
                                                >
                                                    Edit
                                                </button>
                                                <button 
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() => handleDelete(addr.id)}
                                                >
                                                    Hapus
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;