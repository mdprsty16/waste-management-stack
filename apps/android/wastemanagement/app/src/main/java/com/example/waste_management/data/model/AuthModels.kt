package com.example.waste_management.data.model

import com.google.gson.annotations.SerializedName

// ============================================================
// Auth Models — Sesuai dengan types/auth.types.ts di website
// ============================================================

/** Body request untuk POST /api/auth/login */
data class LoginRequest(
    @SerializedName("username") val username: String,
    @SerializedName("password") val password: String
)

/** Data admin di dalam LoginResponseData */
data class AdminInfo(
    @SerializedName("id") val id: String,
    @SerializedName("nama") val nama: String
)

/** Data yang dikembalikan setelah login berhasil */
data class LoginResponseData(
    @SerializedName("token") val token: String,
    @SerializedName("admin") val admin: AdminInfo
)

/** Data Admin yang dikembalikan oleh GET /api/auth/me */
data class Admin(
    @SerializedName("id_admin") val idAdmin: String,
    @SerializedName("username") val username: String,
    @SerializedName("nama_admin") val namaAdmin: String,
    @SerializedName("created_at") val createdAt: String
)
