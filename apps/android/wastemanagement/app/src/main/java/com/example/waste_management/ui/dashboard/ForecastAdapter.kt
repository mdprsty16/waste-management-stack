package com.example.waste_management.ui.dashboard

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.core.content.ContextCompat
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.example.waste_management.R
import com.example.waste_management.data.model.ForecastStep
import com.example.waste_management.databinding.ItemForecastStepBinding
import java.util.Locale

class ForecastAdapter(private val maxVolume: Double) :
    ListAdapter<ForecastStep, ForecastAdapter.ViewHolder>(DiffCallback()) {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val binding = ItemForecastStepBinding.inflate(
            LayoutInflater.from(parent.context), parent, false
        )
        return ViewHolder(binding)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        holder.bind(getItem(position))
    }

    inner class ViewHolder(private val binding: ItemForecastStepBinding) :
        RecyclerView.ViewHolder(binding.root) {

        fun bind(step: ForecastStep) {
            binding.tvStepDay.text = step.hari
            // Ambil format MM-DD dari tanggal ISO
            val dateStr = if (step.tanggal.length >= 10) {
                step.tanggal.substring(5, 10)
            } else {
                step.tanggal
            }
            binding.tvStepDate.text = dateStr

            binding.tvStepVolume.text = String.format(Locale.US, "%.2f m³", step.akumulasiTotalM3)
            binding.tvStepDelta.text = String.format(Locale.US, "+%.2f m³", step.prediksiMasukM3)

            // Jika akumulasi >= kapasitas_maksimal → background kemerahan
            val isPenuh = step.akumulasiTotalM3 >= maxVolume
            if (isPenuh) {
                binding.layoutStepRoot.setBackgroundResource(R.drawable.bg_error_alert)
                binding.tvStepDay.setTextColor(ContextCompat.getColor(binding.root.context, R.color.red_700))
                binding.tvStepVolume.setTextColor(ContextCompat.getColor(binding.root.context, R.color.red_600))
                binding.tvStepDelta.setTextColor(ContextCompat.getColor(binding.root.context, R.color.red_500))
            } else {
                binding.layoutStepRoot.setBackgroundResource(R.drawable.bg_feature_item)
                binding.tvStepDay.setTextColor(ContextCompat.getColor(binding.root.context, R.color.blue_800))
                binding.tvStepVolume.setTextColor(ContextCompat.getColor(binding.root.context, R.color.gray_900))
                binding.tvStepDelta.setTextColor(ContextCompat.getColor(binding.root.context, R.color.emerald_600))
            }
        }
    }

    class DiffCallback : DiffUtil.ItemCallback<ForecastStep>() {
        override fun areItemsTheSame(oldItem: ForecastStep, newItem: ForecastStep): Boolean {
            return oldItem.hari == newItem.hari && oldItem.tanggal == newItem.tanggal
        }

        override fun areContentsTheSame(oldItem: ForecastStep, newItem: ForecastStep): Boolean {
            return oldItem == newItem
        }
    }
}
