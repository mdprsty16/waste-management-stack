package com.example.waste_management.data.remote

import com.example.waste_management.data.model.*
import retrofit2.Response
import retrofit2.http.*

// ============================================================
// ApiService — Retrofit interface untuk semua endpoint API
// Sesuai dengan services/ di website
// ============================================================

interface ApiService {

    // --- Auth (services/auth.service.ts) ---

    /** POST /api/auth/login — Public endpoint */
    @POST("api/auth/login")
    suspend fun login(@Body request: LoginRequest): Response<ApiResponse<LoginResponseData>>

    /** GET /api/auth/me — Protected endpoint */
    @GET("api/auth/me")
    suspend fun getMe(): Response<ApiResponse<Admin>>

    /** POST /api/auth/logout — Protected endpoint */
    @POST("api/auth/logout")
    suspend fun logout(): Response<ApiResponse<Any>>

    // --- Dashboard (services/dashboard.service.ts + nasabah + transaksi) ---

    /** GET /api/nasabah — Semua nasabah */
    @GET("api/nasabah")
    suspend fun getNasabah(): Response<ApiResponse<List<Nasabah>>>

    /** GET /api/transaksi — Semua transaksi */
    @GET("api/transaksi")
    suspend fun getTransaksi(): Response<ApiResponse<List<Transaksi>>>

    /** GET /api/daily — Tren mingguan + prediksi ML + alert */
    @GET("api/daily")
    suspend fun getDailyTrend(): Response<ApiResponse<DailyTrendData>>

    /** GET /api/dashboard/kategori-stats — Statistik per kategori */
    @GET("api/dashboard/kategori-stats")
    suspend fun getKategoriStats(): Response<ApiResponse<List<KategoriStatItem>>>

    /** GET /api/dashboard — Aggregator: semua data dashboard dalam 1 panggilan */
    @GET("api/dashboard")
    suspend fun getDashboard(): Response<ApiResponse<DashboardResponse>>

    /** GET /api/dashboard/summary — Public landing page statistics summary */
    @GET("api/dashboard/summary")
    suspend fun getSummary(): Response<ApiResponse<SummaryResponseData>>
}
