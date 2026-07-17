import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();  // ← Ambil logout dari context
    const navigate = useNavigate();

    // ← DEFINSIKAN handleLogout DI SINI!
    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: '#1E3A8A' }}>
            <div className="container">
                <Link className="navbar-brand" to="/">
                    <i className="fas fa-tire"></i> NeoTires
                </Link>
                <button 
                    className="navbar-toggler" 
                    type="button" 
                    data-bs-toggle="collapse" 
                    data-bs-target="#navbarNav"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/products">Produk</Link>
                        </li>
                        
                        {user ? (
                            <>
                                {user.role === 'admin' ? (
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/admin/dashboard">
                                            <i className="fas fa-tachometer-alt"></i> Dashboard Admin
                                        </Link>
                                    </li>
                                ) : (
                                    <>
                                        <li className="nav-item">
                                            <Link className="nav-link" to="/cart">
                                                <i className="fas fa-shopping-cart"></i> Keranjang
                                            </Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link" to="/transactions">
                                                <i className="fas fa-history"></i> Riwayat
                                            </Link>
                                        </li>
                                    </>
                                )}
                                
                                <li className="nav-item dropdown">
                                    <a 
                                        className="nav-link dropdown-toggle" 
                                        href="#" 
                                        id="navbarDropdown" 
                                        role="button" 
                                        data-bs-toggle="dropdown" 
                                        aria-expanded="false"
                                    >
                                        <i className="fas fa-user"></i> {user.name}
                                    </a>
                                    <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                                        <li>
                                            <Link className="dropdown-item" to="/profile">
                                                <i className="fas fa-user"></i> Profile
                                            </Link>
                                        </li>
                                        <li>
                                            <hr className="dropdown-divider" />
                                        </li>
                                        <li>
                                            <button 
                                                className="dropdown-item" 
                                                onClick={handleLogout}  // ← SEKARANG SUDAH TERDEFINISI
                                            >
                                                <i className="fas fa-sign-out-alt"></i> Logout
                                            </button>
                                        </li>
                                    </ul>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/login">
                                        <i className="fas fa-sign-in-alt"></i> Login
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/register">
                                        <i className="fas fa-user-plus"></i> Register
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;