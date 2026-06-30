package com.example.waste_management.data.repository

import com.example.waste_management.data.local.TokenManager
import com.example.waste_management.data.model.*
import com.example.waste_management.data.remote.ApiClient

// ============================================================
// DashboardRepository — Data layer untuk dashboard overview
// Sesuai dengan hooks/useNasabah.ts, useTransaksi.ts,
// useDailyTrend.ts, useKategoriStats.ts di website
// ============================================================

class DashboardRepository(private val tokenManager: TokenManager) {

    private val api get() = ApiClient.getService(tokenManager)

    /** GET /api/nasabah — Jumlah nasabah untuk stat card */
    suspend fun getNasabah(): Result<List<Nasabah>> {
        return try {
            val response = api.getNasabah()
            if (response.isSuccessful) {
                val body = response.body()
                if (body != null && body.success && body.data != null) {
                    Result.success(body.data)
                } else {
                    Result.failure(Exception(body?.message ?: "Gagal memuat data nasabah"))
                }
            } else {
                Result.failure(Exception("Gagal memuat data nasabah (${response.code()})"))
            }
        } catch (e: Exception) {
            Result.failure(Exception("Gagal terhubung: ${e.message}"))
        }
    }

    /** GET /api/transaksi — Data transaksi untuk stat card & tabel */
    suspend fun getTransaksi(): Result<List<Transaksi>> {
        return try {
            val response = api.getTransaksi()
            if (response.isSuccessful) {
                val body = response.body()
                if (body != null && body.success && body.data != null) {
                    Result.success(body.data)
                } else {
                    Result.failure(Exception(body?.message ?: "Gagal memuat data transaksi"))
                }
            } else {
                Result.failure(Exception("Gagal memuat data transaksi (${response.code()})"))
            }
        } catch (e: Exception) {
            Result.failure(Exception("Gagal terhubung: ${e.message}"))
        }
    }

    /** GET /api/daily — Tren mingguan + prediksi ML */
    suspend fun getDailyTrend(): Result<DailyTrendData> {
        return try {
            val response = api.getDailyTrend()
            if (response.isSuccessful) {
                val body = response.body()
                if (body != null && body.success && body.data != null) {
                    Result.success(body.data)
                } else {
                    Result.failure(Exception(body?.message ?: "Gagal memuat tren harian"))
                }
            } else {
                Result.failure(Exception("Gagal memuat tren harian (${response.code()})"))
            }
        } catch (e: Exception) {
            Result.failure(Exception("Gagal terhubung: ${e.message}"))
        }
    }

    /** GET /api/dashboard/kategori-stats — Statistik kategori */
    suspend fun getKategoriStats(): Result<List<KategoriStatItem>> {
        return try {
            val response = api.getKategoriStats()
            if (response.isSuccessful) {
                val body = response.body()
                if (body != null && body.success && body.data != null) {
                    Result.success(body.data)
                } else {
                    Result.failure(Exception(body?.message ?: "Gagal memuat statistik kategori"))
                }
            } else {
                Result.failure(Exception("Gagal memuat statistik kategori (${response.code()})"))
            }
        } catch (e: Exception) {
            Result.failure(Exception("Gagal terhubung: ${e.message}"))
        }
    }

    /** GET /api/dashboard — Aggregator: semua data dashboard dalam 1 panggilan */
    suspend fun getDashboard(): Result<DashboardResponse> {
        return try {
            val response = api.getDashboard()
            if (response.isSuccessful) {
                val body = response.body()
                if (body != null && body.success && body.data != null) {
                    Result.success(body.data)
                } else {
                    Result.failure(Exception(body?.message ?: "Gagal memuat dashboard"))
                }
            } else {
                Result.failure(Exception("Gagal memuat dashboard (${response.code()})"))
            }
        } catch (e: Exception) {
            Result.failure(Exception("Gagal terhubung: ${e.message}"))
        }
    }
}
