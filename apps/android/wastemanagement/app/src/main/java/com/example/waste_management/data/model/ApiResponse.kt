package com.example.waste_management.data.model

import com.google.gson.annotations.SerializedName

/**
 * Format standar response dari semua API endpoint
 * Sesuai dengan ApiResponse<T> di website (types/auth.types.ts)
 */
data class ApiResponse<T>(
    @SerializedName("success") val success: Boolean,
    @SerializedName("message") val message: String,
    @SerializedName("data") val data: T?,
    @SerializedName("errors") val errors: Any? = null
)
