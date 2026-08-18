/**
 * Data soal untuk 3 kategori baru Qurio:
 * - Geografi (Indonesia & Dunia)
 * - Bahasa & Sastra Indonesia
 * - Olahraga
 *
 * Format mengikuti struktur model `Question` di prisma/schema.prisma:
 * (categoryId, question, options[4], correctAnswer (index 0-3), difficulty)
 *
 * CATATAN:
 * - Ini adalah starter set (15 soal per kategori, total 45 soal).
 * - Silakan direview ulang sebelum dipakai — khususnya soal olahraga yang
 *   menyangkut rekor/prestasi, karena data semacam ini bisa berubah seiring waktu.
 * - Sesuaikan `categoryId` dengan slug/id kategori asli di database kamu
 *   setelah kategori baru dibuat (mengikuti pola slug: "geografi", "bahasa-sastra", "olahraga").
 * - difficulty bisa disesuaikan skala yang sudah dipakai di seed.ts kamu
 *   (di sini pakai "easy" | "medium" | "hard" sebagai placeholder).
 */

type NewQuestion = {
  categorySlug: "geografi" | "bahasa-sastra" | "olahraga";
  question: string;
  options: [string, string, string, string];
  correctAnswer: number; // index 0-3
  difficulty: "easy" | "medium" | "hard";
};

type NewCategoryMetadata = {
  slug: "geografi" | "bahasa-sastra" | "olahraga";
  name: string;
  description: string;
  emoji: string;
};

/**
 * Metadata untuk insert ke tabel `Category`.
 * Silakan sesuaikan kalau ada preferensi nama/deskripsi/emoji lain.
 */
export const newCategoriesMetadata: NewCategoryMetadata[] = [
  {
    slug: "geografi",
    name: "Geografi",
    description: "Uji wawasanmu seputar bentang alam, negara, dan fakta geografis Indonesia & dunia.",
    emoji: "🌏",
  },
  {
    slug: "bahasa-sastra",
    name: "Bahasa & Sastra Indonesia",
    description: "Dari peribahasa, EYD, hingga karya sastra klasik dan penulis legendaris Indonesia.",
    emoji: "📖",
  },
  {
    slug: "olahraga",
    name: "Olahraga",
    description: "Seputar aturan dasar, tokoh, dan sejarah olahraga populer di Indonesia & dunia.",
    emoji: "⚽",
  },
];

/**
 * ⚠️ TODO SEBELUM PRODUCTION:
 * 1. Masih 15 soal/kategori (total 45). Target akhir: 40 soal/kategori
 *    (konsisten dengan kategori Agama/Sejarah/Umum yang sudah ada).
 * 2. Distribusi difficulty di bawah ini belum dicek proporsinya terhadap
 *    3 kategori lama — cek dulu proporsi easy/medium/hard yang sudah dipakai
 *    di database, lalu samakan saat menambah 25 soal sisanya per kategori.
 * 3. Soal kategori "olahraga" yang menyangkut rekor/prestasi (misal soal
 *    tentang Rudy Hartono & Susi Susanti) WAJIB diverifikasi ulang manual
 *    sebelum dimasukkan ke database — data jenis ini paling rawan salah/basi.
 */
export const newCategoryQuestions: NewQuestion[] = [
  // ============================================
  // KATEGORI: GEOGRAFI (Indonesia & Dunia)
  // ============================================
  {
    categorySlug: "geografi",
    question: "Gunung tertinggi di Indonesia adalah?",
    options: ["Gunung Kerinci", "Puncak Jaya", "Gunung Rinjani", "Gunung Semeru"],
    correctAnswer: 1,
    difficulty: "medium",
  },
  {
    categorySlug: "geografi",
    question: "Ibu kota negara Jepang adalah?",
    options: ["Osaka", "Kyoto", "Tokyo", "Yokohama"],
    correctAnswer: 2,
    difficulty: "easy",
  },
  {
    categorySlug: "geografi",
    question: "Selat yang memisahkan Pulau Sumatera dan Pulau Jawa adalah?",
    options: ["Selat Bali", "Selat Sunda", "Selat Karimata", "Selat Malaka"],
    correctAnswer: 1,
    difficulty: "easy",
  },
  {
    categorySlug: "geografi",
    question: "Sungai terpanjang di dunia adalah?",
    options: ["Sungai Amazon", "Sungai Nil", "Sungai Yangtze", "Sungai Mississippi"],
    correctAnswer: 1,
    difficulty: "medium",
  },
  {
    categorySlug: "geografi",
    question: "Provinsi paling timur di Indonesia adalah?",
    options: ["Maluku Utara", "Papua Selatan", "Papua", "Papua Pegunungan"],
    correctAnswer: 2,
    difficulty: "hard",
  },
  {
    categorySlug: "geografi",
    question: "Benua terkecil di dunia adalah?",
    options: ["Eropa", "Antartika", "Australia", "Amerika Selatan"],
    correctAnswer: 2,
    difficulty: "easy",
  },
  {
    categorySlug: "geografi",
    question: "Danau terbesar di Indonesia adalah?",
    options: ["Danau Singkarak", "Danau Toba", "Danau Poso", "Danau Maninjau"],
    correctAnswer: 1,
    difficulty: "easy",
  },
  {
    categorySlug: "geografi",
    question: "Negara dengan jumlah penduduk terbanyak di dunia (berdasarkan proyeksi terkini) adalah?",
    options: ["Tiongkok", "Amerika Serikat", "India", "Indonesia"],
    correctAnswer: 2,
    difficulty: "medium",
  },
  {
    categorySlug: "geografi",
    question: "Kota Bandung berada di provinsi?",
    options: ["Jawa Tengah", "Jawa Timur", "Banten", "Jawa Barat"],
    correctAnswer: 3,
    difficulty: "easy",
  },
  {
    categorySlug: "geografi",
    question: "Gurun terluas di dunia adalah?",
    options: ["Gurun Sahara", "Gurun Gobi", "Gurun Antartika", "Gurun Arabia"],
    correctAnswer: 2,
    difficulty: "hard",
  },
  {
    categorySlug: "geografi",
    question: "Garis khayal yang membagi bumi menjadi belahan utara dan selatan disebut?",
    options: ["Garis Bujur", "Garis Khatulistiwa", "Garis Meridian", "Garis Wallace"],
    correctAnswer: 1,
    difficulty: "easy",
  },
  {
    categorySlug: "geografi",
    question: "Kepulauan Raja Ampat terletak di provinsi?",
    options: ["Maluku", "Papua Barat", "Papua", "Sulawesi Utara"],
    correctAnswer: 1,
    difficulty: "medium",
  },
  {
    categorySlug: "geografi",
    question: "Samudra terluas di dunia adalah?",
    options: ["Samudra Atlantik", "Samudra Hindia", "Samudra Pasifik", "Samudra Arktik"],
    correctAnswer: 2,
    difficulty: "easy",
  },
  {
    categorySlug: "geografi",
    question: "Garis Wallace adalah garis yang memisahkan fauna Indonesia bagian barat dan?",
    options: ["Bagian utara", "Bagian tengah", "Bagian timur", "Bagian selatan"],
    correctAnswer: 1,
    difficulty: "hard",
  },
  {
    categorySlug: "geografi",
    question: "Negara terluas di dunia berdasarkan luas wilayah adalah?",
    options: ["Kanada", "Tiongkok", "Amerika Serikat", "Rusia"],
    correctAnswer: 3,
    difficulty: "medium",
  },

  // ============================================
  // KATEGORI: BAHASA & SASTRA INDONESIA
  // ============================================
  {
    categorySlug: "bahasa-sastra",
    question: "Novel \"Laskar Pelangi\" ditulis oleh?",
    options: ["Pramoedya Ananta Toer", "Andrea Hirata", "Tere Liye", "Ahmad Tohari"],
    correctAnswer: 1,
    difficulty: "easy",
  },
  {
    categorySlug: "bahasa-sastra",
    question: "Peribahasa \"Air susu dibalas air tuba\" memiliki arti?",
    options: [
      "Kebaikan dibalas dengan kebaikan",
      "Kebaikan dibalas dengan kejahatan",
      "Kejahatan dibalas dengan kejahatan",
      "Bekerja sama untuk kebaikan bersama",
    ],
    correctAnswer: 1,
    difficulty: "medium",
  },
  {
    categorySlug: "bahasa-sastra",
    question: "Siapa penulis novel \"Bumi Manusia\"?",
    options: ["Pramoedya Ananta Toer", "Chairil Anwar", "W.S. Rendra", "Sutan Takdir Alisjahbana"],
    correctAnswer: 0,
    difficulty: "medium",
  },
  {
    categorySlug: "bahasa-sastra",
    question: "Chairil Anwar dikenal sebagai tokoh sastra Indonesia di bidang?",
    options: ["Prosa", "Drama", "Puisi", "Esai"],
    correctAnswer: 2,
    difficulty: "medium",
  },
  {
    categorySlug: "bahasa-sastra",
    question: "Kata baku yang benar untuk kata tidak baku \"apotik\" adalah?",
    options: ["Apotek", "Apotic", "Apotheek", "Apotique"],
    correctAnswer: 0,
    difficulty: "easy",
  },
  {
    categorySlug: "bahasa-sastra",
    question: "Puisi \"Aku\" yang terkenal dengan larik \"Aku ini binatang jalang\" ditulis oleh?",
    options: ["W.S. Rendra", "Chairil Anwar", "Sapardi Djoko Damono", "Taufiq Ismail"],
    correctAnswer: 1,
    difficulty: "medium",
  },
  {
    categorySlug: "bahasa-sastra",
    question: "Karya sastra klasik \"Sitti Nurbaya\" ditulis oleh?",
    options: ["Marah Rusli", "Abdul Muis", "Merari Siregar", "Sutan Takdir Alisjahbana"],
    correctAnswer: 0,
    difficulty: "hard",
  },
  {
    categorySlug: "bahasa-sastra",
    question: "Peribahasa \"Bagai pungguk merindukan bulan\" menggambarkan?",
    options: [
      "Keinginan yang mustahil tercapai",
      "Kerja keras yang berbuah manis",
      "Kesabaran dalam penantian",
      "Kegembiraan yang berlebihan",
    ],
    correctAnswer: 0,
    difficulty: "medium",
  },
  {
    categorySlug: "bahasa-sastra",
    question: "Bentuk pantun terdiri dari berapa baris dalam satu bait?",
    options: ["Dua baris", "Tiga baris", "Empat baris", "Lima baris"],
    correctAnswer: 2,
    difficulty: "easy",
  },
  {
    categorySlug: "bahasa-sastra",
    question: "Ejaan Yang Disempurnakan (EYD) kini telah digantikan dengan pedoman ejaan bernama?",
    options: [
      "Ejaan Bahasa Indonesia (EBI)",
      "Ejaan Van Ophuijsen",
      "Ejaan Republik",
      "Ejaan Soewandi",
    ],
    correctAnswer: 0,
    difficulty: "hard",
  },
  {
    categorySlug: "bahasa-sastra",
    question: "Sapardi Djoko Damono terkenal dengan puisi cintanya yang berjudul?",
    options: ["Sajak Putih", "Aku Ingin", "Doa", "Diponegoro"],
    correctAnswer: 1,
    difficulty: "medium",
  },
  {
    categorySlug: "bahasa-sastra",
    question: "Kalimat yang menggunakan majas hiperbola adalah?",
    options: [
      "Dia berjalan dengan cepat",
      "Suaranya menggelegar membelah bumi",
      "Hari ini cuaca cerah",
      "Buku itu berwarna merah",
    ],
    correctAnswer: 1,
    difficulty: "medium",
  },
  {
    categorySlug: "bahasa-sastra",
    question: "Cerita rakyat \"Malin Kundang\" berasal dari daerah?",
    options: ["Jawa Barat", "Sumatera Barat", "Kalimantan Selatan", "Sulawesi Selatan"],
    correctAnswer: 1,
    difficulty: "easy",
  },
  {
    categorySlug: "bahasa-sastra",
    question: "Angkatan sastra yang dipelopori oleh Chairil Anwar dikenal dengan nama?",
    options: ["Angkatan Balai Pustaka", "Angkatan Pujangga Baru", "Angkatan 45", "Angkatan 66"],
    correctAnswer: 2,
    difficulty: "hard",
  },
  {
    categorySlug: "bahasa-sastra",
    question: "Kata \"nirlaba\" memiliki arti?",
    options: ["Mencari untung", "Tidak mencari keuntungan", "Kerugian besar", "Modal usaha"],
    correctAnswer: 1,
    difficulty: "medium",
  },

  // ============================================
  // KATEGORI: OLAHRAGA
  // ============================================
  {
    categorySlug: "olahraga",
    question: "Cabang olahraga yang menjadi kebanggaan Indonesia di ajang Olimpiade adalah?",
    options: ["Renang", "Bulu tangkis", "Atletik", "Angkat besi"],
    correctAnswer: 1,
    difficulty: "easy",
  },
  {
    categorySlug: "olahraga",
    question: "Berapa jumlah pemain dalam satu tim sepak bola yang berada di lapangan?",
    options: ["9 pemain", "10 pemain", "11 pemain", "12 pemain"],
    correctAnswer: 2,
    difficulty: "easy",
  },
  {
    categorySlug: "olahraga",
    question: "Olimpiade modern pertama kali diselenggarakan di kota?",
    options: ["Paris", "Athena", "London", "Roma"],
    correctAnswer: 1,
    difficulty: "medium",
  },
  {
    categorySlug: "olahraga",
    question: "Induk organisasi bulu tangkis dunia disingkat?",
    options: ["FIFA", "FIBA", "BWF", "IOC"],
    correctAnswer: 2,
    difficulty: "medium",
  },
  {
    categorySlug: "olahraga",
    question: "Susi Susanti adalah legenda bulu tangkis Indonesia yang meraih emas Olimpiade pertama untuk Indonesia pada tahun?",
    options: ["1988", "1992", "1996", "2000"],
    correctAnswer: 1,
    difficulty: "hard",
  },
  {
    categorySlug: "olahraga",
    question: "Berapa lama durasi satu babak dalam pertandingan sepak bola resmi?",
    options: ["30 menit", "40 menit", "45 menit", "50 menit"],
    correctAnswer: 2,
    difficulty: "easy",
  },
  {
    categorySlug: "olahraga",
    question: "Cabang olahraga bela diri asli Indonesia adalah?",
    options: ["Karate", "Taekwondo", "Pencak Silat", "Judo"],
    correctAnswer: 2,
    difficulty: "easy",
  },
  {
    categorySlug: "olahraga",
    question: "Ajang olahraga multievent negara-negara Asia Tenggara disebut?",
    options: ["Asian Games", "SEA Games", "Olimpiade", "Piala AFF"],
    correctAnswer: 1,
    difficulty: "easy",
  },
  {
    categorySlug: "olahraga",
    question: "Dalam bulu tangkis, skor kemenangan satu game ditentukan saat pemain mencapai poin?",
    options: ["15 poin", "21 poin", "25 poin", "30 poin"],
    correctAnswer: 1,
    difficulty: "medium",
  },
  {
    categorySlug: "olahraga",
    question: "Negara yang menjadi juara Piala Dunia sepak bola terbanyak sepanjang sejarah adalah?",
    options: ["Jerman", "Argentina", "Brasil", "Italia"],
    correctAnswer: 2,
    difficulty: "medium",
  },
  {
    categorySlug: "olahraga",
    question: "Cabang olahraga yang menggunakan istilah \"smash\", \"deuce\", dan \"love\" adalah?",
    options: ["Bulu tangkis", "Tenis", "Bola voli", "Tenis meja"],
    correctAnswer: 1,
    difficulty: "medium",
  },
  {
    categorySlug: "olahraga",
    question: "Federasi sepak bola dunia disingkat?",
    options: ["FIBA", "FIFA", "IOC", "UEFA"],
    correctAnswer: 1,
    difficulty: "easy",
  },
  {
    categorySlug: "olahraga",
    question: "Cabang olahraga renang gaya yang meniru gerakan katak disebut gaya?",
    options: ["Bebas", "Punggung", "Dada", "Kupu-kupu"],
    correctAnswer: 2,
    difficulty: "easy",
  },
  {
    categorySlug: "olahraga",
    question: "Berapa jumlah pemain dalam satu tim bola voli yang berada di lapangan?",
    options: ["5 pemain", "6 pemain", "7 pemain", "8 pemain"],
    correctAnswer: 1,
    difficulty: "easy",
  },
  {
    categorySlug: "olahraga",
    question: "Rudy Hartono dikenal sebagai legenda bulu tangkis Indonesia yang pernah menjuarai All England sebanyak?",
    options: ["5 kali berturut-turut", "6 kali berturut-turut", "7 kali berturut-turut", "8 kali berturut-turut"],
    correctAnswer: 2,
    difficulty: "hard",
  },
];
