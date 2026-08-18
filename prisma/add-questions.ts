import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Menambahkan 60 soal baru (20 per kategori)...\n");

  const categories = await prisma.category.findMany();
  const agamaId = categories.find((c) => c.slug === "agama")?.id;
  const sejarahId = categories.find((c) => c.slug === "sejarah")?.id;
  const umumId = categories.find((c) => c.slug === "umum")?.id;

  if (!agamaId || !sejarahId || !umumId) {
    throw new Error("Kategori tidak ditemukan!");
  }

  const agamaQuestions = [
    {
      question: "Apa yang dimaksud dengan rukun iman?",
      options: ["Pilar agama Islam", "Pokok-pokok ajaran yang harus diyakini", "Kegiatan ibadah yang wajib dilakukan", "Zakat yang harus dikeluarkan"],
      correctAnswer: 1,
      difficulty: "medium",
    },
    {
      question: "Berapa jumlah rukun Islam?",
      options: ["Tiga", "Empat", "Lima", "Enam"],
      correctAnswer: 2,
      difficulty: "easy",
    },
    {
      question: "Siapa Nabi terakhir dalam agama Islam?",
      options: ["Nabi Nuh AS", "Nabi Isa AS", "Nabi Muhammad SAW", "Nabi Ibrahim AS"],
      correctAnswer: 2,
      difficulty: "easy",
    },
    {
      question: "Apa nama kitab suci yang diturunkan kepada Nabi Muhammad SAW?",
      options: ["Taurat", "Injil", "Al-Qur'an", "Zabur"],
      correctAnswer: 2,
      difficulty: "easy",
    },
    {
      question: "Berapa jumlah surat dalam Al-Qur'an?",
      options: ["112", "113", "114", "115"],
      correctAnswer: 2,
      difficulty: "medium",
    },
    {
      question: "Apa nama bulan suci bagi umat Islam untuk berpuasa?",
      options: ["Rajab", "Syaban", "Ramadan", "Syawal"],
      correctAnswer: 2,
      difficulty: "easy",
    },
    {
      question: "Berapa jumlah rakaat shalat Subuh?",
      options: ["2 rakaat", "3 rakaat", "4 rakaat", "5 rakaat"],
      correctAnswer: 0,
      difficulty: "easy",
    },
    {
      question: "Apa yang harus dilakukan sebelum melakukan shalat?",
      options: ["Makan", "Tidur", "Wudhu", "Belajar"],
      correctAnswer: 2,
      difficulty: "easy",
    },
    {
      question: "Siapa nama ibu Nabi Muhammad SAW?",
      options: ["Siti Aminah", "Siti Khadijah", "Siti Aisyah", "Siti Fatimah"],
      correctAnswer: 0,
      difficulty: "medium",
    },
    {
      question: "Apa nama tempat suci umat Islam yang terletak di Mekkah?",
      options: ["Masjid Al-Aqsa", "Masjid Nabawi", "Masjidil Haram", "Masjid Quba"],
      correctAnswer: 2,
      difficulty: "easy",
    },
    {
      question: "Berapa jumlah malaikat Allah yang wajib diimani?",
      options: ["5", "6", "10", "25"],
      correctAnswer: 1,
      difficulty: "medium",
    },
    {
      question: "Siapakah nama malaikat pembawa wahyu?",
      options: ["Malaikat Mikail", "Malaikat Jibril", "Malaikat Israfil", "Malaikat Izrail"],
      correctAnswer: 1,
      difficulty: "easy",
    },
    {
      question: "Apa nama surat terakhir dalam Al-Qur'an?",
      options: ["Al-Ikhlas", "Al-Falaq", "An-Nas", "Al-Lahab"],
      correctAnswer: 2,
      difficulty: "medium",
    },
    {
      question: "Secara bahasa, apa arti kata 'Islam'?",
      options: ["Damai", "Berserah diri", "Percaya", "Taat"],
      correctAnswer: 1,
      difficulty: "medium",
    },
    {
      question: "Kapan perayaan Idul Fitri dilaksanakan?",
      options: ["1 Ramadan", "1 Syawal", "10 Dzulhijjah", "1 Muharram"],
      correctAnswer: 1,
      difficulty: "easy",
    },
    {
      question: "Rukun Islam yang kedua adalah...",
      options: ["Syahadat", "Shalat", "Zakat", "Puasa"],
      correctAnswer: 1,
      difficulty: "easy",
    },
    {
      question: "Apa yang dimaksud dengan zakat fitrah?",
      options: ["Zakat kekayaan", "Zakat emas", "Zakat menjelang Idul Fitri", "Zakat profesi"],
      correctAnswer: 2,
      difficulty: "medium",
    },
    {
      question: "Siapa khalifah pertama setelah Nabi Muhammad SAW wafat?",
      options: ["Umar bin Khattab", "Abu Bakar As-Siddiq", "Utsman bin Affan", "Ali bin Abi Thalib"],
      correctAnswer: 1,
      difficulty: "medium",
    },
    {
      question: "Apa nama surat pertama dalam Al-Qur'an?",
      options: ["Al-Baqarah", "Al-Fatihah", "An-Nas", "Al-Ikhlas"],
      correctAnswer: 1,
      difficulty: "easy",
    },
    {
      question: "Berapa lama Al-Qur'an diturunkan?",
      options: ["20 tahun", "22 tahun", "23 tahun", "25 tahun"],
      correctAnswer: 2,
      difficulty: "hard",
    },
  ];

  const sejarahQuestions = [
    {
      question: "Tanggal berapa Indonesia merdeka?",
      options: ["16 Agustus 1945", "17 Agustus 1945", "18 Agustus 1945", "19 Agustus 1945"],
      correctAnswer: 1,
      difficulty: "easy",
    },
    {
      question: "Siapa yang membacakan teks Proklamasi Kemerdekaan Indonesia?",
      options: ["Moh. Hatta", "Ir. Soekarno", "Sutan Sjahrir", "Ahmad Soebardjo"],
      correctAnswer: 1,
      difficulty: "easy",
    },
    {
      question: "Di mana naskah Proklamasi dibacakan?",
      options: ["Gedung Joang 45", "Jalan Pegangsaan Timur No. 56", "Istana Merdeka", "Monas"],
      correctAnswer: 1,
      difficulty: "medium",
    },
    {
      question: "Siapa presiden pertama Indonesia?",
      options: ["Soeharto", "Ir. Soekarno", "Habibie", "Megawati"],
      correctAnswer: 1,
      difficulty: "easy",
    },
    {
      question: "Siapa wakil presiden RI pertama?",
      options: ["Adam Malik", "Moh. Hatta", "Try Sutrisno", "Hamzah Haz"],
      correctAnswer: 1,
      difficulty: "easy",
    },
    {
      question: "BPUPKI adalah kepanjangan dari...",
      options: ["Badan Penyelidik Usaha-Usaha Persiapan Kemerdekaan Indonesia", "Badan Pemerintah Umum Persiapan Kemerdekaan Indonesia", "Badan Penyelenggara Umum Persiapan Kemerdekaan Indonesia", "Badan Pembangunan Umum Persiapan Kemerdekaan Indonesia"],
      correctAnswer: 0,
      difficulty: "medium",
    },
    {
      question: "Peristiwa Rengasdengklok terjadi pada tanggal...",
      options: ["15 Agustus 1945", "16 Agustus 1945", "17 Agustus 1945", "18 Agustus 1945"],
      correctAnswer: 1,
      difficulty: "medium",
    },
    {
      question: "Berapa lama Indonesia dijajah Belanda?",
      options: ["3 abad", "3,5 abad", "4 abad", "350 tahun"],
      correctAnswer: 1,
      difficulty: "medium",
    },
    {
      question: "Organisasi pergerakan nasional pertama di Indonesia adalah...",
      options: ["Sarekat Islam", "Budi Utomo", "Indische Partij", "PKI"],
      correctAnswer: 1,
      difficulty: "medium",
    },
    {
      question: "Kongres Pemuda yang menghasilkan Sumpah Pemuda dilaksanakan pada tahun...",
      options: ["1926", "1927", "1928", "1929"],
      correctAnswer: 2,
      difficulty: "medium",
    },
    {
      question: "Siapa pencipta lagu Indonesia Raya?",
      options: ["Ismail Marzuki", "W.R. Supratman", "C. Simanjuntak", "Ibu Sud"],
      correctAnswer: 1,
      difficulty: "easy",
    },
    {
      question: "Agresi Militer Belanda I terjadi pada tanggal...",
      options: ["21 Juli 1947", "19 Desember 1948", "27 Desember 1949", "1 Maret 1949"],
      correctAnswer: 0,
      difficulty: "hard",
    },
    {
      question: "Hari Pahlawan diperingati untuk mengenang peristiwa...",
      options: ["Bandung Lautan Api", "Pertempuran Surabaya", "Serangan Umum 1 Maret", "Proklamasi"],
      correctAnswer: 1,
      difficulty: "medium",
    },
    {
      question: "Kapan Jepang menjajah Indonesia?",
      options: ["1941-1945", "1942-1945", "1943-1945", "1940-1945"],
      correctAnswer: 1,
      difficulty: "medium",
    },
    {
      question: "Siapa tokoh yang dikenal sebagai Bapak Pendidikan Nasional?",
      options: ["R.A. Kartini", "Dewi Sartika", "Ki Hajar Dewantara", "Moh. Yamin"],
      correctAnswer: 2,
      difficulty: "easy",
    },
    {
      question: "Pertempuran 10 November 1945 terjadi di kota...",
      options: ["Jakarta", "Bandung", "Surabaya", "Semarang"],
      correctAnswer: 2,
      difficulty: "easy",
    },
    {
      question: "Konferensi Meja Bundar dilaksanakan di...",
      options: ["Amsterdam", "Den Haag", "Jakarta", "New York"],
      correctAnswer: 1,
      difficulty: "medium",
    },
    {
      question: "Serangan Umum 1 Maret 1949 di Yogyakarta dipimpin oleh...",
      options: ["Jenderal Sudirman", "Letnan Kolonel Soeharto", "Kolonel Nasution", "Kapten Piere Tendean"],
      correctAnswer: 1,
      difficulty: "hard",
    },
    {
      question: "Kerajaan Islam pertama di Indonesia adalah...",
      options: ["Demak", "Samudra Pasai", "Banten", "Mataram"],
      correctAnswer: 1,
      difficulty: "medium",
    },
    {
      question: "Siapa yang menjahit bendera pusaka Indonesia?",
      options: ["R.A. Kartini", "Fatmawati", "Cut Nyak Dien", "Dewi Sartika"],
      correctAnswer: 1,
      difficulty: "medium",
    },
  ];

  const umumQuestions = [
    {
      question: "Siapa pencipta lagu 'Bagimu Negeri'?",
      options: ["W.R. Supratman", "Ismail Marzuki", "Kusbini", "L. Manik"],
      correctAnswer: 2,
      difficulty: "medium",
    },
    {
      question: "Planet terbesar di tata surya kita adalah...",
      options: ["Saturnus", "Jupiter", "Uranus", "Neptunus"],
      correctAnswer: 1,
      difficulty: "easy",
    },
    {
      question: "Berapa jumlah provinsi di Indonesia saat ini?",
      options: ["34", "35", "37", "38"],
      correctAnswer: 3,
      difficulty: "medium",
    },
    {
      question: "Apa nama ibukota negara Australia?",
      options: ["Sydney", "Melbourne", "Canberra", "Perth"],
      correctAnswer: 2,
      difficulty: "medium",
    },
    {
      question: "Burung Garuda melambangkan sila ke berapa dalam Pancasila?",
      options: ["Sila ke-1", "Sila ke-2", "Sila ke-3", "Sila ke-5"],
      correctAnswer: 0,
      difficulty: "medium",
    },
    {
      question: "Apa lambang sila ketiga Pancasila?",
      options: ["Bintang", "Rantai", "Pohon beringin", "Kepala banteng"],
      correctAnswer: 2,
      difficulty: "easy",
    },
    {
      question: "Siapa penemu bola lampu?",
      options: ["Alexander Graham Bell", "Thomas Alva Edison", "Nikola Tesla", "Michael Faraday"],
      correctAnswer: 1,
      difficulty: "easy",
    },
    {
      question: "Pulau terbesar di Indonesia adalah...",
      options: ["Jawa", "Sumatra", "Kalimantan", "Papua"],
      correctAnswer: 3,
      difficulty: "medium",
    },
    {
      question: "ASEAN didirikan pada tanggal...",
      options: ["8 Agustus 1967", "17 Agustus 1967", "8 Juli 1967", "10 Agustus 1967"],
      correctAnswer: 0,
      difficulty: "medium",
    },
    {
      question: "Gunung tertinggi di Indonesia adalah...",
      options: ["Gunung Semeru", "Gunung Kerinci", "Puncak Jaya", "Gunung Rinjani"],
      correctAnswer: 2,
      difficulty: "medium",
    },
    {
      question: "Apa mata uang negara Jepang?",
      options: ["Won", "Yuan", "Yen", "Ringgit"],
      correctAnswer: 2,
      difficulty: "easy",
    },
    {
      question: "Berapa jumlah pemain dalam satu tim sepak bola?",
      options: ["10 orang", "11 orang", "12 orang", "9 orang"],
      correctAnswer: 1,
      difficulty: "easy",
    },
    {
      question: "Apa nama samudra terluas di dunia?",
      options: ["Samudra Atlantik", "Samudra Hindia", "Samudra Pasifik", "Samudra Arktik"],
      correctAnswer: 2,
      difficulty: "easy",
    },
    {
      question: "Siapa presiden Amerika Serikat yang pertama?",
      options: ["Abraham Lincoln", "George Washington", "Thomas Jefferson", "John Adams"],
      correctAnswer: 1,
      difficulty: "medium",
    },
    {
      question: "Apa nama hewan yang dijuluki 'Raja Hutan'?",
      options: ["Harimau", "Beruang", "Singa", "Serigala"],
      correctAnswer: 2,
      difficulty: "easy",
    },
    {
      question: "Berapa jumlah huruf dalam abjad bahasa Indonesia?",
      options: ["24", "25", "26", "27"],
      correctAnswer: 2,
      difficulty: "easy",
    },
    {
      question: "Apa nama ibukota negara Mesir?",
      options: ["Kairo", "Alexandria", "Giza", "Luxor"],
      correctAnswer: 0,
      difficulty: "medium",
    },
    {
      question: "Siapa tokoh yang dijuluki 'Bapak Teknologi Indonesia'?",
      options: ["B.J. Habibie", "Ir. Soekarno", "Prof. Sedyatmo", "R.J. Katili"],
      correctAnswer: 0,
      difficulty: "medium",
    },
    {
      question: "Apa nama benua terkecil di dunia?",
      options: ["Eropa", "Australia", "Antartika", "Amerika Selatan"],
      correctAnswer: 1,
      difficulty: "medium",
    },
    {
      question: "Berapakah hasil dari 12 x 12?",
      options: ["124", "134", "144", "154"],
      correctAnswer: 2,
      difficulty: "easy",
    },
  ];

  console.log("📖 Menambahkan 20 soal Agama...");
  for (const q of agamaQuestions) {
    await prisma.question.create({
      data: {
        categoryId: agamaId,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        difficulty: q.difficulty,
      },
    });
  }
  console.log("✅ Selesai menambahkan soal Agama\n");

  console.log("📜 Menambahkan 20 soal Sejarah...");
  for (const q of sejarahQuestions) {
    await prisma.question.create({
      data: {
        categoryId: sejarahId,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        difficulty: q.difficulty,
      },
    });
  }
  console.log("✅ Selesai menambahkan soal Sejarah\n");

  console.log("🌍 Menambahkan 20 soal Pengetahuan Umum...");
  for (const q of umumQuestions) {
    await prisma.question.create({
      data: {
        categoryId: umumId,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        difficulty: q.difficulty,
      },
    });
  }
  console.log("✅ Selesai menambahkan soal Pengetahuan Umum\n");

  const agamaCount = await prisma.question.count({ where: { categoryId: agamaId } });
  const sejarahCount = await prisma.question.count({ where: { categoryId: sejarahId } });
  const umumCount = await prisma.question.count({ where: { categoryId: umumId } });

  console.log("🎉 SELESAI! Total soal per kategori:");
  console.log(`   - Agama: ${agamaCount} soal`);
  console.log(`   - Sejarah: ${sejarahCount} soal`);
  console.log(`   - Pengetahuan Umum: ${umumCount} soal`);
  console.log(`   - TOTAL: ${agamaCount + sejarahCount + umumCount} soal`);
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
