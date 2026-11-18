// Deskripsi produk dari toko.
// Aturan menulis (lihat ANTI-AI-SLOP.md bagian Teks):
// - Faktual dan pendek, seperti pemilik warung menjelaskan barangnya.
// - Tanpa klaim kesehatan, "terbaik", "premium kualitas nomor 1", dsb.
// - `uses`  : 2–3 kegunaan nyata, tampil sebagai label "Cocok untuk".
// - `storage`: cara simpan; kalau kosong, pakai default per kategori.

export const STORAGE_DEFAULT = {
  Sembako: 'Simpan di tempat kering dan sejuk, jauh dari sinar matahari langsung.',
  Minuman: 'Simpan di tempat sejuk. Setelah dibuka, segera habiskan atau simpan di kulkas.',
  'Makanan Ringan': 'Simpan di tempat kering. Tutup rapat kemasan setelah dibuka.',
  'Bumbu Dapur': 'Simpan di tempat sejuk dan kering. Tutup rapat setelah dipakai.',
  Kebersihan: 'Simpan di tempat kering, jauhkan dari jangkauan anak-anak.',
  'Kebutuhan Bayi': 'Simpan di tempat kering dan sejuk. Ikuti petunjuk pada kemasan.',
}

export const DESCRIPTIONS = {
  // ---------------------------- Sembako ----------------------------
  1: {
    desc: 'Beras jenis pandan wangi dengan butir panjang. Nasinya pulen dan harum, enak untuk makan sehari-hari.',
    uses: ['Nasi putih', 'Nasi uduk', 'Nasi goreng'],
    storage: 'Simpan di wadah tertutup rapat agar tidak berkutu. Jauhkan dari lantai yang lembap.',
  },
  2: {
    desc: 'Minyak goreng kelapa sawit kemasan 2 liter untuk kebutuhan masak harian.',
    uses: ['Menggoreng', 'Menumis', 'Membuat sambal'],
    storage: 'Tutup rapat setelah dipakai. Simpan jauh dari kompor dan sinar matahari.',
  },
  3: {
    desc: 'Gula pasir putih dari tebu. Butirannya halus dan cepat larut.',
    uses: ['Teh & kopi', 'Kue', 'Masakan'],
    storage: 'Pindahkan ke toples tertutup agar tidak menggumpal dan tidak dikerubungi semut.',
  },
  4: {
    desc: 'Tepung terigu protein sedang yang bisa dipakai untuk banyak resep, dari gorengan sampai kue.',
    uses: ['Gorengan', 'Kue basah', 'Adonan bakwan'],
  },
  5: {
    desc: 'Telur ayam negeri, sekitar 15–17 butir per kilogram. Bisa digoreng, direbus, atau dipakai untuk adonan kue.',
    uses: ['Telur dadar', 'Kue', 'Lauk harian'],
    storage: 'Simpan di kulkas dengan ujung tumpul menghadap ke atas. Cuci sesaat sebelum dimasak saja.',
  },
  7: {
    desc: 'Ayam broiler utuh sudah dibersihkan, berat sekitar 1 kg per ekor.',
    uses: ['Ayam goreng', 'Sop', 'Opor'],
    storage: 'Masukkan ke freezer jika tidak dimasak hari ini. Cairkan di kulkas sebelum dimasak.',
  },
  9: {
    desc: 'Kentang granola ukuran sedang, kulit tipis dan daging kuning.',
    uses: ['Perkedel', 'Sop', 'Kentang goreng'],
    storage: 'Simpan di tempat gelap dan berangin. Jangan disimpan bersama bawang.',
  },
  10: {
    desc: 'Wortel segar dengan warna oranye cerah dan tekstur renyah.',
    uses: ['Sop', 'Capcay', 'Jus'],
    storage: 'Simpan di laci sayur kulkas dalam plastik berlubang.',
  },
  11: {
    desc: 'Tomat merah matang, cocok untuk dimasak maupun dimakan langsung.',
    uses: ['Sambal', 'Sop', 'Lalapan'],
    storage: 'Simpan di suhu ruang sampai matang penuh, lalu pindahkan ke kulkas.',
  },
  12: {
    desc: 'Pisang cavendish satu sisir, sekitar 6–8 buah.',
    uses: ['Sarapan', 'Bekal', 'Smoothie'],
    storage: 'Simpan di suhu ruang. Jangan dimasukkan kulkas sebelum matang.',
  },

  // ---------------------------- Minuman ----------------------------
  13: {
    desc: 'Kopi bubuk dengan gula dalam sachet. Tinggal seduh dengan air panas, ampasnya mengendap.',
    uses: ['Kopi pagi', 'Teman begadang', 'Suguhan tamu'],
  },
  14: {
    desc: 'Kopi cappuccino instan dengan taburan cokelat. Rasanya manis dan lembut.',
    uses: ['Kopi santai', 'Diseduh dingin', 'Suguhan tamu'],
  },
  15: {
    desc: 'Teh hitam celup dalam kantong. Satu kantong untuk satu gelas.',
    uses: ['Teh manis', 'Es teh', 'Teh tawar'],
  },
  16: {
    desc: 'Susu UHT full cream dalam kotak 1 liter. Tidak perlu dimasak, bisa langsung diminum.',
    uses: ['Diminum langsung', 'Sereal', 'Bahan kue'],
    storage: 'Sebelum dibuka tahan di suhu ruang. Setelah dibuka simpan di kulkas dan habiskan dalam 3 hari.',
  },
  17: {
    desc: 'Susu sapi murni steril dalam kaleng kecil.',
    uses: ['Diminum dingin', 'Bekal', 'Campuran kopi'],
  },
  18: {
    desc: 'Teh melati dalam botol, manis dan siap minum.',
    uses: ['Teman makan', 'Bekal', 'Diminum dingin'],
  },
  19: {
    desc: 'Air mineral dalam botol 600 ml.',
    uses: ['Bekal', 'Olahraga', 'Persediaan rumah'],
  },
  20: {
    desc: 'Minuman isotonik rasa segar dalam botol 500 ml.',
    uses: ['Setelah olahraga', 'Cuaca panas', 'Bekal'],
  },
  21: {
    desc: 'Madu hutan dalam botol kaca 300 ml. Rasanya manis dengan sedikit pahit khas madu hutan.',
    uses: ['Campuran teh', 'Olesan roti', 'Diminum langsung'],
    storage: 'Simpan di suhu ruang, tidak perlu kulkas. Pakai sendok kering.',
  },

  // ------------------------- Makanan Ringan -------------------------
  22: {
    desc: 'Mi goreng instan rasa original. Satu paket berisi 5 bungkus, lengkap dengan bumbu, kecap, sambal, dan bawang goreng.',
    uses: ['Makan cepat', 'Stok tanggal tua', 'Tambah telur'],
  },
  23: {
    desc: 'Mi kuah instan rasa ayam bawang. Satu paket berisi 5 bungkus.',
    uses: ['Makan malam', 'Saat hujan', 'Tambah sayur'],
  },
  24: {
    desc: 'Mi goreng instan dengan bumbu dan kecap. Satu paket berisi 5 bungkus.',
    uses: ['Makan cepat', 'Bekal', 'Tambah telur'],
  },
  25: {
    desc: 'Mi instan dalam cup. Tinggal tuang air panas, tunggu 3 menit.',
    uses: ['Perjalanan', 'Kantor', 'Kos'],
  },
  26: {
    desc: 'Keripik kentang bergelombang rasa keju.',
    uses: ['Camilan nonton', 'Teman kumpul', 'Bekal'],
  },
  27: {
    desc: 'Biskuit cokelat dengan krim vanila di tengahnya.',
    uses: ['Camilan', 'Dicelup susu', 'Bahan kue'],
  },
  28: {
    desc: 'Biskuit kelapa renyah. Kemasan besar untuk stok di rumah.',
    uses: ['Teman teh', 'Suguhan tamu', 'Camilan anak'],
  },
  29: {
    desc: 'Wafer berlapis karamel dan cokelat dengan renyahan beras. Isi 10 batang.',
    uses: ['Camilan', 'Bekal sekolah', 'Disimpan di kulkas'],
  },
  30: {
    desc: 'Wafer renyah berlapis krim cokelat.',
    uses: ['Teman kopi', 'Camilan', 'Suguhan tamu'],
  },
  31: {
    desc: 'Ikan sarden dalam saus tomat, kaleng besar 425 g.',
    uses: ['Lauk cepat', 'Nasi goreng', 'Stok dapur'],
    storage: 'Simpan kaleng di tempat kering. Setelah dibuka pindahkan ke wadah lain dan simpan di kulkas.',
  },
  32: {
    desc: 'Keripik singkong tipis dengan bumbu balado pedas manis.',
    uses: ['Camilan', 'Teman nasi', 'Oleh-oleh'],
  },

  // --------------------------- Bumbu Dapur ---------------------------
  33: {
    desc: 'Kecap manis kental dari kedelai hitam.',
    uses: ['Semur', 'Nasi goreng', 'Sate'],
  },
  34: {
    desc: 'Kecap manis dalam botol 275 ml.',
    uses: ['Tumisan', 'Mi goreng', 'Cocolan'],
  },
  35: {
    desc: 'Kecap asin untuk menambah rasa gurih pada masakan.',
    uses: ['Tumis sayur', 'Bakmi', 'Marinasi'],
  },
  36: {
    desc: 'Saus sambal pedas dalam botol.',
    uses: ['Gorengan', 'Bakso', 'Mi'],
    storage: 'Setelah dibuka simpan di kulkas dan tutup rapat.',
  },
  37: {
    desc: 'Garam meja halus beryodium.',
    uses: ['Masak harian', 'Taburan', 'Kue'],
  },
  38: {
    desc: 'Bawang merah lokal, ukuran sedang dan kering.',
    uses: ['Bumbu dasar', 'Bawang goreng', 'Sambal'],
    storage: 'Simpan di wadah berlubang di tempat kering dan berangin.',
  },
  39: {
    desc: 'Bawang putih lokal, siung kecil dengan aroma kuat.',
    uses: ['Tumisan', 'Bumbu halus', 'Marinasi'],
    storage: 'Simpan di wadah berlubang di tempat kering dan berangin.',
  },

  // ---------------------------- Kebersihan ----------------------------
  40: {
    desc: 'Cairan pembersih lantai aroma jeruk lemon dalam kemasan isi ulang.',
    uses: ['Mengepel', 'Lantai keramik', 'Dapur'],
  },
  41: {
    desc: 'Pelicin dan pewangi pakaian untuk disemprot saat menyetrika.',
    uses: ['Menyetrika', 'Pewangi baju', 'Seragam'],
  },
  42: {
    desc: 'Sabun mandi batang 60 g.',
    uses: ['Mandi', 'Cuci tangan', 'Stok kamar mandi'],
  },

  // ------------------------- Kebutuhan Bayi -------------------------
  43: {
    desc: 'Biskuit beras yang mudah lumer di mulut, untuk anak yang sudah mulai belajar makan sendiri.',
    uses: ['Camilan anak', 'Bekal jalan', 'Latihan makan'],
  },
  44: {
    desc: 'Susu bubuk rasa vanila untuk anak. Seduh sesuai takaran pada kemasan.',
    uses: ['Minum pagi', 'Sebelum tidur', 'Bekal'],
    storage: 'Tutup rapat kaleng setelah dipakai. Gunakan sendok takar yang kering.',
  },
  45: {
    desc: 'Bedak bayi dengan wangi lembut.',
    uses: ['Setelah mandi', 'Lipatan kulit', 'Sehari-hari'],
  },
  46: {
    desc: 'Sabun mandi batang untuk bayi.',
    uses: ['Mandi bayi', 'Sehari-hari', 'Stok kamar mandi'],
  },
}
