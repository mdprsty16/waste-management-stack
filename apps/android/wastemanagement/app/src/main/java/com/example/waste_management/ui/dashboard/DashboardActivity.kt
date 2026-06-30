package com.example.waste_management.ui.dashboard

import android.content.Intent
import android.content.res.ColorStateList
import android.graphics.drawable.GradientDrawable
import android.os.Bundle
import android.view.Gravity
import android.view.View
import android.view.ViewGroup
import android.widget.FrameLayout
import android.widget.ImageView
import android.widget.LinearLayout
import android.widget.TextView
import android.widget.Toast
import androidx.activity.enableEdgeToEdge
import androidx.activity.viewModels
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import androidx.core.view.GravityCompat
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import androidx.recyclerview.widget.LinearLayoutManager
import com.example.waste_management.R
import com.example.waste_management.data.model.DashboardResponse
import com.example.waste_management.data.model.KategoriStatItem
import com.example.waste_management.databinding.ActivityDashboardBinding
import com.example.waste_management.ui.landing.LandingActivity
import java.text.NumberFormat
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

// ============================================================
// DashboardActivity — Dashboard overview screen
// Sesuai dengan app/dashboard/page.tsx di website
// Menampilkan: gradient header, kapasitas gudang, 4 stat cards,
// ML Alert Banner, ML Weekly Trend Chart, Kategori Bar Chart,
// Akurasi Prediksi Footer, Recent Transactions, dan Sidebar Drawer.
// ============================================================

class DashboardActivity : AppCompatActivity() {

    private lateinit var binding: ActivityDashboardBinding
    private val viewModel: DashboardViewModel by viewModels()
    private lateinit var transactionAdapter: TransactionAdapter
    private val numberFormat = NumberFormat.getNumberInstance(Locale("id", "ID"))

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        binding = ActivityDashboardBinding.inflate(layoutInflater)
        setContentView(binding.root)

        // Edge-to-edge insets
        ViewCompat.setOnApplyWindowInsetsListener(binding.swipeRefresh) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }

        setupUI()
        setupStatCards()
        setupRecyclerView()
        observeViewModel()
    }

    private fun setupUI() {
        // Login time — sama dengan website: new Date().toLocaleTimeString("id-ID")
        val loginTime = SimpleDateFormat("HH:mm", Locale("id", "ID")).format(Date())
        binding.tvLoginTime.text = getString(R.string.dashboard_login_time, loginTime)

        // Open menu drawer
        binding.btnOpenMenu.setOnClickListener {
            binding.drawerLayout.openDrawer(GravityCompat.START)
        }

        // Setup custom sidebar menu click listeners
        binding.menuOverview.setOnClickListener {
            binding.drawerLayout.closeDrawer(GravityCompat.START)
        }

        binding.menuTransaksi.setOnClickListener {
            binding.drawerLayout.closeDrawer(GravityCompat.START)
            Toast.makeText(this, "Fitur Transaksi hanya tersedia di platform Web", Toast.LENGTH_SHORT).show()
        }

        binding.menuNasabah.setOnClickListener {
            binding.drawerLayout.closeDrawer(GravityCompat.START)
            Toast.makeText(this, "Fitur Data Warga Nasabah hanya tersedia di platform Web", Toast.LENGTH_SHORT).show()
        }

        binding.menuJenisSampah.setOnClickListener {
            binding.drawerLayout.closeDrawer(GravityCompat.START)
            Toast.makeText(this, "Fitur Jenis Sampah hanya tersedia di platform Web", Toast.LENGTH_SHORT).show()
        }

        binding.menuKategori.setOnClickListener {
            binding.drawerLayout.closeDrawer(GravityCompat.START)
            Toast.makeText(this, "Fitur Kategori Sampah hanya tersedia di platform Web", Toast.LENGTH_SHORT).show()
        }

        binding.menuLogout.setOnClickListener {
            binding.drawerLayout.closeDrawer(GravityCompat.START)
            viewModel.logout()
        }

        // Dismiss alert button
        binding.btnDismissAlert.setOnClickListener {
            binding.layoutAlertBanner.visibility = View.GONE
        }

        // Catat Pengangkutan action button
        binding.btnCatatPengangkutan.setOnClickListener {
            Toast.makeText(this, "Aksi Catat Pengangkutan diaktifkan", Toast.LENGTH_SHORT).show()
        }

        // Settings kapasitas button
        binding.btnKapasitasSettings.setOnClickListener {
            Toast.makeText(this, "Pengaturan Kapasitas Gudang", Toast.LENGTH_SHORT).show()
        }

        // Swipe refresh
        binding.swipeRefresh.setColorSchemeResources(R.color.green_600)
        binding.swipeRefresh.setOnRefreshListener {
            viewModel.fetchDashboardData()
        }
    }

    /**
     * Setup 4 stat cards — sesuai dengan 4 StatCard di website
     * Warna icon/bg dari dashboard website (blue, green, amber, purple)
     */
    private fun setupStatCards() {
        // Nasabah — Blue
        configureStatCard(
            binding.statNasabah.root,
            R.string.stat_nasabah,
            "0",
            R.color.blue_100,
            R.color.blue_700,
            android.R.drawable.ic_menu_myplaces
        )

        // Sampah — Green
        configureStatCard(
            binding.statSampah.root,
            R.string.stat_sampah,
            "0 Kg",
            R.color.green_100,
            R.color.green_700,
            android.R.drawable.ic_menu_rotate
        )

        // Saldo — Amber
        configureStatCard(
            binding.statSaldo.root,
            R.string.stat_saldo,
            "Rp 0",
            R.color.amber_100,
            R.color.amber_700,
            android.R.drawable.ic_menu_recent_history
        )

        // Transaksi — Purple
        configureStatCard(
            binding.statTransaksi.root,
            R.string.stat_transaksi,
            "0",
            R.color.purple_100,
            R.color.purple_700,
            android.R.drawable.ic_menu_agenda
        )
    }

    private fun configureStatCard(
        view: View,
        labelRes: Int,
        defaultValue: String,
        bgColorRes: Int,
        iconColorRes: Int,
        iconRes: Int
    ) {
        val iconContainer = view.findViewById<FrameLayout>(R.id.iconContainer)
        val ivIcon = view.findViewById<ImageView>(R.id.ivStatIcon)
        val tvLabel = view.findViewById<TextView>(R.id.tvStatLabel)
        val tvValue = view.findViewById<TextView>(R.id.tvStatValue)

        // Set icon background color — rounded
        val bgDrawable = GradientDrawable()
        bgDrawable.shape = GradientDrawable.RECTANGLE
        bgDrawable.cornerRadius = 16f * resources.displayMetrics.density
        bgDrawable.setColor(ContextCompat.getColor(this, bgColorRes))
        iconContainer.background = bgDrawable

        // Set icon
        ivIcon.setImageResource(iconRes)
        ivIcon.setColorFilter(ContextCompat.getColor(this, iconColorRes))

        tvLabel.text = getString(labelRes)
        tvValue.text = defaultValue
    }

    private fun setupRecyclerView() {
        // Transactions adapter
        transactionAdapter = TransactionAdapter()
        binding.rvTransactions.apply {
            layoutManager = LinearLayoutManager(this@DashboardActivity)
            adapter = transactionAdapter
            isNestedScrollingEnabled = false
        }

        // Forecast steps layout manager
        binding.rvForecastSteps.layoutManager = LinearLayoutManager(
            this, LinearLayoutManager.HORIZONTAL, false
        )
    }

    private fun observeViewModel() {
        // Loading
        viewModel.isLoading.observe(this) { isLoading ->
            binding.layoutLoading.visibility = if (isLoading) View.VISIBLE else View.GONE
            binding.layoutContent.visibility = if (isLoading) View.GONE else View.VISIBLE
            binding.swipeRefresh.isRefreshing = false
        }

        // Main Aggregated Data
        viewModel.dashboardData.observe(this) { response ->
            if (response != null) {
                renderDashboard(response)
            }
        }

        // Logout
        viewModel.logoutSuccess.observe(this) { success ->
            if (success) {
                navigateToLanding()
            }
        }
    }

    /**
     * Bind all data views from aggregator response
     */
    private fun renderDashboard(response: DashboardResponse) {
        // 1. Stat cards
        val r = response.ringkasan
        binding.statNasabah.root.findViewById<TextView>(R.id.tvStatValue).text =
            numberFormat.format(r.totalNasabah)
        binding.statSampah.root.findViewById<TextView>(R.id.tvStatValue).text =
            getString(R.string.format_kg, String.format(Locale.US, "%.2f", r.totalSampahKg))
        binding.statSaldo.root.findViewById<TextView>(R.id.tvStatValue).text =
            getString(R.string.format_rupiah, numberFormat.format(r.totalSaldoRupiah.toLong()))
        binding.statTransaksi.root.findViewById<TextView>(R.id.tvStatValue).text =
            numberFormat.format(r.totalTransaksi)

        // 2. Kapasitas Gudang
        val k = response.kapasitas
        binding.tvKapasitasPercentage.text = String.format(Locale.US, "%.2f%%", k.persentase)
        binding.tvKapasitasVolumeRatio.text = String.format(
            Locale.US, "%.2f / %.2f m³", k.currentVolumeM3, k.maxVolumeM3
        )
        binding.progressKapasitasVolume.progress = k.persentase.toInt()

        // Set progress bar color based on threshold
        val isOverThreshold = k.persentase >= k.thresholdPersen
        val barColor = if (isOverThreshold) R.color.red_600 else R.color.green_600
        binding.progressKapasitasVolume.progressTintList = ColorStateList.valueOf(
            ContextCompat.getColor(this, barColor)
        )

        // Render AI Recommendation Box
        val recommendation = k.recommendation ?: ""
        val (recBg, recTitleColor, recTxtColor, recIcon) = when {
            recommendation.contains("KRITIS", ignoreCase = true) -> {
                Quadruple(R.drawable.bg_error_alert, R.color.red_800, R.color.red_600, android.R.drawable.ic_dialog_alert)
            }
            recommendation.contains("PERINGATAN", ignoreCase = true) -> {
                Quadruple(R.drawable.bg_alert_ml, R.color.amber_800, R.color.amber_700, android.R.drawable.ic_dialog_alert)
            }
            else -> {
                Quadruple(R.drawable.bg_info_blue, R.color.blue_900, R.color.blue_700, android.R.drawable.ic_menu_info_details)
            }
        }

        binding.layoutKapasitasAiRecommendation.setBackgroundResource(recBg)
        binding.tvKapasitasAiTitle.setTextColor(ContextCompat.getColor(this, recTitleColor))
        binding.tvKapasitasAiText.setTextColor(ContextCompat.getColor(this, recTxtColor))
        binding.ivKapasitasAiIcon.setImageResource(recIcon)
        binding.ivKapasitasAiIcon.setColorFilter(ContextCompat.getColor(this, recTxtColor))

        // Set recommendation text fallback
        binding.tvKapasitasAiText.text = if (recommendation.isNotEmpty()) {
            recommendation
        } else if (k.estimatedDaysRemaining is Number) {
            "Diperkirakan penuh dalam ${k.estimatedDaysRemaining} hari"
        } else {
            k.estimatedDaysRemaining?.toString() ?: "Memuat prediksi AI..."
        }

        // 3. Forecast Steps
        if (k.forecastSimulationSteps != null && k.forecastSimulationSteps.isNotEmpty()) {
            binding.layoutForecastSection.visibility = View.VISIBLE
            val forecastAdapter = ForecastAdapter(k.maxVolumeM3)
            binding.rvForecastSteps.adapter = forecastAdapter
            forecastAdapter.submitList(k.forecastSimulationSteps)
        } else {
            binding.layoutForecastSection.visibility = View.GONE
        }

        // 4. ML Alert Banner
        if (response.alertSistem.isAlert) {
            binding.layoutAlertBanner.visibility = View.VISIBLE
            binding.tvAlertMessage.text = response.alertSistem.pesan
        } else {
            binding.layoutAlertBanner.visibility = View.GONE
        }

        // 5. Trend Chart Bars
        renderTrendChart(response.grafikMingguan)

        // 6. Kategori Bar Chart
        renderKategoriStats(response.grafikKategori)

        // 7. Recent Transactions
        if (response.transaksiTerbaru.isEmpty()) {
            binding.layoutEmpty.visibility = View.VISIBLE
            binding.rvTransactions.visibility = View.GONE
        } else {
            binding.layoutEmpty.visibility = View.GONE
            binding.rvTransactions.visibility = View.VISIBLE
            transactionAdapter.submitList(response.transaksiTerbaru)
        }

        // 8. ML Accuracy Footer
        renderAccuracyFooter(response.akurasi)

        // 9. Force scroll to top to prevent auto-scrolling due to focused child views
        binding.nestedScrollView.post {
            binding.nestedScrollView.scrollTo(0, 0)
        }
    }

    private fun renderTrendChart(grafikMingguan: com.example.waste_management.data.model.GrafikMingguan) {
        binding.layoutTrendBars.removeAllViews()

        val allPoints = mutableListOf<Double>()
        grafikMingguan.aktual.forEach { allPoints.add(it.totalKg) }
        allPoints.add(grafikMingguan.prediksiMingguDepan.totalKg)

        val maxVal = allPoints.maxOrNull() ?: 1.0
        val maxValFormatted = if (maxVal > 0) maxVal else 1.0

        val density = resources.displayMetrics.density

        // Render actual points
        grafikMingguan.aktual.forEach { point ->
            val barView = createBarView(
                label = point.label,
                value = String.format(Locale.US, "%.0f Kg", point.totalKg),
                heightPercent = (point.totalKg / maxValFormatted).toFloat(),
                colorRes = R.color.green_600,
                density = density
            )
            binding.layoutTrendBars.addView(barView)
        }

        // Render prediction point
        val predict = grafikMingguan.prediksiMingguDepan
        val predictBarView = createBarView(
            label = predict.label,
            value = String.format(Locale.US, "%.0f Kg", predict.totalKg),
            heightPercent = (predict.totalKg / maxValFormatted).toFloat(),
            colorRes = R.color.amber_600,
            density = density,
            isPredict = true
        )
        binding.layoutTrendBars.addView(predictBarView)

        // Info box
        binding.layoutPredictionInfo.visibility = View.VISIBLE
        binding.tvPredictionValue.text = getString(
            R.string.format_kg,
            String.format(Locale.US, "%.2f", predict.totalKg)
        )
    }

    private fun renderKategoriStats(stats: List<KategoriStatItem>) {
        binding.layoutKategoriBars.removeAllViews()

        if (stats.isEmpty()) {
            binding.tvKategoriEmpty.visibility = View.VISIBLE
            binding.layoutKategoriBars.visibility = View.GONE
            return
        }

        binding.tvKategoriEmpty.visibility = View.GONE
        binding.layoutKategoriBars.visibility = View.VISIBLE

        val maxVal = stats.maxOfOrNull { it.totalKg } ?: 1.0
        val maxValFormatted = if (maxVal > 0) maxVal else 1.0

        val density = resources.displayMetrics.density
        val chartColors = listOf(
            R.color.chart_1,
            R.color.chart_2,
            R.color.chart_3,
            R.color.chart_4,
            R.color.chart_5,
            R.color.chart_6
        )

        stats.forEachIndexed { index, item ->
            val colorRes = chartColors[index % chartColors.size]
            val barView = createBarView(
                label = item.kategori,
                value = String.format(Locale.US, "%.1f Kg", item.totalKg),
                heightPercent = (item.totalKg / maxValFormatted).toFloat(),
                colorRes = colorRes,
                density = density
            )
            binding.layoutKategoriBars.addView(barView)
        }
    }

    private fun renderAccuracyFooter(akurasi: com.example.waste_management.data.model.AkurasiPrediksi) {
        binding.layoutMlAccuracy.visibility = View.VISIBLE

        // Dot color
        val dotColor = when {
            akurasi.labelAkurasi.contains("Tinggi", ignoreCase = true) -> R.color.green_600
            akurasi.labelAkurasi.contains("Sedang", ignoreCase = true) -> R.color.amber_500
            else -> R.color.red_600
        }

        val dotDrawable = GradientDrawable().apply {
            shape = GradientDrawable.OVAL
            setColor(ContextCompat.getColor(this@DashboardActivity, dotColor))
        }
        binding.viewAccuracyDot.background = dotDrawable

        val errVal = akurasi.rataRataErrorPersen ?: 0.0
        binding.tvAccuracyText.text = String.format(
            Locale("id", "ID"),
            "Akurasi Prediksi: %s | Error %.1f%% | (%d data terakhir)",
            akurasi.labelAkurasi,
            errVal,
            akurasi.jumlahDataPrediksi
        )
    }

    private fun createBarView(
        label: String,
        value: String,
        heightPercent: Float,
        colorRes: Int,
        density: Float,
        isPredict: Boolean = false
    ): View {
        val columnLayout = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            gravity = Gravity.CENTER_HORIZONTAL or Gravity.BOTTOM
            layoutParams = LinearLayout.LayoutParams(
                0,
                ViewGroup.LayoutParams.MATCH_PARENT,
                1f
            )
        }

        // Value text label (small)
        val tvValue = TextView(this).apply {
            text = value
            textSize = 9f
            setTextColor(ContextCompat.getColor(context, if (isPredict) R.color.amber_700 else R.color.gray_600))
            setTypeface(null, android.graphics.Typeface.BOLD)
            gravity = Gravity.CENTER
            layoutParams = LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.WRAP_CONTENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
            ).apply {
                bottomMargin = (4 * density).toInt()
            }
        }

        // Colored vertical bar View
        val calculatedHeight = (80 * density * heightPercent).toInt().coerceAtLeast((6 * density).toInt())
        val bar = View(this).apply {
            val bg = GradientDrawable().apply {
                shape = GradientDrawable.RECTANGLE
                cornerRadius = 6f * density
                setColor(ContextCompat.getColor(context, colorRes))
                if (isPredict) {
                    setStroke((1 * density).toInt(), ContextCompat.getColor(context, R.color.amber_700))
                }
            }
            background = bg
            layoutParams = LinearLayout.LayoutParams(
                (24 * density).toInt(),
                calculatedHeight
            ).apply {
                bottomMargin = (6 * density).toInt()
            }
        }

        // Label text label
        val tvLabel = TextView(this).apply {
            text = label
            textSize = 10f
            setTextColor(ContextCompat.getColor(context, if (isPredict) R.color.amber_800 else R.color.gray_500))
            setTypeface(null, android.graphics.Typeface.BOLD)
            gravity = Gravity.CENTER
            maxLines = 1
            ellipsize = android.text.TextUtils.TruncateAt.END
            layoutParams = LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
            )
        }

        columnLayout.addView(tvValue)
        columnLayout.addView(bar)
        columnLayout.addView(tvLabel)

        return columnLayout
    }

    private fun navigateToLanding() {
        startActivity(Intent(this, LandingActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
        })
        finish()
    }

    // Helper data class for renderDashboard
    data class Quadruple<A, B, C, D>(val first: A, val second: B, val third: C, val fourth: D)
}
