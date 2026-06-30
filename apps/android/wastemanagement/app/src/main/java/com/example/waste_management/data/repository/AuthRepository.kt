package com.example.waste_management.data.repository

import com.example.waste_management.data.local.TokenManager
import com.example.waste_management.data.model.Admin
import com.example.waste_management.data.model.LoginRequest
import com.example.waste_management.data.model.LoginResponseData
import com.example.waste_management.data.remote.ApiClient

// ============================================================
// AuthRepository — Logika autentikasi
// Sesuai dengan hooks/useAuth.ts + services/auth.service.ts
// ============================================================

class AuthRepository(private val tokenManager: TokenManager) {

    private val api get() = ApiClient.getService(tokenManager)

    /**
     * Login — POST /api/auth/login
     * Simpan token ke SharedPreferences jika berhasil
     */
    suspend fun login(username: String, password: String): Result<LoginResponseData> {
        return try {
            val response = api.login(LoginRequest(username, password))

            if (response.isSuccessful) {
                val body = response.body()
                if (body != null && body.success && body.data != null) {
                    // Simpan token dan info admin
                    tokenManager.saveToken(body.data.token)
                    tokenManager.saveAdminInfo(body.data.admin.id, body.data.admin.nama)
                    Result.success(body.data)
                } else {
                    Result.failure(Exception(body?.message ?: "Login gagal"))
                }
            } else {
                // Parse error body untuk mendapatkan pesan error dari API
                val errorMessage = try {
                    val errorBody = response.errorBody()?.string()
                    // Coba extract message dari JSON error response
                    if (errorBody != null) {
                        val gson = com.google.gson.Gson()
                        val errorResponse = gson.fromJson(errorBody, com.example.waste_management.data.model.ApiResponse::class.java)
                        errorResponse.message
                    } else {
                        "Login gagal dengan status ${response.code()}"
                    }
                } catch (e: Exception) {
                    "Login gagal dengan status ${response.code()}"
                }
                Result.failure(Exception(errorMessage))
            }
        } catch (e: Exception) {
            Result.failure(Exception("Gagal terhubung ke server: ${e.message}"))
        }
    }

    /**
     * Logout — POST /api/auth/logout
     * Hapus token dari SharedPreferences
     */
    suspend fun logout(): Result<Unit> {
        return try {
            api.logout()
            tokenManager.clear()
            ApiClient.reset()
            Result.success(Unit)
        } catch (e: Exception) {
            // Tetap hapus token walau API error (sama dengan website)
            tokenManager.clear()
            ApiClient.reset()
            Result.success(Unit)
        }
    }

    /**
     * Check session — GET /api/auth/me
     */
    suspend fun getMe(): Result<Admin> {
        return try {
            val response = api.getMe()
            if (response.isSuccessful) {
                val body = response.body()
                if (body != null && body.success && body.data != null) {
                    Result.success(body.data)
                } else {
                    Result.failure(Exception(body?.message ?: "Session tidak valid"))
                }
            } else {
                Result.failure(Exception("Session tidak valid"))
            }
        } catch (e: Exception) {
            Result.failure(Exception("Gagal memeriksa session: ${e.message}"))
        }
    }

    fun isLoggedIn(): Boolean = tokenManager.isLoggedIn()

    fun getAdminName(): String? = tokenManager.getAdminName()
}
