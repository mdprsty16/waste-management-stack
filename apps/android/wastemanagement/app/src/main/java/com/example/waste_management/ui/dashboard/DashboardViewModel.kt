package com.example.waste_management.ui.dashboard

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.viewModelScope
import com.example.waste_management.data.local.TokenManager
import com.example.waste_management.data.model.DashboardResponse
import com.example.waste_management.data.repository.AuthRepository
import com.example.waste_management.data.repository.DashboardRepository
import kotlinx.coroutines.launch

// ============================================================
// DashboardViewModel — MVVM ViewModel untuk dashboard overview
// Mengambil seluruh data dashboard dari 1 API call aggregator
// Sesuai dengan useDashboard() di website
// ============================================================

class DashboardViewModel(application: Application) : AndroidViewModel(application) {

    private val tokenManager = TokenManager(application)
    private val authRepository = AuthRepository(tokenManager)
    private val dashboardRepository = DashboardRepository(tokenManager)

    // --- Loading state ---
    private val _isLoading = MutableLiveData(true)
    val isLoading: LiveData<Boolean> = _isLoading

    // --- Error state ---
    private val _error = MutableLiveData<String?>(null)
    val error: LiveData<String?> = _error

    // --- Aggregated Dashboard Data ---
    private val _dashboardData = MutableLiveData<DashboardResponse?>(null)
    val dashboardData: LiveData<DashboardResponse?> = _dashboardData

    // --- Logout ---
    private val _logoutSuccess = MutableLiveData(false)
    val logoutSuccess: LiveData<Boolean> = _logoutSuccess

    // --- Admin info ---
    val adminName: String? get() = authRepository.getAdminName()

    init {
        fetchDashboardData()
    }

    /**
     * Fetch seluruh data dashboard dari aggregator API /api/dashboard
     * Sama dengan useDashboard() di website
     */
    fun fetchDashboardData() {
        _isLoading.value = true
        _error.value = null

        viewModelScope.launch {
            val result = dashboardRepository.getDashboard()

            result.fold(
                onSuccess = { response ->
                    _dashboardData.value = response
                    _isLoading.value = false
                },
                onFailure = { exception ->
                    _error.value = exception.message ?: "Gagal memuat data dashboard"
                    _isLoading.value = false
                }
            )
        }
    }

    /**
     * Logout — sama dengan useAuth().logout() di website
     */
    fun logout() {
        viewModelScope.launch {
            authRepository.logout()
            _logoutSuccess.value = true
        }
    }
}
