package com.example.waste_management.data.local

import android.content.Context
import android.content.SharedPreferences

// ============================================================
// TokenManager — Wrapper SharedPreferences untuk JWT token
// Menyimpan token dan data admin yang sedang login
// ============================================================

class TokenManager(context: Context) {

    companion object {
        private const val PREFS_NAME = "waste_management_prefs"
        private const val KEY_TOKEN = "jwt_token"
        private const val KEY_ADMIN_NAME = "admin_name"
        private const val KEY_ADMIN_ID = "admin_id"
    }

    private val prefs: SharedPreferences =
        context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)

    fun saveToken(token: String) {
        prefs.edit().putString(KEY_TOKEN, token).apply()
    }

    fun getToken(): String? {
        return prefs.getString(KEY_TOKEN, null)
    }

    fun saveAdminInfo(id: String, name: String) {
        prefs.edit()
            .putString(KEY_ADMIN_ID, id)
            .putString(KEY_ADMIN_NAME, name)
            .apply()
    }

    fun getAdminName(): String? {
        return prefs.getString(KEY_ADMIN_NAME, null)
    }

    fun getAdminId(): String? {
        return prefs.getString(KEY_ADMIN_ID, null)
    }

    fun isLoggedIn(): Boolean {
        return !getToken().isNullOrEmpty()
    }

    fun clear() {
        prefs.edit().clear().apply()
    }
}
