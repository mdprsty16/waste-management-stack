package com.example.waste_management.ui.auth

import android.content.Intent
import android.os.Bundle
import android.view.View
import androidx.activity.enableEdgeToEdge
import androidx.activity.viewModels
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import com.example.waste_management.databinding.ActivityLoginBinding
import com.example.waste_management.ui.dashboard.DashboardActivity

// ============================================================
// LoginActivity — Halaman login
// Sesuai dengan app/(auth)/login/page.tsx di website
// ============================================================

class LoginActivity : AppCompatActivity() {

    private lateinit var binding: ActivityLoginBinding
    private val viewModel: LoginViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        binding = ActivityLoginBinding.inflate(layoutInflater)
        setContentView(binding.root)

        // Edge-to-edge insets
        ViewCompat.setOnApplyWindowInsetsListener(binding.root) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }

        setupUI()
        observeViewModel()
    }

    private fun setupUI() {
        // Back button → kembali ke Landing
        binding.btnBack.setOnClickListener {
            finish()
        }

        // Login button
        binding.btnLogin.setOnClickListener {
            val username = binding.etUsername.text.toString().trim()
            val password = binding.etPassword.text.toString().trim()
            viewModel.login(username, password)
        }
    }

    private fun observeViewModel() {
        // Loading state
        viewModel.isLoading.observe(this) { isLoading ->
            binding.btnLogin.isEnabled = !isLoading
            binding.btnLogin.text = if (isLoading) {
                getString(com.example.waste_management.R.string.login_loading)
            } else {
                getString(com.example.waste_management.R.string.login_button)
            }
            binding.progressLogin.visibility = if (isLoading) View.VISIBLE else View.GONE
            binding.etUsername.isEnabled = !isLoading
            binding.etPassword.isEnabled = !isLoading
        }

        // Error state
        viewModel.error.observe(this) { error ->
            if (error != null) {
                binding.layoutError.visibility = View.VISIBLE
                binding.tvErrorMessage.text = error
            } else {
                binding.layoutError.visibility = View.GONE
            }
        }

        // Login success → navigate ke Dashboard
        viewModel.loginSuccess.observe(this) { success ->
            if (success) {
                navigateToDashboard()
            }
        }
    }

    private fun navigateToDashboard() {
        startActivity(Intent(this, DashboardActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
        })
        finish()
    }
}
