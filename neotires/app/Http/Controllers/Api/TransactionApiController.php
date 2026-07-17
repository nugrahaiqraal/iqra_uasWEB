<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Address;  // ← TAMBAHKAN INI
use App\Models\Cart;
use App\Models\Transaction;
use App\Models\TransactionDetail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class TransactionApiController extends Controller
{
    public function index()
    {
        $transactions = Transaction::with('details.product', 'address')  // ← TAMBAHKAN 'address'
            ->where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $transactions
        ]);
    }

    public function show($id)
    {
        $transaction = Transaction::with('details.product', 'address')  // ← TAMBAHKAN 'address'
            ->where('user_id', Auth::id())
            ->find($id);

        if (!$transaction) {
            return response()->json([
                'success' => false,
                'message' => 'Transaksi tidak ditemukan'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $transaction
        ]);
    }

    public function checkout(Request $request)
    {
        // VALIDASI - TAMBAHKAN address_id
        $validator = Validator::make($request->all(), [
            'payment_method' => 'required|in:COD,Transfer Bank',
            'address_id' => 'required|exists:addresses,id'  // ← TAMBAHKAN INI
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $cartItems = Cart::with('product')
            ->where('user_id', Auth::id())
            ->get();

        if ($cartItems->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'Keranjang belanja kosong'
            ], 400);
        }

        // CEK ALAMAT
        $address = Address::where('user_id', Auth::id())->find($request->address_id);
        
        if (!$address) {
            return response()->json([
                'success' => false,
                'message' => 'Alamat tidak ditemukan'
            ], 404);
        }

        DB::beginTransaction();

        try {
            $total = 0;

            foreach ($cartItems as $item) {
                if ($item->product->stock < $item->quantity) {
                    throw new \Exception("Stok {$item->product->name} tidak mencukupi!");
                }
                $total += $item->product->price * $item->quantity;
            }

            // BUAT SHIPPING ADDRESS TEXT
            $shippingAddress = $address->recipient_name . "\n" .
                              $address->phone . "\n" .
                              $address->address . "\n" .
                              $address->city . ", " . $address->province . "\n" .
                              "Kode Pos: " . $address->postal_code;

            // CREATE TRANSACTION - TAMBAHKAN address_id DAN shipping_address
            $transaction = Transaction::create([
                'user_id' => Auth::id(),
                'total_price' => $total,
                'status' => 'pending',
                'payment_method' => $request->payment_method,
                'transaction_date' => now(),
                'address_id' => $address->id,          // ← TAMBAHKAN
                'shipping_address' => $shippingAddress  // ← TAMBAHKAN
            ]);

            foreach ($cartItems as $item) {
                TransactionDetail::create([
                    'transaction_id' => $transaction->id,
                    'product_id' => $item->product_id,
                    'quantity' => $item->quantity,
                    'price_at_time' => $item->product->price
                ]);

                $item->product->decreaseStock($item->quantity);
            }

            Cart::where('user_id', Auth::id())->delete();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Checkout berhasil!',
                'data' => $transaction->load('details.product', 'address')  // ← TAMBAHKAN 'address'
            ], 201);

        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }
}