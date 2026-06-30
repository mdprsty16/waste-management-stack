package com.example.waste_management.data.remote

import com.example.waste_management.data.local.TokenManager
import okhttp3.Interceptor
import okhttp3.Response

// ============================================================
// AuthInterceptor — Otomatis sisipkan Bearer token ke header
// Sesuai dengan proxy.ts di website yang membaca Authorization header
// ============================================================

class AuthInterceptor(private val tokenManager: TokenManager) : Interceptor {

    override fun intercept(chain: Interceptor.Chain): Response {
        val originalRequest = chain.request()

        // Skip auth header untuk endpoint login (public)
        if (originalRequest.url.encodedPath.contains("auth/login")) {
            return chain.proceed(originalRequest)
        }

        val token = tokenManager.getToken()

        val request = if (!token.isNullOrEmpty()) {
            originalRequest.newBuilder()
                .header("Authorization", "Bearer $token")
                .header("Content-Type", "application/json")
                .build()
        } else {
            originalRequest
        }

        return chain.proceed(request)
    }
}
