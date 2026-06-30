package com.example.waste_management.data.remote

import com.example.waste_management.BuildConfig
import com.example.waste_management.data.local.TokenManager
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.util.concurrent.TimeUnit

// ============================================================
// ApiClient — Singleton Retrofit instance
// Base URL dikonfigurasi via BuildConfig (bukan hardcode)
// ============================================================

object ApiClient {

    private var apiService: ApiService? = null

    fun getService(tokenManager: TokenManager): ApiService {
        if (apiService == null) {
            val logging = HttpLoggingInterceptor().apply {
                level = if (BuildConfig.DEBUG) {
                    HttpLoggingInterceptor.Level.BODY
                } else {
                    HttpLoggingInterceptor.Level.NONE
                }
            }

            val client = OkHttpClient.Builder()
                .addInterceptor(AuthInterceptor(tokenManager))
                .addInterceptor(logging)
                .connectTimeout(30, TimeUnit.SECONDS)
                .readTimeout(30, TimeUnit.SECONDS)
                .writeTimeout(30, TimeUnit.SECONDS)
                .build()

            val retrofit = Retrofit.Builder()
                .baseUrl(BuildConfig.BASE_URL + "/")
                .client(client)
                .addConverterFactory(GsonConverterFactory.create())
                .build()

            apiService = retrofit.create(ApiService::class.java)
        }

        return apiService!!
    }

    /**
     * Reset instance — dipanggil saat logout untuk membersihkan state
     */
    fun reset() {
        apiService = null
    }
}
