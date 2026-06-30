package com.example.waste_management.ui.landing

import android.content.Intent
import android.os.Bundle
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import androidx.lifecycle.lifecycleScope
import com.example.waste_management.R
import com.example.waste_management.data.local.TokenManager
import com.example.waste_management.data.remote.ApiClient
import com.example.waste_management.databinding.ActivityLandingBinding
import com.example.waste_management.ui.auth.LoginActivity
import com.example.waste_management.ui.dashboard.DashboardActivity
import kotlinx.coroutines.launch
import java.text.NumberFormat
import java.util.Calendar
import java.util.Locale

// ============================================================
// LandingActivity — Landing page / splash screen
// Sesuai dengan page.tsx + HeroSection + Navbar di website
// Auto-redirect ke Dashboard jika sudah login
// ============================================================

class LandingActivity : AppCompatActivity() {

    private lateinit var binding: ActivityLandingBinding
    private lateinit var tokenManager: TokenManager

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        tokenManager = TokenManager(this)

        // Cek apakah sudah login — langsung ke Dashboard
        if (tokenManager.isLoggedIn()) {
            navigateToDashboard()
            return
        }

        binding = ActivityLandingBinding.inflate(layoutInflater)
        setContentView(binding.root)

        // Edge-to-edge insets
        ViewCompat.setOnApplyWindowInsetsListener(binding.root) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, 0, systemBars.right, systemBars.bottom)
            insets
        }

        setupUI()
        fetchStats()
    }

    private fun setupUI() {
        // Copyright dengan tahun dinamis
        val year = Calendar.getInstance().get(Calendar.YEAR)
        binding.tvCopyright.text = getString(R.string.landing_copyright, year)

        // CTA Button Ke Login
        binding.btnMasuk.setOnClickListener {
            startActivity(Intent(this, LoginActivity::class.java))
        }
    }

    private fun fetchStats() {
        val service = ApiClient.getService(tokenManager)
        val numberFormat = NumberFormat.getNumberInstance(Locale("id", "ID"))

        lifecycleScope.launch {
            try {
                val response = service.getSummary()
                if (response.isSuccessful && response.body() != null) {
                    val apiResponse = response.body()!!
                    if (apiResponse.success && apiResponse.data != null) {
                        val stats = apiResponse.data
                        binding.tvStatNasabahVal.text = "${stats.totalNasabah}+"
                        binding.tvStatSampahVal.text = "${numberFormat.format(stats.totalSampahKg)} Kg+"
                        binding.tvStatTerolahVal.text = "${stats.totalSampahTerolah}+"
                        binding.tvStatHematVal.text = "Rp ${numberFormat.format(stats.totalHematRupiah)}"
                    }
                }
            } catch (e: Exception) {
                e.printStackTrace()
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
