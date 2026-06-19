import { createSwaggerSpec } from "next-swagger-doc";

export const getApiDocs = async () => {
  const spec = createSwaggerSpec({
    apiFolder: "app/api", 
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Waste Management Stack API (EcoOil Connect)",
        version: "1.0.0",
        description: "Dokumentasi API terpusat untuk platform waste management bssb. Digunakan sebagai acuan utama integrasi tim Frontend dan Mobile.",
      },
      components: {
        securitySchemes: {
          BearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
            description: "Masukkan token JWT yang didapat setelah login ke dalam input ini dengan format: Bearer <token>",
          },
        },
        schemas: {
          // --- ML SERVER SCHEMAS ---
          MLPredictionRequest: {
            type: "object",
            required: ["threshold_m3", "current_fill_m3", "raw_transactions"],
            properties: {
              threshold_m3: { type: "number", example: 50.0, description: "Kapasitas maksimal gudang dalam m3" },
              current_fill_m3: { type: "number", example: 12.5, description: "Volume saat ini di dalam gudang dalam m3" },
              raw_transactions: {
                type: "array",
                description: "Data transaksi historis minimal 14 hari",
                items: {
                  type: "object",
                  properties: {
                    tanggal: { type: "string", format: "date", example: "2026-06-01" },
                    berat_kg: { type: "number", example: 10.5 },
                    densitas_kg_m3: { type: "number", example: 25.5 },
                    volume_m3: { type: "number", example: 0.41 },
                  },
                },
              },
            },
          },
          MLPredictionResponse: {
            type: "object",
            properties: {
              status: { type: "string", example: "success" },
              current_fill_m3: { type: "number", example: 12.5 },
              threshold_m3: { type: "number", example: 50.0 },
              days_until_threshold: { type: "integer", example: 15 },
              estimated_full_date: { type: "string", format: "date", example: "2026-06-30" },
              recommendation: { type: "string", example: "AMAN: Kapasitas saat ini mencukupi untuk sekitar 15 hari operasional ke depan." },
              forecast_simulation_steps: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    hari: { type: "string", example: "T+1" },
                    tanggal: { type: "string", format: "date", example: "2026-06-16" },
                    prediksi_masuk_m3: { type: "number", example: 0.85 },
                    akumulasi_total_m3: { type: "number", example: 13.35 },
                  },
                },
              },
            },
          },
          MLWeeklyRequest: {
            type: "object",
            required: ["tren_mingguan"],
            properties: {
              tren_mingguan: {
                type: "array",
                description: "Array volume sampah per minggu (kg)",
                items: { type: "number", example: 100.5 },
              },
            },
          },
          MLWeeklyResponse: {
            type: "object",
            properties: {
              predicted_kg: { type: "number", example: 120.0 },
              is_alert: { type: "boolean", example: false },
              pesan: { type: "string", example: "Prediksi AI: Volume sampah stabil di sekitar 120 Kg." },
            },
          },
          // --- GLOBAL ERROR SCHEMA ---
          ErrorResponse: {
            type: "object",
            properties: {
              success: { type: "boolean", example: false },
              message: { type: "string", example: "Pesan kesalahan atau validasi gagal" },
            },
          },
          Pengangkutan: {
            type: "object",
            properties: {
              id_pengangkutan: { type: "string", format: "uuid", example: "g6h7i8j9-k0l1-m2n3-o4p5-q6r7s8t9u0v1" },
              tanggal: { type: "string", format: "date-time", example: "2026-06-10T08:30:00.000Z" },
              volume_m3_diangkut: { type: "number", format: "float", example: 2.5 },
              keterangan: { type: "string", example: "Pengangkutan rutin mingguan" },
              created_at: { type: "string", format: "date-time", example: "2026-06-10T08:30:00.000Z" },
            },
          },
          Pengaturan: {
            type: "object",
            properties: {
              id_pengaturan: { type: "string", format: "uuid", example: "h7i8j9k0-l1m2-n3o4-p5q6-r7s8t9u0v1w2" },
              kapasitas_maksimal_m3: { type: "number", format: "float", example: 50.0 },
              threshold_persen: { type: "number", format: "float", example: 80 },
              updated_at: { type: "string", format: "date-time", example: "2026-06-10T08:30:00.000Z" },
            },
          },
          // --- MODEL SCHEMAS (Sesuai Prisma) ---
          Admin: {
            type: "object",
            properties: {
              id_admin: { type: "string", format: "uuid", example: "a2b3c4d5-e6f7-8g9h-0i1j-k2l3m4n5o6p7" },
              username: { type: "string", example: "admin_ecooil" },
              nama_admin: { type: "string", example: "Dika Ramadani" },
              created_at: { type: "string", format: "date-time", example: "2026-06-09T10:20:30.000Z" },
            },
          },
          Nasabah: {
            type: "object",
            properties: {
              id_nasabah: { type: "string", format: "uuid", example: "b1c2d3e4-f5g6-7h8i-9j0k-l1m2n3o4p5q6" },
              kode_nasabah: { type: "string", example: "NSB-2026-0001" },
              nama: { type: "string", example: "Budi Santoso" },
              nomor_hp: { type: "string", example: "081234567890" },
              rt: { type: "string", example: "003" },
              rw: { type: "string", example: "002" },
              saldo: { type: "number", format: "float", example: 150000.0 },
              total_berat_sampah: { type: "number", format: "float", example: 45.2 },
              is_active: { type: "boolean", example: true },
              created_at: { type: "string", format: "date-time", example: "2026-06-09T10:20:30.000Z" },
            },
          },
          KategoriSampah: {
            type: "object",
            properties: {
              id_kategori: { type: "string", format: "uuid", example: "c2d3e4f5-g6h7-8i9j-0k1l-m2n3o4p5q6r7" },
              nama_kategori: { type: "string", example: "Plastik" },
              deskripsi: { type: "string", example: "Kategori untuk botol wadah plastik, gelas plastik, dan sejenisnya." },
              is_active: { type: "boolean", example: true },
              created_at: { type: "string", format: "date-time", example: "2026-06-09T10:20:30.000Z" },
            },
          },
          JenisSampah: {
            type: "object",
            properties: {
              id_jenis_sampah: { type: "string", format: "uuid", example: "d3e4f5g6-h7i8-9j0k-l1m2-n3o4p5q6r7s8" },
              id_kategori: { type: "string", format: "uuid", example: "c2d3e4f5-g6h7-8i9j-0k1l-m2n3o4p5q6r7s8" },
              nama_jenis: { type: "string", example: "Botol PET Bening" },
              densitas_kg_per_m3: { type: "number", format: "float", example: 25.5 },
              harga_per_kg: { type: "number", format: "float", example: 3500.0 },
              is_active: { type: "boolean", example: true },
              created_at: { type: "string", format: "date-time", example: "2026-06-09T10:20:30.000Z" },
            },
          },
          Transaksi: {
            type: "object",
            properties: {
              id_transaksi: { type: "string", format: "uuid", example: "e4f5g6h7-i8j9-0k1l-m2n3-o4p5q6r7s8t9" },
              id_nasabah: { type: "string", format: "uuid", example: "b1c2d3e4-f5g6-7h8i-9j0k-l1m2n3o4p5q6" },
              id_admin: { type: "string", format: "uuid", example: "a2b3c4d5-e6f7-8g9h-0i1j-k2l3m4n5o6p7" },
              tanggal: { type: "string", format: "date", example: "2026-06-09" },
              total_berat_kg: { type: "number", format: "float", example: 10.5 },
              total_volume_m3: { type: "number", format: "float", example: 0.41 },
              total_harga: { type: "number", format: "float", example: 36750.0 },
              created_at: { type: "string", format: "date-time", example: "2026-06-09T10:20:30.000Z" },
            },
          },
          DetailTransaksi: {
            type: "object",
            properties: {
              id_detail: { type: "string", format: "uuid", example: "f5g6h7i8-j90k-l1m2-n3o4-p5q6r7s8t9u0" },
              id_transaksi: { type: "string", format: "uuid", example: "e4f5g6h7-i8j9-0k1l-m2n3-o4p5q6r7s8t9" },
              id_jenis_sampah: { type: "string", format: "uuid", example: "d3e4f5g6-h7i8-9j0k-l1m2-n3o4p5q6r7s8" },
              berat_kg: { type: "number", format: "float", example: 5.0 },
              volume_m3: { type: "number", format: "float", example: 0.2 },
              subtotal_harga: { type: "number", format: "float", example: 17500.0 },
            },
          },
        },
      },
      security: [],
      paths: {
        // ==========================================
        // MODULE: AUTH
        // ==========================================
        "/api/auth/login": {
          post: {
            summary: "Autentikasi masuk akun Admin",
            tags: ["Auth"],
            requestBody: {
              required: true,
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    required: ["username", "password"],
                    properties: {
                      username: { type: "string", example: "admin_ecooil" },
                      password: { type: "string", example: "password_rahasia" },
                    },
                  },
                },
              },
            },
            responses: {
              200: {
                description: "Login berhasil, mengembalikan token akses",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        success: { type: "boolean", example: true },
                        token: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." },
                        admin: { $ref: "#/components/schemas/Admin" },
                      },
                    },
                  },
                },
              },
              401: { description: "Kredensial salah", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
            },
          },
        },
        "/api/auth/logout": {
          post: {
            summary: "Keluar dari sistem dan hapus cookie sesi",
            tags: ["Auth"],
            responses: {
              200: {
                description: "Logout berhasil",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        success: { type: "boolean", example: true },
                        message: { type: "string", example: "Berhasil keluar dari sistem" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        "/api/auth/me": {
          get: {
            summary: "Mendapatkan profil Admin yang sedang aktif",
            tags: ["Auth"],
            security: [{ BearerAuth: [] }],
            responses: {
              200: {
                description: "Data profil ditemukan",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        success: { type: "boolean", example: true },
                        admin: { $ref: "#/components/schemas/Admin" },
                      },
                    },
                  },
                },
              },
              401: { description: "Token kedaluwarsa atau tidak valid", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
            },
          },
        },

        // ==========================================
        // MODULE: KATEGORI SAMPAH
        // ==========================================
        "/api/kategori_sampah": {
          get: {
            summary: "Mendapatkan semua daftar kategori sampah",
            tags: ["Kategori Sampah"],
            parameters: [
              { name: "is_active", in: "query", required: false, schema: { type: "string", enum: ["true", "false"] }, description: "Filter berdasarkan status aktif" },
            ],
            responses: {
              200: {
                description: "Daftar kategori berhasil dimuat",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        success: { type: "boolean", example: true },
                        data: { type: "array", items: { $ref: "#/components/schemas/KategoriSampah" } },
                      },
                    },
                  },
                },
              },
            },
          },
          post: {
            summary: "Membuat kategori sampah baru",
            tags: ["Kategori Sampah"],
            security: [{ BearerAuth: [] }],
            requestBody: {
              required: true,
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    required: ["nama_kategori"],
                    properties: {
                      nama_kategori: { type: "string", example: "Logam" },
                      deskripsi: { type: "string", example: "Kategori untuk kaleng besi, alumunium, kuningan, dll." },
                    },
                  },
                },
              },
            },
            responses: {
              201: {
                description: "Kategori berhasil ditambahkan",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        success: { type: "boolean", example: true },
                        data: { $ref: "#/components/schemas/KategoriSampah" },
                      },
                    },
                  },
                },
              },
              400: { description: "Kategori sudah ada / validasi gagal", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
            },
          },
        },
        "/api/kategori_sampah/{id}": {
          get: {
            summary: "Mendapatkan detail satu kategori berdasarkan ID",
            tags: ["Kategori Sampah"],
            parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
            responses: {
              200: {
                description: "Data ditemukan",
                content: { "application/json": { schema: { type: "object", properties: { success: { type: "boolean" }, data: { $ref: "#/components/schemas/KategoriSampah" } } } } },
              },
              404: { description: "Kategori tidak ditemukan" },
            },
          },
          put: {
            summary: "Mengubah data kategori",
            tags: ["Kategori Sampah"],
            security: [{ BearerAuth: [] }],
            parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
            requestBody: {
              required: true,
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      nama_kategori: { type: "string" },
                      deskripsi: { type: "string" },
                      is_active: { type: "boolean" },
                    },
                  },
                },
              },
            },
            responses: {
              200: { description: "Berhasil diperbarui" },
              404: { description: "Kategori tidak ditemukan" },
            },
          },
          delete: {
            summary: "Menonaktifkan / Hapus kategori sampah",
            tags: ["Kategori Sampah"],
            security: [{ BearerAuth: [] }],
            parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
            responses: {
              200: { description: "Kategori berhasil dihapus" },
              400: { description: "Gagal, data kategori masih terikat dengan Jenis Sampah (Restrict)" },
            },
          },
        },

        // ==========================================
        // MODULE: JENIS SAMPAH
        // ==========================================
        "/api/jenis_sampah": {
          get: {
            summary: "Mendapatkan seluruh varian jenis sampah",
            tags: ["Jenis Sampah"],
            parameters: [
              { name: "is_active", in: "query", required: false, schema: { type: "string", enum: ["true", "false"] }, description: "Filter berdasarkan status aktif" },
              { name: "id_kategori", in: "query", required: false, schema: { type: "string", format: "uuid" }, description: "Filter berdasarkan ID kategori" },
            ],
            responses: {
              200: {
                description: "Sukses mengambil list jenis sampah",
                content: { "application/json": { schema: { type: "object", properties: { success: { type: "boolean" }, data: { type: "array", items: { $ref: "#/components/schemas/JenisSampah" } } } } } },
              },
            },
          },
          post: {
            summary: "Menambahkan sub-jenis sampah baru",
            tags: ["Jenis Sampah"],
            security: [{ BearerAuth: [] }],
            requestBody: {
              required: true,
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    required: ["id_kategori", "nama_jenis", "densitas_kg_per_m3", "harga_per_kg"],
                    properties: {
                      id_kategori: { type: "string", format: "uuid", example: "uuid-kategori-logam" },
                      nama_jenis: { type: "string", example: "Kaleng Alumunium Soda" },
                      densitas_kg_per_m3: { type: "number", example: 16.0 },
                      harga_per_kg: { type: "number", example: 8500 },
                    },
                  },
                },
              },
            },
            responses: {
              201: { description: "Jenis sampah berhasil dibuat" },
            },
          },
        },
        "/api/jenis_sampah/{id}": {
          get: {
            summary: "Ambil satu jenis sampah berdasarkan ID beserta info relasi kategori",
            tags: ["Jenis Sampah"],
            parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
            responses: { 200: { description: "Data ditemukan" } },
          },
          put: {
            summary: "Update parameter (harga/densitas/status) jenis sampah",
            tags: ["Jenis Sampah"],
            security: [{ BearerAuth: [] }],
            parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
            requestBody: {
              required: true,
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      nama_jenis: { type: "string" },
                      densitas_kg_per_m3: { type: "number" },
                      harga_per_kg: { type: "number" },
                      is_active: { type: "boolean" },
                    },
                  },
                },
              },
            },
            responses: { 200: { description: "Berhasil di-update" } },
          },
          delete: {
            summary: "Hapus jenis sampah",
            tags: ["Jenis Sampah"],
            security: [{ BearerAuth: [] }],
            parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
            responses: { 200: { description: "Berhasil dihapus" } },
          },
        },

        // ==========================================
        // MODULE: NASABAH
        // ==========================================
        "/api/nasabah": {
          get: {
            summary: "Mendapatkan data nasabah (Mendukung pencarian)",
            tags: ["Nasabah"],
            parameters: [
              { name: "is_active", in: "query", required: false, schema: { type: "string", enum: ["true", "false"] }, description: "Filter berdasarkan status aktif" },
              { name: "search", in: "query", required: false, schema: { type: "string" }, description: "Pencarian berdasarkan nama atau kode nasabah" },
            ],
            responses: {
              200: {
                description: "Data list nasabah berhasil dimuat",
                content: { "application/json": { schema: { type: "object", properties: { success: { type: "boolean" }, data: { type: "array", items: { $ref: "#/components/schemas/Nasabah" } } } } } },
              },
            },
          },
          post: {
            summary: "Mendaftarkan nasabah tabungan baru",
            tags: ["Nasabah"],
            security: [{ BearerAuth: [] }],
            requestBody: {
              required: true,
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    required: ["nama"],
                    properties: {
                      kode_nasabah: { type: "string", example: "NSB-2026-009" },
                      nama: { type: "string", example: "Ahmad Subarjo" },
                      nomor_hp: { type: "string", example: "085711223344" },
                      rt: { type: "string", example: "010" },
                      rw: { type: "string", example: "005" },
                    },
                  },
                },
              },
            },
            responses: {
              201: { description: "Nasabah berhasil dibuat" },
            },
          },
        },
        "/api/nasabah/{id}": {
          get: {
            summary: "Ambil informasi buku tabungan, akumulasi sampah, & saldo nasabah",
            tags: ["Nasabah"],
            parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
            responses: { 200: { description: "Data buku rekening nasabah ditemukan" } },
          },
          put: {
            summary: "Ubah data biodata/status aktif nasabah",
            tags: ["Nasabah"],
            security: [{ BearerAuth: [] }],
            parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
            requestBody: {
              required: true,
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      nama: { type: "string" },
                      nomor_hp: { type: "string" },
                      rt: { type: "string" },
                      rw: { type: "string" },
                      is_active: { type: "boolean" },
                    },
                  },
                },
              },
            },
            responses: { 200: { description: "Biodata ter-update" } },
          },
          delete: {
            summary: "Hapus permanen akun nasabah",
            tags: ["Nasabah"],
            security: [{ BearerAuth: [] }],
            parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
            responses: { 200: { description: "Akun nasabah berhasil dihapus (Cascade transaksi terkait)" } },
          },
        },

        // ==========================================
        // MODULE: DASHBOARD
        // ==========================================
        "/api/dashboard": {
          get: {
            summary: "Menggabungkan semua data dashboard dalam satu panggilan (aggregator)",
            tags: ["Dashboard"],
            security: [{ BearerAuth: [] }],
            responses: {
              200: {
                description: "Data dashboard lengkap dengan prediksi ML",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        success: { type: "boolean", example: true },
                        data: {
                          type: "object",
                          properties: {
                            ringkasan: {
                              type: "object",
                              properties: {
                                total_nasabah: { type: "integer", example: 25 },
                                total_sampah_kg: { type: "integer", example: 450 },
                                total_saldo_rupiah: { type: "integer", example: 1500000 },
                                total_transaksi: { type: "integer", example: 120 },
                              },
                            },
                            transaksi_terbaru: {
                              type: "array",
                              items: {
                                type: "object",
                                properties: {
                                  id: { type: "string" },
                                  nasabah: { type: "string" },
                                  berat_kg: { type: "number" },
                                  total_harga: { type: "number" },
                                  kategori: { type: "string" },
                                  tanggal: { type: "string", format: "date-time" },
                                },
                              },
                            },
                            kapasitas: {
                              type: "object",
                              properties: {
                                current_volume_m3: { type: "number", example: 12.5 },
                                max_volume_m3: { type: "number", example: 50.0 },
                                persentase: { type: "number", example: 25.0 },
                                threshold_persen: { type: "number", example: 80 },
                                estimated_days_remaining: { type: "string", example: "15" },
                                recommendation: { type: "string", example: "Kapasitas masih aman. Tidak perlu pengangkutan." },
                                forecast_simulation_steps: {
                                  type: "array",
                                  items: {
                                    type: "object",
                                    properties: {
                                      hari: { type: "string" },
                                      tanggal: { type: "string" },
                                      akumulasi_total_m3: { type: "number" },
                                      prediksi_masuk_m3: { type: "number" },
                                    },
                                  },
                                },
                              },
                            },
                            grafik_kategori: {
                              type: "array",
                              items: {
                                type: "object",
                                properties: {
                                  kategori: { type: "string" },
                                  total_kg: { type: "number" },
                                },
                              },
                            },
                            grafik_kategori_prediksi: {
                              type: "array",
                              items: {
                                type: "object",
                                properties: {
                                  kategori: { type: "string" },
                                  prediksi_kg: { type: "number" },
                                },
                              },
                            },
                            grafik_mingguan: {
                              type: "object",
                              properties: {
                                aktual: {
                                  type: "array",
                                  items: {
                                    type: "object",
                                    properties: {
                                      label: { type: "string" },
                                      total_kg: { type: "number" },
                                    },
                                  },
                                },
                                prediksi: {
                                  type: "object",
                                  properties: {
                                    label: { type: "string" },
                                    total_kg: { type: "number" },
                                  },
                                },
                              },
                            },
                            alert_sistem: {
                              type: "object",
                              properties: {
                                is_alert: { type: "boolean" },
                                pesan: { type: "string" },
                              },
                            },
                            akurasi: {
                              type: "object",
                              properties: {
                                rata_rata_error_persen: { type: "number", nullable: true },
                                jumlah_data_prediksi: { type: "integer" },
                                label_akurasi: { type: "string" },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
              401: { description: "Token tidak valid atau kedaluwarsa" },
            },
          },
        },
        "/api/dashboard/kapasitas": {
          get: {
            summary: "Mendapatkan informasi kapasitas gudang dan prediksi ML",
            tags: ["Dashboard"],
            security: [{ BearerAuth: [] }],
            responses: {
              200: {
                description: "Data kapasitas gudang dengan prediksi waktu penuh",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        success: { type: "boolean" },
                        data: {
                          type: "object",
                          properties: {
                            current_volume_m3: { type: "number", example: 12.5 },
                            max_volume_m3: { type: "number", example: 50.0 },
                            threshold_persen: { type: "number", example: 80 },
                            percentage: { type: "number", example: 25.0 },
                            estimated_days_remaining: { type: "string", example: "15" },
                            recommendation: { type: "string" },
                            forecast_simulation_steps: {
                              type: "array",
                              items: {
                                type: "object",
                                properties: {
                                  hari: { type: "string" },
                                  tanggal: { type: "string" },
                                  akumulasi_total_m3: { type: "number" },
                                  prediksi_masuk_m3: { type: "number" },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        "/api/dashboard/kategori-stats": {
          get: {
            summary: "Mendapatkan statistik distribusi sampah per kategori",
            tags: ["Dashboard"],
            responses: {
              200: {
                description: "Data statistik per kategori berhasil dimuat",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        success: { type: "boolean" },
                        data: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              kategori: { type: "string", example: "Organik" },
                              total_kg: { type: "number", example: 150.5 },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        "/api/dashboard/summary": {
          get: {
            summary: "Mendapatkan ringkasan dashboard (total nasabah, sampah, transaksi, saldo)",
            tags: ["Dashboard"],
            responses: {
              200: {
                description: "Ringkasan berhasil dimuat",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        success: { type: "boolean" },
                        data: {
                          type: "object",
                          properties: {
                            totalNasabah: { type: "integer", example: 25 },
                            totalSampahKg: { type: "integer", example: 450 },
                            totalSampahTerolah: { type: "integer", example: 120 },
                            totalHematRupiah: { type: "integer", example: 1500000 },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },

        // ==========================================
        // MODULE: TREN HARIAN & PREDIKSI
        // ==========================================
        "/api/daily": {
          get: {
            summary: "Mendapatkan tren mingguan dan prediksi ML volume sampah",
            tags: ["Prediksi"],
            responses: {
              200: {
                description: "Data tren mingguan dan prediksi berhasil dimuat",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        success: { type: "boolean" },
                        data: {
                          type: "object",
                          properties: {
                            grafik_mingguan: {
                              type: "object",
                              properties: {
                                aktual: {
                                  type: "array",
                                  items: {
                                    type: "object",
                                    properties: {
                                      label: { type: "string", example: "Minggu 1" },
                                      total_kg: { type: "number", example: 100.5 },
                                    },
                                  },
                                },
                                prediksi: {
                                  type: "object",
                                  properties: {
                                    label: { type: "string", example: "Minggu 3 (Prediksi ML)" },
                                    total_kg: { type: "number", example: 120.0 },
                                  },
                                },
                              },
                            },
                            alert_sistem: {
                              type: "object",
                              properties: {
                                is_alert: { type: "boolean", example: false },
                                pesan: { type: "string", example: "Prediksi volume sampah minggu depan: 120 Kg. Kapasitas masih aman." },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },

        // ==========================================
        // MODULE: DATASET
        // ==========================================
        "/api/dataset": {
          get: {
            summary: "Mengunduh dataset untuk modelling ML (JSON atau CSV)",
            tags: ["Dataset"],
            security: [{ BearerAuth: [] }],
            parameters: [
              { name: "format", in: "query", required: false, schema: { type: "string", enum: ["json", "csv"] }, description: "Format output: json (default) atau csv" },
            ],
            responses: {
              200: {
                description: "Dataset berhasil diekspor. Format JSON mengembalikan object, format CSV mengembalikan file download.",
              },
            },
          },
        },

        // ==========================================
        // MODULE: ML RETRAINING
        // ==========================================
        "/api/ml/retrain": {
          post: {
            summary: "Menjalankan pipeline retraining model ML",
            tags: ["Machine Learning"],
            security: [{ BearerAuth: [] }],
            responses: {
              200: {
                description: "Retraining berhasil",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        success: { type: "boolean", example: true },
                        data: {
                          type: "object",
                          properties: {
                            steps: { type: "array", items: { type: "string" } },
                            metrics: {
                              type: "object",
                              properties: {
                                mae: { type: "number", nullable: true },
                                rmse: { type: "number", nullable: true },
                                mape: { type: "number", nullable: true },
                                r2: { type: "number", nullable: true },
                              },
                            },
                            total_samples: { type: "integer" },
                          },
                        },
                      },
                    },
                  },
                },
              },
              400: { description: "Data tidak cukup (minimal 14 transaksi)" },
            },
          },
        },

        // ==========================================
        // MODULE: ML SERVER (FastAPI — port 8000)
        // Note: Endpoint di bawah tersedia di server ML Python,
        // bukan di Next.js. Akses via http://localhost:8000
        // ==========================================
        "/ml-server/": {
          get: {
            summary: "Health check server ML FastAPI",
            tags: ["ML Server"],
            description: "Endpoint pengecekan apakah server ML FastAPI aktif atau tidak.",
            externalDocs: {
              description: "Server ML URL",
              url: "http://localhost:8000",
            },
            responses: {
              200: {
                description: "Server ML aktif",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        status: { type: "string", example: "ok" },
                        message: { type: "string", example: "ML FastAPI is running!" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        "/ml-server/api/v1/predict/threshold-dss": {
          post: {
            summary: "Prediksi batas kapasitas gudang (Recursive Forecasting)",
            tags: ["ML Server"],
            description: "Memprediksi berapa hari lagi gudang akan mencapai kapasitas maksimal menggunakan algoritma Random Forest recursive forecasting.",
            externalDocs: {
              description: "Server ML URL",
              url: "http://localhost:8000",
            },
            requestBody: {
              required: true,
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/MLPredictionRequest" },
                },
              },
            },
            responses: {
              200: {
                description: "Hasil prediksi threshold dan rekomendasi",
                content: {
                  "application/json": {
                    schema: { $ref: "#/components/schemas/MLPredictionResponse" },
                  },
                },
              },
              500: { description: "Error saat processing data atau model tidak ditemukan" },
            },
          },
        },
        "/ml-server/api/v1/predict/weekly": {
          post: {
            summary: "Prediksi tren mingguan volume sampah (Linear Regression)",
            tags: ["ML Server"],
            description: "Memprediksi volume sampah minggu depan berdasarkan tren minggu-minggu sebelumnya menggunakan Linear Regression.",
            externalDocs: {
              description: "Server ML URL",
              url: "http://localhost:8000",
            },
            requestBody: {
              required: true,
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/MLWeeklyRequest" },
                },
              },
            },
            responses: {
              200: {
                description: "Hasil prediksi mingguan",
                content: {
                  "application/json": {
                    schema: { $ref: "#/components/schemas/MLWeeklyResponse" },
                  },
                },
              },
              500: { description: "Error saat processing data" },
            },
          },
        },
        "/ml-server/api/v1/admin/reload-model": {
          post: {
            summary: "Reload model ML tanpa restart server",
            tags: ["ML Server"],
            description: "Me-reload model Random Forest dari disk. Dipanggil oleh Next.js setelah pipeline retraining selesai.",
            externalDocs: {
              description: "Server ML URL",
              url: "http://localhost:8000",
            },
            responses: {
              200: {
                description: "Model berhasil di-reload",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        status: { type: "string", example: "ok" },
                        message: { type: "string", example: "Model berhasil di-reload" },
                        path: { type: "string", example: "/app/models/rf_waste_model.pkl" },
                      },
                    },
                  },
                },
              },
              500: { description: "Gagal me-load model dari disk" },
            },
          },
        },

        // ==========================================
        // MODULE: NASABAH SEARCH
        // ==========================================
        "/api/nasabah/search": {
          get: {
            summary: "Mencari nasabah berdasarkan nama atau kode nasabah",
            tags: ["Nasabah"],
            parameters: [
              { name: "q", in: "query", required: true, schema: { type: "string" }, description: "Kata kunci pencarian (nama atau kode nasabah)" },
            ],
            responses: {
              200: {
                description: "Hasil pencarian nasabah",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        success: { type: "boolean" },
                        data: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              id_nasabah: { type: "string", format: "uuid" },
                              kode_nasabah: { type: "string" },
                              nama: { type: "string" },
                              nomor_hp: { type: "string" },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },

        // ==========================================
        // MODULE: PENGANGKUTAN
        // ==========================================
        "/api/pengangkutan": {
          get: {
            summary: "Mendapatkan riwayat pengangkutan sampah",
            tags: ["Pengangkutan"],
            security: [{ BearerAuth: [] }],
            responses: {
              200: {
                description: "Riwayat pengangkutan berhasil dimuat",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        success: { type: "boolean" },
                        data: { type: "array", items: { $ref: "#/components/schemas/Pengangkutan" } },
                      },
                    },
                  },
                },
              },
            },
          },
          post: {
            summary: "Mencatat pengangkutan sampah baru",
            tags: ["Pengangkutan"],
            security: [{ BearerAuth: [] }],
            requestBody: {
              required: true,
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    required: ["volume_m3_diangkut"],
                    properties: {
                      volume_m3_diangkut: { type: "number", example: 3.5 },
                      keterangan: { type: "string", example: "Pengangkutan rutin" },
                    },
                  },
                },
              },
            },
            responses: {
              201: { description: "Pengangkutan berhasil dicatat" },
              400: { description: "Validasi gagal" },
            },
          },
        },

        // ==========================================
        // MODULE: PENGATURAN
        // ==========================================
        "/api/pengaturan": {
          get: {
            summary: "Mendapatkan pengaturan sistem bank sampah",
            tags: ["Pengaturan"],
            security: [{ BearerAuth: [] }],
            responses: {
              200: {
                description: "Pengaturan berhasil dimuat",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        success: { type: "boolean" },
                        data: { $ref: "#/components/schemas/Pengaturan" },
                      },
                    },
                  },
                },
              },
            },
          },
          put: {
            summary: "Memperbarui pengaturan sistem (kapasitas & threshold)",
            tags: ["Pengaturan"],
            security: [{ BearerAuth: [] }],
            requestBody: {
              required: true,
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    required: ["kapasitas_maksimal_m3", "threshold_persen"],
                    properties: {
                      kapasitas_maksimal_m3: { type: "number", example: 50.0 },
                      threshold_persen: { type: "number", minimum: 0, maximum: 100, example: 80 },
                    },
                  },
                },
              },
            },
            responses: {
              200: { description: "Pengaturan berhasil diperbarui" },
              400: { description: "Validasi gagal" },
            },
          },
        },

        // ==========================================
        // MODULE: TRANSAKSI SETORAN
        // ==========================================
        "/api/transaksi": {
          get: {
            summary: "Mendapatkan seluruh riwayat transaksi timbangan masuk",
            tags: ["Transaksi"],
            responses: {
              200: {
                description: "Sukses mengambil list log setoran",
                content: { "application/json": { schema: { type: "object", properties: { success: { type: "boolean" }, data: { type: "array", items: { $ref: "#/components/schemas/Transaksi" } } } } } },
              },
            },
          },
          post: {
            summary: "Mencatat setoran sampah baru (Otomatis hitung berat, volume, subtotal harga, & akumulasi saldo nasabah)",
            tags: ["Transaksi"],
            security: [{ BearerAuth: [] }],
            requestBody: {
              required: true,
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    required: ["id_nasabah", "tanggal", "items"],
                    properties: {
                      id_nasabah: { type: "string", format: "uuid", example: "b1c2d3e4-f5g6-7h8i-9j0k-l1m2n3o4p5q6" },
                      tanggal: { type: "string", format: "date", example: "2026-06-09" },
                      items: {
                        type: "array",
                        description: "Array berisi daftar item sampah yang disetorkan saat timbangan",
                        items: {
                          type: "object",
                          required: ["id_jenis_sampah", "berat_kg"],
                          properties: {
                            id_jenis_sampah: { type: "string", format: "uuid", example: "d3e4f5g6-h7i8-9j0k-l1m2-n3o4p5q6r7s8" },
                            berat_kg: { type: "number", format: "float", example: 4.5 },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            responses: {
              201: {
                description: "Transaksi setoran berhasil dibukukan dan saldo nasabah otomatis bertambah",
                content: { "application/json": { schema: { type: "object", properties: { success: { type: "boolean" }, data: { $ref: "#/components/schemas/Transaksi" } } } } },
              },
            },
          },
        },
        "/api/transaksi/{id}": {
          get: {
            summary: "Mendapatkan rincian nota timbangan beserta pecahan seluruh detail item sampah",
            tags: ["Transaksi"],
            parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
            responses: {
              200: {
                description: "Nota rincian timbangan ditemukan",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        success: { type: "boolean", example: true },
                        transaksi: { $ref: "#/components/schemas/Transaksi" },
                        detail: { type: "array", items: { $ref: "#/components/schemas/DetailTransaksi" } },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });
  return spec;
};