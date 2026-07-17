import React from 'react';

const Footer = () => {
    return (
        <footer className="text-white py-3 mt-auto" style={{ backgroundColor: '#1E3A8A' }}>
            <div className="container text-center">
                <p className="mb-0">&copy; {new Date().getFullYear()} NeoTires. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;