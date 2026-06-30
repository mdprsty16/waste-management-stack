package com.example.waste_management.ui.dashboard

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.example.waste_management.R
import com.example.waste_management.data.model.TransaksiBrief
import com.example.waste_management.databinding.ItemTransactionBinding
import java.text.NumberFormat
import java.util.Locale

// ============================================================
// TransactionAdapter — RecyclerView adapter untuk riwayat transaksi
// Sesuai dengan tabel recentTransactions di dashboard website
// Menggunakan TransaksiBrief dari aggregator API
// ============================================================

class TransactionAdapter :
    ListAdapter<TransaksiBrief, TransactionAdapter.ViewHolder>(DiffCallback()) {

    private val numberFormat = NumberFormat.getNumberInstance(Locale("id", "ID"))

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val binding = ItemTransactionBinding.inflate(
            LayoutInflater.from(parent.context), parent, false
        )
        return ViewHolder(binding)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        holder.bind(getItem(position))
    }

    inner class ViewHolder(private val binding: ItemTransactionBinding) :
        RecyclerView.ViewHolder(binding.root) {

        fun bind(transaksi: TransaksiBrief) {
            // Nama nasabah
            binding.tvTransName.text = transaksi.nasabah

            // Berat (sama dengan `${trx.berat_kg.toFixed(2)} Kg`)
            binding.tvTransWeight.text = binding.root.context.getString(
                R.string.format_kg,
                String.format(Locale.US, "%.2f", transaksi.beratKg)
            )

            // Harga (sama dengan `Rp ${trx.total_harga.toLocaleString("id-ID")}`)
            binding.tvTransAmount.text = binding.root.context.getString(
                R.string.format_rupiah,
                numberFormat.format(transaksi.totalHarga.toLong())
            )

            // Status — hardcoded "Selesai" (sama dengan website)
            binding.tvTransStatus.text = binding.root.context.getString(
                R.string.transaction_status_done
            )
        }
    }

    class DiffCallback : DiffUtil.ItemCallback<TransaksiBrief>() {
        override fun areItemsTheSame(oldItem: TransaksiBrief, newItem: TransaksiBrief): Boolean {
            return oldItem.id == newItem.id
        }

        override fun areContentsTheSame(oldItem: TransaksiBrief, newItem: TransaksiBrief): Boolean {
            return oldItem == newItem
        }
    }
}
