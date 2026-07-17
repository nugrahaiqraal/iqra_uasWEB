1. Bahasa Pemrograman yang Digunakan
1.1 PHP 8.2+ (Backend logic, API development)
1.2 JavaScript ES6+ (Frontend logic, React components)
1.3 HTML5 (Struktur halaman)
1.4 CSS (Styling dan layout)
1.5 SQL (Query database MySQL)

2. Framework, Library, API, dkk yang Digunakan
2.1 Backend (Laravel)
Laravel 11.x - Framework PHP untuk backend
Laravel Sanctum 4.0 - Autentikasi API dengan token
Laravel Breeze 2.0 - Autentikasi dasar (Blade)
MySQL 8.0 - Database management
Fruitcake CORS 3.0 - CORS handling untuk API

2.2 Frontend (React)
React 18.x - Library UI
Vite 5.x - Build tool dan development server
React Router DOM 6.x - Routing dan navigasi
Axios 1.x - HTTP client untuk API calls
Bootstrap 5.x - CSS framework responsive

2.3 API Endpoints
POST /api/register - Registrasi customer
POST /api/login - Login user
GET /api/products - Get semua produk
GET /api/products/{id} - Get detail produk
GET /api/cart - Get keranjang
POST /api/cart/add/{id} - Tambah ke keranjang
POST /api/checkout - Checkout
GET/POST/PUT/DELETE /api/admin/products - CRUD produk (admin)
GET/PUT /api/admin/transactions - Kelola transaksi (admin)

3. Fungsi dan Fitur Proyek yang Dibangun
3.1 Autentikasi & Role
Register, Login, Logout
Role Admin dan Customer
Redirect berbeda sesuai role

3.2 Halaman Publik 
Home page dengan produk terbaru
Detail produk (nama, merek, ukuran, harga, stok, deskripsi)
Search produk berdasarkan nama/merek
Filter berdasarkan ukuran dan merek

3.3 Customer (Setelah Login)
Keranjang belanja (tambah, update, hapus)
Checkout dengan pilihan metode pembayaran (COD/Transfer Bank)
Stok otomatis berkurang setelah checkout
Riwayat transaksi
Alamat pengiriman (tambah, edit, hapus)

3.4 Admin (Setelah Login sebagai Admin)
CRUD produk ban (tambah, edit, hapus, lihat)
Upload gambar produk
Kelola transaksi semua customer
Update status pesanan (pending → diproses → dikirim → selesai)
Dashboard admin (statistik produk, pesanan, customer)

3.5 Keamanan
Middleware CheckRole untuk membedakan akses
Validasi form di server
Stok tidak bisa minus (cek saat tambah keranjang & checkout)
Flash message untuk success/error

4. Kelebihan Proyek yang Dibangun
4.1 Full Stack Modern menggunakan Laravel + React + Vite
4.2 Responsive Design dengan Bootstrap 5
4.3 SPA (Single Page Application) memberikan pengalaman cepat tanpa reload
4.4 RESTful API siap untuk mobile 
4.5 Role-Based Access untuk admin dan customer
4.6 Real-time Stock Update saat checkout
4.7 Search & Filter untuk mencari produk
4.8 Complete CRUD untuk admin kelola produk
4.9 Alamat Pengiriman multiple addresses
4.10 Secure Authentication dengan Laravel Sanctum token

5. Kekurangan Proyek yang Dibangun (Bug/Warning)
5.1 Belum ada payment gateway real
5.2 Belum ada email verification
5.3 Belum ada export laporan transaksi
5.4 Belum ada pagination di frontend
5.5 Belum ada unit testing
5.6 Belum ada multi-language

Link : https://drive.google.com/file/d/1WAwrtVwpcRbaOeDa3SU7OHlo7O81BECa/view?usp=drive_link