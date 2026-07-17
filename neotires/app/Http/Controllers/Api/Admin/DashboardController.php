<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        return response()->json([
            'success' => true,
            'data' => [
                'total_products' => Product::count(),
                'total_orders' => Transaction::count(),
                'total_customers' => User::where('role', 'customer')->count(),
            ]
        ]);
    }
}