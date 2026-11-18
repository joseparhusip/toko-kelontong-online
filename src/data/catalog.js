// Katalog toko.
//
// Pembagian tanggung jawab data:
// - Harga, diskon, satuan jual, kategori  -> milik toko (data di file ini).
//   Open Food Facts tidak punya data harga, jadi ini memang harus dari toko.
// - Foto & merek produk kemasan (yang punya `barcode`) -> disegarkan dari
//   Open Food Facts lewat src/services/productApi.js. Nilai `image`/`brand`
//   di sini adalah snapshot yang dipakai kalau API sedang tidak bisa diakses.
// - Produk segar tanpa kemasan (tanpa barcode) memakai foto yang sudah ada.

const off = (path) => `https://images.openfoodfacts.org/images/products/${path}`
const photo = (id) => `https://images.unsplash.com/${id}?w=480&q=75&auto=format&fit=crop`

export const CATEGORIES = [
  { name: 'Sembako', icon: '/icons-category/Sembako.png' },
  { name: 'Minuman', icon: '/icons-category/Minuman.png' },
  { name: 'Makanan Ringan', icon: '/icons-category/Makanan-Ringan.png' },
  { name: 'Bumbu Dapur', icon: '/icons-category/Bumbu-Dapur.png' },
  { name: 'Kebersihan', icon: '/icons-category/Kebersihan.png' },
  { name: 'Kebutuhan Bayi', icon: '/icons-category/Kebutuhan-Bayi.png' },
]

export const CATALOG = [
  // ---------------------------- Sembako ----------------------------
  { id: 1, title: 'Beras Premium Pandan Wangi', category: 'Sembako', unit: '5 kg', price: 68000, discount: 10, rating: 4.9, sold: 2400, image: photo('photo-1586201375761-83865001e31c') },
  { id: 2, title: 'Minyak Goreng Sawit', category: 'Sembako', unit: '2 liter', price: 32000, discount: 15, rating: 4.7, sold: 1800, image: photo('photo-1474979266404-7eaacbcd87c5') },
  { id: 3, barcode: '8995177102058', title: 'Gulaku Gula Tebu Murni', brand: 'Gulaku', category: 'Sembako', unit: '1 kg', price: 17500, discount: 0, rating: 4.8, sold: 3100, image: off('899/517/710/2058/front_id.6.400.jpg') },
  { id: 4, title: 'Tepung Terigu Serbaguna', category: 'Sembako', unit: '1 kg', price: 12000, discount: 5, rating: 4.6, sold: 980, image: photo('photo-1574323347407-f5e1ad6d020b') },
  { id: 5, title: 'Telur Ayam Negeri', category: 'Sembako', unit: '1 kg', price: 28000, discount: 0, rating: 4.8, sold: 4200, image: photo('photo-1582722872445-44dc5f7e3c8f') },
  { id: 7, title: 'Ayam Broiler Utuh', category: 'Sembako', unit: '± 1 kg', price: 38000, discount: 0, rating: 4.6, sold: 2900, image: photo('photo-1587593810167-a84920ea0781') },
  { id: 9, title: 'Kentang Granola', category: 'Sembako', unit: '1 kg', price: 16000, discount: 0, rating: 4.6, sold: 890, image: photo('photo-1518977676601-b53f82aba655') },
  { id: 10, title: 'Wortel', category: 'Sembako', unit: '500 g', price: 8000, discount: 0, rating: 4.7, sold: 1300, image: photo('photo-1598170845058-32b9d6a5da37') },
  { id: 11, title: 'Tomat Merah', category: 'Sembako', unit: '500 g', price: 9000, discount: 0, rating: 4.6, sold: 1800, image: photo('photo-1546094096-0df4bcaaa337') },
  { id: 12, title: 'Pisang Cavendish', category: 'Sembako', unit: '1 sisir', price: 18000, discount: 0, rating: 4.7, sold: 2400, image: photo('photo-1571771894821-ce9b6c11b08e') },

  // ---------------------------- Minuman ----------------------------
  { id: 13, barcode: '8991002105485', title: 'Kapal Api Special Mix', brand: 'Kapal Api', category: 'Minuman', unit: '10 sachet', price: 15000, discount: 0, rating: 4.9, sold: 6200, image: off('899/100/210/5485/front_en.29.400.jpg') },
  { id: 14, barcode: '8991002133822', title: 'Good Day Cappuccino', brand: 'Good Day', category: 'Minuman', unit: '10 sachet', price: 16500, discount: 8, rating: 4.8, sold: 3900, image: off('899/100/213/3822/front_en.13.400.jpg') },
  { id: 15, barcode: '8999999195649', title: 'Sariwangi Teh Celup', brand: 'Sariwangi', category: 'Minuman', unit: '25 kantong', price: 8500, discount: 0, rating: 4.7, sold: 2800, image: off('899/999/919/5649/front_en.24.400.jpg') },
  { id: 16, barcode: '8998009010613', title: 'Ultra Milk Full Cream', brand: 'Ultra Jaya', category: 'Minuman', unit: '1 liter', price: 19500, discount: 0, rating: 4.9, sold: 3300, image: off('899/800/901/0613/front_en.61.400.jpg') },
  { id: 17, barcode: '8992696404441', title: 'Bear Brand Susu Steril', brand: 'Nestlé', category: 'Minuman', unit: '189 ml', price: 10500, discount: 0, rating: 4.8, sold: 2100, image: off('899/269/640/4441/front_id.16.400.jpg') },
  { id: 18, barcode: '8996001600146', title: 'Teh Pucuk Harum', brand: 'Mayora', category: 'Minuman', unit: '350 ml', price: 4000, discount: 0, rating: 4.8, sold: 5100, image: off('899/600/160/0146/front_en.84.400.jpg') },
  { id: 19, barcode: '8886008101053', title: 'Aqua Air Mineral', brand: 'Aqua', category: 'Minuman', unit: '600 ml', price: 3500, discount: 0, rating: 4.9, sold: 7400, image: off('888/600/810/1053/front_en.25.400.jpg') },
  { id: 20, barcode: '8997035563414', title: 'Pocari Sweat', brand: 'Otsuka', category: 'Minuman', unit: '500 ml', price: 8000, discount: 5, rating: 4.7, sold: 1600, image: off('899/703/556/3414/front_id.4.400.jpg') },
  { id: 21, title: 'Madu Hutan Murni', category: 'Minuman', unit: '300 ml', price: 55000, discount: 12, rating: 4.9, sold: 760, image: photo('photo-1558642452-9d2a7deb7f62') },

  // ------------------------- Makanan Ringan -------------------------
  { id: 22, barcode: '0089686010947', title: 'Indomie Mi Goreng', brand: 'Indomie', category: 'Makanan Ringan', unit: '5 bungkus', price: 17000, discount: 6, rating: 4.9, sold: 8100, image: off('008/968/601/0947/front_en.72.400.jpg') },
  { id: 23, barcode: '0089686010015', title: 'Indomie Ayam Bawang', brand: 'Indomie', category: 'Makanan Ringan', unit: '5 bungkus', price: 16000, discount: 0, rating: 4.8, sold: 5600, image: off('008/968/601/0015/front_fr.31.400.jpg') },
  { id: 24, barcode: '8998866200301', title: 'Mie Sedaap Goreng', brand: 'Mie Sedaap', category: 'Makanan Ringan', unit: '5 bungkus', price: 16500, discount: 0, rating: 4.8, sold: 4300, image: off('899/886/620/0301/front_en.87.400.jpg') },
  { id: 25, barcode: '0089686060027', title: 'Pop Mie Rasa Ayam', brand: 'Pop Mie', category: 'Makanan Ringan', unit: '75 g', price: 6000, discount: 0, rating: 4.6, sold: 2700, image: off('008/968/606/0027/front_id.6.400.jpg') },
  { id: 26, barcode: '0089686598957', title: 'Chitato Rasa Keju', brand: 'Chitato', category: 'Makanan Ringan', unit: '68 g', price: 11500, discount: 10, rating: 4.7, sold: 1900, image: off('008/968/659/8957/front_en.3.400.jpg') },
  { id: 27, barcode: '8992760221028', title: 'Oreo Original Vanila', brand: 'Oreo', category: 'Makanan Ringan', unit: '123 g', price: 9500, discount: 0, rating: 4.8, sold: 3200, image: off('899/276/022/1028/front_en.55.400.jpg') },
  { id: 28, barcode: '8996001314005', title: 'Roma Kelapa', brand: 'Roma', category: 'Makanan Ringan', unit: '300 g', price: 10000, discount: 0, rating: 4.7, sold: 2600, image: off('899/600/131/4005/front_en.3.400.jpg') },
  { id: 29, barcode: '8996001354124', title: 'Beng-Beng', brand: 'Mayora', category: 'Makanan Ringan', unit: '10 pcs', price: 22000, discount: 8, rating: 4.8, sold: 2200, image: off('899/600/135/4124/front_id.26.400.jpg') },
  { id: 30, barcode: '8991102374309', title: 'Tango Wafer Cokelat', brand: 'Tango', category: 'Makanan Ringan', unit: '176 g', price: 12500, discount: 0, rating: 4.6, sold: 1400, image: off('899/110/237/4309/front_en.3.400.jpg') },
  { id: 31, barcode: '0711844330115', title: 'ABC Sarden Saus Tomat', brand: 'ABC', category: 'Makanan Ringan', unit: '425 g', price: 23000, discount: 15, rating: 4.6, sold: 1100, image: off('071/184/433/0115/front_en.17.400.jpg') },
  { id: 32, title: 'Keripik Singkong Balado', category: 'Makanan Ringan', unit: '200 g', price: 12000, discount: 0, rating: 4.6, sold: 2500, image: photo('photo-1599490659213-e2b9527bd087') },

  // --------------------------- Bumbu Dapur ---------------------------
  { id: 33, barcode: '8999999002503', title: 'Bango Kecap Manis', brand: 'Bango', category: 'Bumbu Dapur', unit: '275 ml', price: 14500, discount: 0, rating: 4.9, sold: 3700, image: off('899/999/900/2503/front_fr.3.400.jpg') },
  { id: 34, barcode: '8998866608015', title: 'Kecap Manis Sedaap', brand: 'Sedaap', category: 'Bumbu Dapur', unit: '275 ml', price: 11000, discount: 8, rating: 4.7, sold: 1500, image: off('899/886/660/8015/front_id.7.400.jpg') },
  { id: 35, barcode: '0711844115057', title: 'ABC Kecap Asin', brand: 'ABC', category: 'Bumbu Dapur', unit: '133 ml', price: 7500, discount: 0, rating: 4.6, sold: 940, image: off('071/184/411/5057/front_en.7.400.jpg') },
  { id: 36, barcode: '0711844120525', title: 'ABC Saus Sambal Asli', brand: 'ABC', category: 'Bumbu Dapur', unit: '335 ml', price: 13500, discount: 0, rating: 4.8, sold: 3700, image: off('071/184/412/0525/front_id.3.400.jpg') },
  { id: 37, barcode: '8993226125003', title: 'Refina Garam Meja', brand: 'Refina', category: 'Bumbu Dapur', unit: '250 g', price: 4500, discount: 0, rating: 4.5, sold: 2000, image: off('899/322/612/5003/front_en.3.400.jpg') },
  { id: 38, title: 'Bawang Merah', category: 'Bumbu Dapur', unit: '500 g', price: 15000, discount: 0, rating: 4.7, sold: 1900, image: photo('photo-1618512496248-a07fe83aa8cb') },
  { id: 39, title: 'Bawang Putih', category: 'Bumbu Dapur', unit: '250 g', price: 9000, discount: 0, rating: 4.6, sold: 2100, image: photo('photo-1540148426945-6cf22a6b2383') },

  // ---------------------------- Kebersihan ----------------------------
  { id: 40, barcode: '8998866600521', title: 'So Klin Pembersih Lantai Citrus Lemon', brand: 'So Klin', category: 'Kebersihan', unit: '400 ml', price: 9500, discount: 10, rating: 4.6, sold: 2700, image: off('899/886/660/0521/front_en.3.400.jpg') },
  { id: 41, barcode: '8998866603409', title: 'So Klin Rapika 3 in 1 Lavender', brand: 'So Klin', category: 'Kebersihan', unit: '400 ml', price: 8500, discount: 0, rating: 4.7, sold: 3900, image: off('899/886/660/3409/front_en.3.400.jpg') },
  { id: 42, barcode: '8999999567651', title: 'Lifebuoy Sabun Batang Total 10', brand: 'Lifebuoy', category: 'Kebersihan', unit: '60 g', price: 4000, discount: 0, rating: 4.7, sold: 3200, image: off('899/999/956/7651/front_id.3.400.jpg') },

  // ------------------------- Kebutuhan Bayi -------------------------
  { id: 43, barcode: '8993531772565', title: 'Yummy Bites Rice Crackers', brand: 'Yummy Bites', category: 'Kebutuhan Bayi', unit: '50 g', price: 21000, discount: 0, rating: 4.8, sold: 640, image: off('899/353/177/2565/front_en.4.400.jpg') },
  { id: 44, barcode: '8886451002860', title: 'PediaSure Vanila', brand: 'PediaSure', category: 'Kebutuhan Bayi', unit: '850 g', price: 389000, discount: 5, rating: 4.9, sold: 310, image: off('888/645/100/2860/front_en.6.400.jpg') },
  { id: 45, barcode: '8999908042606', title: 'My Baby Baby Powder Soft & Gentle', brand: 'My Baby', category: 'Kebutuhan Bayi', unit: '313 g', price: 24500, discount: 0, rating: 4.7, sold: 980, image: off('899/990/804/2606/front_en.3.400.jpg') },
  { id: 46, barcode: '8998103000534', title: 'Cussons Baby Soap Soft & Smooth', brand: 'Cussons Baby', category: 'Kebutuhan Bayi', unit: '60 g', price: 5500, discount: 5, rating: 4.9, sold: 760, image: off('899/810/300/0534/front_id.3.400.jpg') },
]
