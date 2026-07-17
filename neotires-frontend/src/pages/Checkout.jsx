import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import AddressForm from '../components/AddressForm';

const Checkout = () => {
    const [cartItems, setCartItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState('');
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [cartRes, addressRes] = await Promise.all([
                api.get('/cart'),
                api.get('/addresses')
            ]);
            
            if (cartRes.data.data.items.length === 0) {
                navigate('/cart');
                return;
            }
            
            setCartItems(cartRes.data.data.items || []);
            setTotal(cartRes.data.data.total || 0);
            setAddresses(addressRes.data.data || []);
            
            // Set default address
            const defaultAddr = addressRes.data.data.find(a => a.is_default);
            if (defaultAddr) {
                setSelectedAddress(defaultAddr.id);
            } else if (addressRes.data.data.length > 0) {
                setSelectedAddress(addressRes.data.data[0].id);
            }
            
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedAddress) {
            setError('Silakan pilih alamat pengiriman');
            return;
        }
        
        setError('');
        setSubmitting(true);

        try {
            await api.post('/checkout', { 
                payment_method: paymentMethod,
                address_id: selectedAddress
            });
            navigate('/transactions');
        } catch (error) {
            setError(error.response?.data?.message || 'Checkout gagal. Silakan coba lagi.');
            setSubmitting(false);
        }
    };

    const handleAddressAdded = () => {
        setShowAddressForm(false);
        fetchData();
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
            <h1 className="mb-4">Checkout</h1>
            
            {error && (
                <div className="alert alert-danger">{error}</div>
            )}

            <div className="row">
                <div className="col-md-8">
                    {/* Address Section */}
                    <div className="card mb-4">
                        <div className="card-header" style={{ backgroundColor: '#1E3A8A', color: 'white' }}>
                            <div className="d-flex justify-content-between align-items-center">
                                <h5 className="mb-0">Alamat Pengiriman</h5>
                                <button 
                                    className="btn btn-light btn-sm"
                                    onClick={() => setShowAddressForm(!showAddressForm)}
                                >
                                    <i className="fas fa-plus"></i> Tambah Alamat
                                </button>
                            </div>
                        </div>
                        <div className="card-body">
                            {showAddressForm ? (
                                <AddressForm 
                                    onSuccess={handleAddressAdded}
                                    onCancel={() => setShowAddressForm(false)}
                                />
                            ) : addresses.length === 0 ? (
                                <div className="alert alert-info">
                                    <i className="fas fa-info-circle"></i> Belum ada alamat. Silakan tambahkan alamat terlebih dahulu.
                                </div>
                            ) : (
                                <div>
                                    {addresses.map((addr) => (
                                        <div className="form-check mb-2" key={addr.id}>
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="address"
                                                id={`address-${addr.id}`}
                                                value={addr.id}
                                                checked={selectedAddress === addr.id}
                                                onChange={() => setSelectedAddress(addr.id)}
                                            />
                                            <label className="form-check-label" htmlFor={`address-${addr.id}`}>
                                                <strong>{addr.label}</strong>
                                                {addr.is_default && (
                                                    <span className="badge bg-success ms-2">Default</span>
                                                )}
                                                <br />
                                                {addr.recipient_name} - {addr.phone}
                                                <br />
                                                {addr.address}, {addr.city}, {addr.province}
                                                <br />
                                                Kode Pos: {addr.postal_code}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Order Details */}
                    <div className="card mb-4">
                        <div className="card-header" style={{ backgroundColor: '#1E3A8A', color: 'white' }}>
                            <h5 className="mb-0">Detail Pesanan</h5>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Produk</th>
                                            <th>Quantity</th>
                                            <th>Harga</th>
                                            <th>Subtotal</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cartItems.map((item) => (
                                            <tr key={item.id}>
                                                <td>
                                                    {item.product.name}
                                                    <br />
                                                    <small className="text-muted">
                                                        {item.product.brand} - {item.product.size}
                                                    </small>
                                                </td>
                                                <td>{item.quantity}</td>
                                                <td>Rp {new Intl.NumberFormat('id-ID').format(item.product.price)}</td>
                                                <td>Rp {new Intl.NumberFormat('id-ID').format(item.product.price * item.quantity)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="col-md-4">
                    <form onSubmit={handleSubmit}>
                        <div className="card">
                            <div className="card-header" style={{ backgroundColor: '#1E3A8A', color: 'white' }}>
                                <h5 className="mb-0">Metode Pembayaran</h5>
                            </div>
                            <div className="card-body">
                                <div className="mb-3">
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="payment_method"
                                            id="cod"
                                            value="COD"
                                            checked={paymentMethod === 'COD'}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                            required
                                        />
                                        <label className="form-check-label" htmlFor="cod">
                                            <i className="fas fa-money-bill-wave"></i> COD (Cash On Delivery)
                                        </label>
                                    </div>
                                    <div className="form-check mt-2">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="payment_method"
                                            id="transfer"
                                            value="Transfer Bank"
                                            checked={paymentMethod === 'Transfer Bank'}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                        />
                                        <label className="form-check-label" htmlFor="transfer">
                                            <i className="fas fa-university"></i> Transfer Bank
                                        </label>
                                    </div>
                                </div>
                                
                                <hr />
                                
                                <table className="table table-borderless">
                                    <tbody>
                                        <tr>
                                            <td>Total Item:</td>
                                            <td className="text-end">{cartItems.reduce((sum, item) => sum + item.quantity, 0)} pcs</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Total Pembayaran:</strong></td>
                                            <td className="text-end">
                                                <strong className="price">
                                                    Rp {new Intl.NumberFormat('id-ID').format(total)}
                                                </strong>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                
                                <button 
                                    type="submit" 
                                    className="btn btn-success w-100"
                                    disabled={submitting || addresses.length === 0}
                                >
                                    {submitting ? 'Memproses...' : 'Konfirmasi Pesanan'}
                                </button>
                                
                                {addresses.length === 0 && (
                                    <small className="text-danger d-block mt-2">
                                        * Tambahkan alamat terlebih dahulu
                                    </small>
                                )}
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Checkout;