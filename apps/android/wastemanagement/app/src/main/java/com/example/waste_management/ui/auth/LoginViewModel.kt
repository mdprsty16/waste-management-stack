package com.example.waste_management.ui.auth

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.viewModelScope
import com.example.waste_management.data.local.TokenManager
import com.example.waste_management.data.repository.AuthRepository
import kotlinx.coroutines.launch

// ============================================================
// LoginViewModel — MVVM ViewModel untuk login
// Sesuai dengan hooks/useAuth.ts di website
// ============================================================

class LoginViewModel(application: Application) : AndroidViewModel(application) {

    private val tokenManager = TokenManager(application)
    private val authRepository = AuthRepository(tokenManager)

    private val _isLoading = MutableLiveData(false)
    val isLoading: LiveData<Boolean> = _isLoading

    private val _error = MutableLiveData<String?>(null)
    val error: LiveData<String?> = _error

    private val _loginSuccess = MutableLiveData(false)
    val loginSuccess: LiveData<Boolean> = _loginSuccess

    /**
     * Login — panggil AuthRepository.login()
     * Sama dengan handleSubmit di login page website
     */
    fun login(username: String, password: String) {
        // Validasi input
        if (username.isBlank()) {
            _error.value = "Username wajib diisi"
            return
        }
        if (password.isBlank()) {
            _error.value = "Password wajib diisi"
            return
        }

        _isLoading.value = true
        _error.value = null

        viewModelScope.launch {
            val result = authRepository.login(username, password)

            result.fold(
                onSuccess = {
                    _isLoading.value = false
                    _loginSuccess.value = true
                },
                onFailure = { exception ->
                    _isLoading.value = false
                    _error.value = exception.message ?: "Login gagal"
                }
            )
        }
    }
}
