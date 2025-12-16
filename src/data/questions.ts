import { Question } from "@/context/types";

/**
 * Database Soal untuk Qurio MVP
 * Total: 60 soal (20 per kategori)
 */

export const questions: Question[] = [
  // ==================== KATEGORI: AGAMA ====================
  {
    id: "agama-1",
    category: "agama",
    question: "Berapa jumlah rakaat sholat Maghrib?",
    options: ["2 rakaat", "3 rakaat", "4 rakaat", "5 rakaat"],
    correctAnswer: 1,
  },
  {
    id: "agama-2",
    category: "agama",
    question: "Rukun Islam yang keempat adalah?",
    options: ["Sholat", "Puasa Ramadan", "Zakat", "Haji"],
    correctAnswer: 2,
  },
  {
    id: "agama-3",
    category: "agama",
    question: "Kitab suci umat Islam adalah?",
    options: ["Taurat", "Injil", "Al-Quran", "Zabur"],
    correctAnswer: 2,
  },
  {
    id: "agama-4",
    category: "agama",
    question: "Nabi terakhir yang diutus Allah SWT adalah?",
    options: ["Nabi Isa AS", "Nabi Musa AS", "Nabi Ibrahim AS", "Nabi Muhammad SAW"],
    correctAnswer: 3,
  },
  {
    id: "agama-5",
    category: "agama",
    question: "Bulan suci umat Islam untuk berpuasa adalah?",
    options: ["Rajab", "Syawal", "Ramadan", "Muharram"],
    correctAnswer: 2,
  },
  {
    id: "agama-6",
    category: "agama",
    question: "Jumlah surat dalam Al-Quran adalah?",
    options: ["100 surat", "114 surat", "120 surat", "130 surat"],
    correctAnswer: 1,
  },
  {
    id: "agama-7",
    category: "agama",
    question: "Kiblat umat Islam dalam sholat menghadap ke?",
    options: ["Ka'bah di Mekah", "Masjid Nabawi", "Masjid Al-Aqsa", "Gunung Sinai"],
    correctAnswer: 0,
  },
  {
    id: "agama-8",
    category: "agama",
    question: "Malaikat yang bertugas meniup sangkakala adalah?",
    options: ["Malaikat Jibril", "Malaikat Mikail", "Malaikat Israfil", "Malaikat Izrail"],
    correctAnswer: 2,
  },
  {
    id: "agama-9",
    category: "agama",
    question: "Zakat fitrah ditunaikan pada bulan?",
    options: ["Ramadan", "Syawal", "Rajab", "Dzulhijjah"],
    correctAnswer: 0,
  },
  {
    id: "agama-10",
    category: "agama",
    question: "Surat pertama dalam Al-Quran adalah?",
    options: ["Al-Baqarah", "Al-Fatihah", "An-Nas", "Al-Ikhlas"],
    correctAnswer: 1,
  },
  {
    id: "agama-11",
    category: "agama",
    question: "Berapa kali umat Islam sholat wajib dalam sehari?",
    options: ["3 kali", "4 kali", "5 kali", "6 kali"],
    correctAnswer: 2,
  },
  {
    id: "agama-12",
    category: "agama",
    question: "Hari raya umat Islam setelah Ramadan adalah?",
    options: ["Idul Fitri", "Idul Adha", "Maulid Nabi", "Isra Mi'raj"],
    correctAnswer: 0,
  },
  {
    id: "agama-13",
    category: "agama",
    question: "Nabi yang membelah laut adalah?",
    options: ["Nabi Nuh AS", "Nabi Musa AS", "Nabi Yunus AS", "Nabi Sulaiman AS"],
    correctAnswer: 1,
  },
  {
    id: "agama-14",
    category: "agama",
    question: "Hukum berpuasa di bulan Ramadan bagi orang dewasa yang mampu adalah?",
    options: ["Sunnah", "Makruh", "Wajib", "Mubah"],
    correctAnswer: 2,
  },
  {
    id: "agama-15",
    category: "agama",
    question: "Jumlah malaikat yang wajib diimani adalah?",
    options: ["5 malaikat", "8 malaikat", "10 malaikat", "12 malaikat"],
    correctAnswer: 2,
  },
  {
    id: "agama-16",
    category: "agama",
    question: "Rukun iman yang pertama adalah?",
    options: ["Iman kepada Malaikat", "Iman kepada Rasul", "Iman kepada Allah SWT", "Iman kepada Kitab"],
    correctAnswer: 2,
  },
  {
    id: "agama-17",
    category: "agama",
    question: "Surat terpanjang dalam Al-Quran adalah?",
    options: ["Al-Fatihah", "Al-Baqarah", "Ali Imran", "An-Nisa"],
    correctAnswer: 1,
  },
  {
    id: "agama-18",
    category: "agama",
    question: "Kota kelahiran Nabi Muhammad SAW adalah?",
    options: ["Madinah", "Mekah", "Thaif", "Damaskus"],
    correctAnswer: 1,
  },
  {
    id: "agama-19",
    category: "agama",
    question: "Istri pertama Nabi Muhammad SAW adalah?",
    options: ["Aisyah RA", "Khadijah RA", "Fatimah RA", "Hafsah RA"],
    correctAnswer: 1,
  },
  {
    id: "agama-20",
    category: "agama",
    question: "Jumlah juz dalam Al-Quran adalah?",
    options: ["25 juz", "28 juz", "30 juz", "32 juz"],
    correctAnswer: 2,
  },

  // ==================== KATEGORI: SEJARAH ====================
  {
    id: "sejarah-1",
    category: "sejarah",
    question: "Proklamasi kemerdekaan Indonesia dibacakan pada tanggal?",
    options: ["16 Agustus 1945", "17 Agustus 1945", "18 Agustus 1945", "19 Agustus 1945"],
    correctAnswer: 1,
  },
  {
    id: "sejarah-2",
    category: "sejarah",
    question: "Presiden pertama Indonesia adalah?",
    options: ["Soeharto", "BJ Habibie", "Soekarno", "Megawati"],
    correctAnswer: 2,
  },
  {
    id: "sejarah-3",
    category: "sejarah",
    question: "Kerajaan Hindu pertama di Indonesia adalah?",
    options: ["Majapahit", "Sriwijaya", "Kutai", "Mataram"],
    correctAnswer: 2,
  },
  {
    id: "sejarah-4",
    category: "sejarah",
    question: "Pahlawan yang dijuluki 'Bapak Pendidikan Indonesia' adalah?",
    options: ["RA Kartini", "Ki Hajar Dewantara", "Cut Nyak Dien", "Diponegoro"],
    correctAnswer: 1,
  },
  {
    id: "sejarah-5",
    category: "sejarah",
    question: "Perang Dunia II berakhir pada tahun?",
    options: ["1943", "1944", "1945", "1946"],
    correctAnswer: 2,
  },
  {
    id: "sejarah-6",
    category: "sejarah",
    question: "Candi Borobudur dibangun pada masa kerajaan?",
    options: ["Majapahit", "Sriwijaya", "Sailendra", "Singasari"],
    correctAnswer: 2,
  },
  {
    id: "sejarah-7",
    category: "sejarah",
    question: "Penjajah pertama yang datang ke Indonesia adalah?",
    options: ["Belanda", "Inggris", "Portugis", "Jepang"],
    correctAnswer: 2,
  },
  {
    id: "sejarah-8",
    category: "sejarah",
    question: "Hari Sumpah Pemuda diperingati pada tanggal?",
    options: ["17 Agustus", "28 Oktober", "20 Mei", "10 November"],
    correctAnswer: 1,
  },
  {
    id: "sejarah-9",
    category: "sejarah",
    question: "Siapa yang merancang teks Proklamasi Indonesia?",
    options: ["Soekarno", "Mohammad Hatta", "Soekarno-Hatta", "Ahmad Soebardjo"],
    correctAnswer: 2,
  },
  {
    id: "sejarah-10",
    category: "sejarah",
    question: "VOC didirikan oleh negara mana?",
    options: ["Inggris", "Portugis", "Belanda", "Spanyol"],
    correctAnswer: 2,
  },
  {
    id: "sejarah-11",
    category: "sejarah",
    question: "Peristiwa Rengasdengklok terjadi pada tanggal?",
    options: ["15 Agustus 1945", "16 Agustus 1945", "17 Agustus 1945", "18 Agustus 1945"],
    correctAnswer: 1,
  },
  {
    id: "sejarah-12",
    category: "sejarah",
    question: "Kerajaan Islam terbesar di Nusantara adalah?",
    options: ["Demak", "Mataram Islam", "Aceh", "Banten"],
    correctAnswer: 1,
  },
  {
    id: "sejarah-13",
    category: "sejarah",
    question: "Siapa pemimpin Belanda yang terkenal kejam di Indonesia?",
    options: ["Jan Pieterszoon Coen", "Herman Willem Daendels", "Van den Bosch", "Cornelis de Houtman"],
    correctAnswer: 0,
  },
  {
    id: "sejarah-14",
    category: "sejarah",
    question: "Pertempuran 10 November 1945 terjadi di kota?",
    options: ["Jakarta", "Bandung", "Surabaya", "Semarang"],
    correctAnswer: 2,
  },
  {
    id: "sejarah-15",
    category: "sejarah",
    question: "Nama organisasi pemuda yang menculik Soekarno-Hatta ke Rengasdengklok adalah?",
    options: ["Pemuda Indonesia", "Menteng 31", "PETA", "Seinendan"],
    correctAnswer: 1,
  },
  {
    id: "sejarah-16",
    category: "sejarah",
    question: "Konferensi Asia-Afrika diadakan di kota?",
    options: ["Jakarta", "Bandung", "Bogor", "Yogyakarta"],
    correctAnswer: 1,
  },
  {
    id: "sejarah-17",
    category: "sejarah",
    question: "Sumpah Pemuda dibacakan pada tahun?",
    options: ["1926", "1927", "1928", "1929"],
    correctAnswer: 2,
  },
  {
    id: "sejarah-18",
    category: "sejarah",
    question: "Raja Majapahit yang paling terkenal adalah?",
    options: ["Ken Arok", "Hayam Wuruk", "Kertanegara", "Wijaya"],
    correctAnswer: 1,
  },
  {
    id: "sejarah-19",
    category: "sejarah",
    question: "Perang Padri terjadi di daerah?",
    options: ["Jawa", "Sumatera Barat", "Sulawesi", "Kalimantan"],
    correctAnswer: 1,
  },
  {
    id: "sejarah-20",
    category: "sejarah",
    question: "Pahlawan wanita yang berasal dari Aceh adalah?",
    options: ["RA Kartini", "Dewi Sartika", "Cut Nyak Dien", "Martha Christina Tiahahu"],
    correctAnswer: 2,
  },

  // ==================== KATEGORI: PENGETAHUAN UMUM ====================
  {
    id: "umum-1",
    category: "umum",
    question: "Planet terdekat dengan Matahari adalah?",
    options: ["Venus", "Mars", "Merkurius", "Bumi"],
    correctAnswer: 2,
  },
  {
    id: "umum-2",
    category: "umum",
    question: "Ibukota Indonesia adalah?",
    options: ["Surabaya", "Jakarta", "Bandung", "Medan"],
    correctAnswer: 1,
  },
  {
    id: "umum-3",
    category: "umum",
    question: "Berapa jumlah benua di dunia?",
    options: ["5", "6", "7", "8"],
    correctAnswer: 2,
  },
  {
    id: "umum-4",
    category: "umum",
    question: "Siapa penemu lampu pijar?",
    options: ["Alexander Graham Bell", "Thomas Alva Edison", "Nikola Tesla", "Benjamin Franklin"],
    correctAnswer: 1,
  },
  {
    id: "umum-5",
    category: "umum",
    question: "Negara dengan populasi terbanyak di dunia adalah?",
    options: ["India", "Amerika Serikat", "Indonesia", "China"],
    correctAnswer: 3,
  },
  {
    id: "umum-6",
    category: "umum",
    question: "Gas yang diperlukan tumbuhan untuk fotosintesis adalah?",
    options: ["Oksigen", "Nitrogen", "Karbon Dioksida", "Hidrogen"],
    correctAnswer: 2,
  },
  {
    id: "umum-7",
    category: "umum",
    question: "Organ tubuh manusia yang berfungsi memompa darah adalah?",
    options: ["Paru-paru", "Hati", "Jantung", "Ginjal"],
    correctAnswer: 2,
  },
  {
    id: "umum-8",
    category: "umum",
    question: "Negara yang dijuluki 'Negeri Matahari Terbit' adalah?",
    options: ["China", "Korea Selatan", "Jepang", "Thailand"],
    correctAnswer: 2,
  },
  {
    id: "umum-9",
    category: "umum",
    question: "Berapa jumlah pemain dalam satu tim sepak bola?",
    options: ["9 orang", "10 orang", "11 orang", "12 orang"],
    correctAnswer: 2,
  },
  {
    id: "umum-10",
    category: "umum",
    question: "Hewan yang dikenal sebagai 'Raja Hutan' adalah?",
    options: ["Harimau", "Singa", "Beruang", "Serigala"],
    correctAnswer: 1,
  },
  {
    id: "umum-11",
    category: "umum",
    question: "Titik didih air dalam derajat Celcius adalah?",
    options: ["90°C", "95°C", "100°C", "105°C"],
    correctAnswer: 2,
  },
  {
    id: "umum-12",
    category: "umum",
    question: "Bahasa resmi PBB yang paling banyak digunakan adalah?",
    options: ["Mandarin", "Spanyol", "Inggris", "Prancis"],
    correctAnswer: 2,
  },
  {
    id: "umum-13",
    category: "umum",
    question: "Lapisan atmosfer terdekat dengan Bumi adalah?",
    options: ["Stratosfer", "Mesosfer", "Troposfer", "Termosfer"],
    correctAnswer: 2,
  },
  {
    id: "umum-14",
    category: "umum",
    question: "Piramida Giza terletak di negara?",
    options: ["Yunani", "Mesir", "Italia", "Iran"],
    correctAnswer: 1,
  },
  {
    id: "umum-15",
    category: "umum",
    question: "Warna yang dihasilkan dari campuran merah dan kuning adalah?",
    options: ["Hijau", "Ungu", "Oranye", "Coklat"],
    correctAnswer: 2,
  },
  {
    id: "umum-16",
    category: "umum",
    question: "Gunung tertinggi di dunia adalah?",
    options: ["Gunung Kilimanjaro", "Gunung Everest", "Gunung Fuji", "Gunung Semeru"],
    correctAnswer: 1,
  },
  {
    id: "umum-17",
    category: "umum",
    question: "Samudra terluas di Bumi adalah?",
    options: ["Samudra Atlantik", "Samudra Hindia", "Samudra Pasifik", "Samudra Arktik"],
    correctAnswer: 2,
  },
  {
    id: "umum-18",
    category: "umum",
    question: "Gas yang paling banyak di atmosfer Bumi adalah?",
    options: ["Oksigen", "Karbon dioksida", "Nitrogen", "Hidrogen"],
    correctAnswer: 2,
  },
  {
    id: "umum-19",
    category: "umum",
    question: "Siapa penemu lampu pijar?",
    options: ["Albert Einstein", "Thomas Alva Edison", "Nikola Tesla", "Alexander Graham Bell"],
    correctAnswer: 1,
  },
  {
    id: "umum-20",
    category: "umum",
    question: "Berapa jumlah warna dalam pelangi?",
    options: ["5 warna", "6 warna", "7 warna", "8 warna"],
    correctAnswer: 2,
  },
];

/**
 * Helper function untuk filter soal by category
 */
export function getQuestionsByCategory(category: "agama" | "sejarah" | "umum"): Question[] {
  return questions.filter((q) => q.category === category);
}

/**
 * Helper function untuk shuffle array (Fisher-Yates algorithm)
 */
export function shuffleQuestions(questions: Question[]): Question[] {
  const shuffled = [...questions];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Helper function untuk shuffle options dalam soal
 */
export function shuffleQuestionOptions(question: Question): Question {
  const optionsWithIndex = question.options.map((opt, idx) => ({ opt, idx }));
  
  // Shuffle options
  for (let i = optionsWithIndex.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [optionsWithIndex[i], optionsWithIndex[j]] = [optionsWithIndex[j], optionsWithIndex[i]];
  }
  
  // Find new correct answer index
  const newCorrectIndex = optionsWithIndex.findIndex(item => item.idx === question.correctAnswer);
  
  return {
    ...question,
    options: optionsWithIndex.map(item => item.opt),
    correctAnswer: newCorrectIndex,
  };
}
