import { createSwaggerSpec } from "next-swagger-doc";

export const getApiDocs = async () => {
  const spec = createSwaggerSpec({
    apiFolder: "app/api", 
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Waste Management Stack API (EcoOil Connect)",
        version: "1.0.0",
        description: "Dokumentasi API terpusat untuk platform EcoOil Connect. Digunakan sebagai acuan utama integrasi tim Frontend dan Mobile.",
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
          // --- GLOBAL ERROR SCHEMA ---
          ErrorResponse: {
            type: "object",
            properties: {
              success: { type: "boolean", example: false },
              message: { type: "string", example: "Pesan kesalahan atau validasi gagal" },
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