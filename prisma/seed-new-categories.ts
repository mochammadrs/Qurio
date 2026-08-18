import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type NewQuestion = {
  categorySlug: string;
  question: string;
  options: [string, string, string, string];
  correctAnswer: number;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
};

const newCategories = [
  {
    slug: "geografi",
    name: "Geografi",
    description: "Uji wawasan geografi Indonesia & dunia — dari bendungan hingga benua.",
    emoji: "🌏",
  },
  {
    slug: "bahasa-sastra",
    name: "Bahasa & Sastra Indonesia",
    description: "Dari peribahasa, EYD, hingga karya sastra klasik dan penulis legendaris.",
    emoji: "📖",
  },
  {
    slug: "olahraga",
    name: "Olahraga",
    description: "Seputar aturan dasar, tokoh, dan sejarah olahraga populer di Indonesia & dunia.",
    emoji: "⚽",
  },
];

const newQuestions: NewQuestion[] = [
  { categorySlug: "geografi", question: "Gunung tertinggi di Indonesia adalah?", options: ["Gunung Kerinci", "Puncak Jaya", "Gunung Rinjani", "Gunung Semeru"], correctAnswer: 1, explanation: "Puncak Jaya (Carstensius) di Papua adalah puncak tertinggi Indonesia dengan ketinggian 4.884 m.", difficulty: "medium" },
  { categorySlug: "geografi", question: "Ibu kota negara Jepang adalah?", options: ["Osaka", "Kyoto", "Tokyo", "Yokohama"], correctAnswer: 2, explanation: "Tokyo adalah ibukota Jepang dan pusat pemerintahan terpadu sejak 1868.", difficulty: "easy" },
  { categorySlug: "geografi", question: "Selat yang memisahkan Pulau Sumatera dan Pulau Jawa adalah?", options: ["Selat Bali", "Selat Sunda", "Selat Karimata", "Selat Malaka"], correctAnswer: 1, explanation: "Selat Sunda memisahkan Pulau Sumatera (barat) dan Pulau Jawa (timur).", difficulty: "easy" },
  { categorySlug: "geografi", question: "Sungai terpanjang di dunia adalah?", options: ["Sungai Amazon", "Sungai Nil", "Sungai Yangtze", "Sungai Mississippi"], correctAnswer: 1, explanation: "Sungai Nil di Mesir/Africa diresmikan sebagai sungai terpanjang (~6.650 km), melebihi Amazon.", difficulty: "medium" },
  { categorySlug: "geografi", question: "Provinsi paling timur di Indonesia adalah?", options: ["Maluku Utara", "Papua Selatan", "Papua", "Papua Pegunungan"], correctAnswer: 2, explanation: "Provinsi Papua adalah provinsi paling timur di Indonesia.", difficulty: "hard" },
  { categorySlug: "geografi", question: "Benua terkecil di dunia adalah?", options: ["Eropa", "Antartika", "Australia", "Amerika Selatan"], correctAnswer: 2, explanation: "Australia (kontinen) adalah benua terkecil dengan luas ~7,692,030 km².", difficulty: "easy" },
  { categorySlug: "geografi", question: "Danau terbesar di Indonesia adalah?", options: ["Danau Singkarak", "Danau Toba", "Danau Poso", "Danau Maninjau"], correctAnswer: 1, explanation: "Danau Toba di Sumatera Utara adalah danau vulkanik terbesar di Indonesia.", difficulty: "easy" },
  { categorySlug: "geografi", question: "Negara dengan populasi terbanyak di dunia adalah?", options: ["Tiongkok", "Amerika Serikat", "India", "Indonesia"], correctAnswer: 2, explanation: "India berjumlah ~1,44 milyar jiwa, melebihi Tiongkok (~1,42 milyar) perkiraan 2023.", difficulty: "medium" },
  { categorySlug: "geografi", question: "Kota Bandung berada di provinsi?", options: ["Jawa Tengah", "Jawa Timur", "Banten", "Jawa Barat"], correctAnswer: 3, explanation: "Bandung, ibukota Jawa Barat, terletak di dataran tinggi kawasan Bandung.", difficulty: "easy" },
  { categorySlug: "geografi", question: "Gurun terluas di dunia adalah?", options: ["Gurun Sahara", "Gurun Gobi", "Gurun Antartika", "Gurun Arabia"], correctAnswer: 2, explanation: "Gurun Antartika adalah gurun pasir kutu kering terluas di dunia (~14 juta km²).", difficulty: "hard" },
  { categorySlug: "geografi", question: "Garis khayal yang membagi bumi menjadi belahan utara dan selatan disebut?", options: ["Garis Bujur", "Garis Khatulistiwa", "Garis Meridian", "Garis Wallace"], correctAnswer: 1, explanation: "Garis khatulistiwa membagi bumi menjadi belahan utara dan selatan.", difficulty: "easy" },
  { categorySlug: "geografi", question: "Kepulauan Raja Ampat terletak di provinsi?", options: ["Maluku", "Papua Barat", "Papua", "Sulawesi Utara"], correctAnswer: 1, explanation: "Kepulauan Raja Ampat terletak di provinsi Papua Barat, dikenal keanekarilibatananya.", difficulty: "medium" },
  { categorySlug: "geografi", question: "Samudra terluas di dunia adalah?", options: ["Samudra Atlantik", "Samudra Hindia", "Samudra Pasifik", "Samudra Arktik"], correctAnswer: 2, explanation: "Samudra Pasifik adalah samudra terluas dan terdalam di dunia.", difficulty: "easy" },
  { categorySlug: "geografi", question: "Garis Wallace adalah garis yang memisahkan fauna Indonesia bagian barat dan?", options: ["Bagian utara", "Bagian tengah", "Bagian timur", "Bagian selatan"], correctAnswer: 1, explanation: "Garis Wallace memisahkan fauna Asia (barat) dan Australia (timur) di Indonesia.", difficulty: "hard" },
  { categorySlug: "geografi", question: "Negara terluas di dunia berdasarkan luas wilayah adalah?", options: ["Kanada", "Tiongkok", "Amerika Serikat", "Rusia"], correctAnswer: 3, explanation: "Rusia adalah negara terluas di dunia dengan luas ~17,1 juta km².", difficulty: "medium" },
  { categorySlug: "bahasa-sastra", question: "Novel \"Laskar Pelangi\" ditulis oleh?", options: ["Pramoedya Ananta Toer", "Andrea Hirata", "Tere Liye", "Ahmad Tohari"], correctAnswer: 1, explanation: "Andrea Hirata menulis Laskar Pelangi, romantisasi kisah anak-anak Belitung.", difficulty: "easy" },
  { categorySlug: "bahasa-sastra", question: "Peribahasa \"Air susu dibalas air tuba\" memiliki arti?", options: ["Kebaikan dibalas dengan kebaikan", "Kebaikan dibalas dengan kejahatan", "Kejahatan dibalas dengan kejahatan", "Bekerja sama untuk kebaikan bersama"], correctAnswer: 1, explanation: "Peribahasa ini berarti kebaikan akan dibalas dengan kejahatan.", difficulty: "medium" },
  { categorySlug: "bahasa-sastra", question: "Siapa penulis novel \"Bumi Manusia\"?", options: ["Pramoedya Ananta Toer", "Chairil Anwar", "W.S. Rendra", "Sutan Takdir Alisjahbana"], correctAnswer: 0, explanation: "Bumi Manusia adalah novel terjual Pramoedya Ananta Toer, pertama dari tetralogi Buru.", difficulty: "medium" },
  { categorySlug: "bahasa-sastra", question: "Chairil Anwar dikenal sebagai tokoh sastra Indonesia di bidang?", options: ["Prosa", "Drama", "Puisi", "Esai"], correctAnswer: 2, explanation: "Chairil Anwar adalah penyair, dikenal sebagai pelukis puisi dalam Angkatan 45.", difficulty: "medium" },
  { categorySlug: "bahasa-sastra", question: "Kata baku yang benar untuk kata tidak baku \"apotik\" adalah?", options: ["Apotek", "Apotic", "Apotheek", "Apotique"], correctAnswer: 0, explanation: "Apotek adalah ejaan yang disempurnakan (EYD) untuk kata tak terstandarisasi 'apotik'.", difficulty: "easy" },
  { categorySlug: "bahasa-sastra", question: "Puisi \"Aku\" yang terkenal dengan larik \"Aku ini binatang jalang\" ditulis oleh?", options: ["W.S. Rendra", "Chairil Anwar", "Sapardi Djoko Damono", "Taufiq Ismail"], correctAnswer: 1, explanation: "Aku adalah puisi Chairil Anwar, bagian dari kumpulannya 'Kaktus Berduri'.", difficulty: "medium" },
  { categorySlug: "bahasa-sastra", question: "Karya sastra klasik \"Sitti Nurbaya\" ditulis oleh?", options: ["Marah Rusli", "Abdul Muis", "Merari Siregar", "Sutan Takdir Alisjahbana"], correctAnswer: 0, explanation: "Sitti Nurbaya ditulis oleh Marah Rusli, karya sastra realistis pertama Indonesia.", difficulty: "hard" },
  { categorySlug: "bahasa-sastra", question: "Peribahasa \"Bagai pungguk merindukan bulan\" menggambarkan?", options: ["Keinginan yang mustahil tercapai", "Kerja keras yang berbuah manis", "Kesabaran dalam penantian", "Kegembiraan yang berlebihan"], correctAnswer: 0, explanation: "Peribahasa ini menggambarkan keinginan yang mustahil karena perbedaan posisi.", difficulty: "medium" },
  { categorySlug: "bahasa-sastra", question: "Bentuk pantun terdiri dari berapa baris dalam satu bait?", options: ["Dua baris", "Tiga baris", "Empat baris", "Lima baris"], correctAnswer: 2, explanation: "Pantun terdiri dari 4 baris (dua bait syair, sehari dan salingan).", difficulty: "easy" },
  { categorySlug: "bahasa-sastra", question: "Ejaan Yang Disempurnakan (EYD) kini telah digantikan dengan pedoman ejaan bernama?", options: ["Ejaan Bahasa Indonesia (EBI)", "Ejaan Van Ophuijsen", "Ejaan Republik", "Ejaan Soewandi"], correctAnswer: 0, explanation: "EBI (Ejaan Bahasa Indonesia) adalah pedoman ejaan resmi, diganti EYD pada 1972.", difficulty: "hard" },
  { categorySlug: "bahasa-sastra", question: "Sapardi Djoko Damono terkenal dengan puisi cintanya yang berjudul?", options: ["Sajak Putih", "Aku Ingin", "Doa", "Diponegoro"], correctAnswer: 1, explanation: "Aku Ingin adalah salah satu puisi cinta terkenal Sapardi, dari 'Aku' dan lainnya.", difficulty: "medium" },
  { categorySlug: "bahasa-sastra", question: "Kalimat yang menggunakan majas hiperbola adalah?", options: ["Dia berjalan dengan cepat", "Suaranya menggelegar membelah bumi", "Hari ini cuaca cerah", "Buku itu berwarna merah"], correctAnswer: 1, explanation: "Hiperbola membesar-besarkan sesuatu berlebihan; 'membelah bumi' adalah contoh hiperbola.", difficulty: "medium" },
  { categorySlug: "bahasa-sastra", question: "Cerita rakyat \"Malin Kundang\" berasal dari daerah?", options: ["Jawa Barat", "Sumatera Barat", "Kalimantan Selatan", "Sulawesi Selatan"], correctAnswer: 0, explanation: "Malin Kundang adalah cerita rakyat Minangkabau (Sumatera Barat) yang melegenda.", difficulty: "easy" },
  { categorySlug: "bahasa-sastra", question: "Angkatan sastra yang dipelopori oleh Chairil Anwar dikenal dengan nama?", options: ["Angkatan Balai Pustaka", "Angkatan Pujangga Baru", "Angkatan 45", "Angkatan 66"], correctAnswer: 2, explanation: "Angkatan '45 adalah generasi sastra usai perang kemerdekaan, dipimpin Chairil Anwar.", difficulty: "hard" },
  { categorySlug: "bahasa-sastra", question: "Kata \"nirlaba\" memiliki arti?", options: ["Mencari untung", "Tidak mencari keuntungan", "Kerugian besar", "Modal usaha"], correctAnswer: 1, explanation: "Nirlaba artinya tidak menguntungkan, tidak mencari keuntungan.", difficulty: "medium" },
  { categorySlug: "olahraga", question: "Cabang olahraga yang menjadi kebanggaan Indonesia di ajang Olimpiade adalah?", options: ["Renang", "Bulu tangkis", "Atletik", "Angkat besi"], correctAnswer: 1, explanation: "Bulu tangkis Indonesia unggul di Olimpiade, dengan banyak medali.", difficulty: "easy" },
  { categorySlug: "olahraga", question: "Berapa jumlah pemain dalam satu tim sepak bola yang berada di lapangan?", options: ["9 pemain", "10 pemain", "11 pemain", "12 pemain"], correctAnswer: 2, explanation: "Dalam pertandingan resmi, 11 pemain di lapangan termasuk keeper.", difficulty: "easy" },
  { categorySlug: "olahraga", question: "Olimpiade modern pertama kali diselenggarakan di kota?", options: ["Paris", "Athena", "London", "Roma"], correctAnswer: 0, explanation: "Olimpiade modern pertama digelar di Paris, Prancis pada 1896 (dibatalkan karena wabah, dilanjutkan di Athena 1900).", difficulty: "medium" },
  { categorySlug: "olahraga", question: "Induk organisasi bulu tangkis dunia disingkat?", options: ["FIFA", "FIBA", "BWF", "IOC"], correctAnswer: 2, explanation: "Badminton World Federation (BWF) adalah induk organisasi bulu tangkis dunia.", difficulty: "medium" },
  { categorySlug: "olahraga", question: "Susi Susanti adalah legenda bulu tangkis Indonesia yang meraih emas Olimpiade pertama untuk Indonesia pada tahun?", options: ["1988", "1992", "1996", "2000"], correctAnswer: 1, explanation: "Susi Susanti menyumbangkan emas Olimpiade 1992 di Barcelona bagi Indonesia.", difficulty: "hard" },
  { categorySlug: "olahraga", question: "Berapa lama durasi satu babak dalam pertandingan sepak bola resmi?", options: ["30 menit", "40 menit", "45 menit", "50 menit"], correctAnswer: 2, explanation: "Satu babak sepak bola resmi berlangsung 45 menit, dua babak = 90 menit.", difficulty: "easy" },
  { categorySlug: "olahraga", question: "Cabang olahraga bela diri asli Indonesia adalah?", options: ["Karate", "Taekwondo", "Pencak Silat", "Judo"], correctAnswer: 2, explanation: "Pencak silat adalah seni bela diri asli Indonesia yang sudah ada sejak abad ke-13.", difficulty: "easy" },
  { categorySlug: "olahraga", question: "Ajang olahraga multievent negara-negara Asia Tenggara disebut?", options: ["Asian Games", "SEA Games", "Olimpiade", "Piala AFF"], correctAnswer: 1, explanation: "SEA Games (Southeast Asian Games) adalah ajang Multi-Event Asia Tenggara.", difficulty: "easy" },
  { categorySlug: "olahraga", question: "Dalam bulu tangkis, skor kemenangan satu game ditentukan saat pemain mencapai poin?", options: ["15 poin", "21 poin", "25 poin", "30 poin"], correctAnswer: 1, explanation: "Di bulu tangkis, satu game dimenangkan dengan mencapai 21 poin.", difficulty: "medium" },
  { categorySlug: "olahraga", question: "Negara yang dijuluki 'Negeri Matahari Terbit' adalah?", options: ["Jepang", "Tiongkok", "Korea Selatan", "India"], correctAnswer: 0, explanation: "Jepang (Nihon) berarti 'Pamanahan Matahari' atau 'Negeri Matahari Terbit'.", difficulty: "medium" },
  { categorySlug: "olahraga", question: "Federasi sepak bola dunia disingkat?", options: ["FIBA", "FIFA", "IOC", "UEFA"], correctAnswer: 1, explanation: "FIFA (Fédération Internationale de Football Association) adalah federasi sepak bola dunia.", difficulty: "easy" },
  { categorySlug: "olahraga", question: "Cabang olahraga renang gaya yang meniru gerakan katak disebut gaya?", options: ["Bebas", "Punggung", "Dada", "Kupu-kupu"], correctAnswer: 2, explanation: "Gaya dada meniru gerakan katak, satu dari empat gaya renang resmi.", difficulty: "easy" },
  { categorySlug: "olahraga", question: "Berapa jumlah pemain dalam satu tim bola voli yang berada di lapangan?", options: ["5 pemain", "6 pemain", "7 pemain", "8 pemain"], correctAnswer: 1, explanation: "Satu tim bola voli memiliki 6 pemain di lapangan (3 depan, 3 belakang).", difficulty: "easy" },
  { categorySlug: "olahraga", question: "Rudy Hartono dikenal sebagai legenda bulu tangkis Indonesia yang pernah menjuarai All England sebanyak?", options: ["5 kali berturut-turut", "6 kali berturut-turut", "7 kali berturut-turut", "8 kali berturut-turut"], correctAnswer: 2, explanation: "Rudy Hartono memenangkan All England 7 kali (1968-1974).", difficulty: "hard" },
];

async function main() {
  console.log("🌍 Menambahkan 3 kategori baru + 45 soal...\n");

  for (const cat of newCategories) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
    console.log(`✅ Kategori: ${cat.name} (${cat.slug}) → ${created.id}`);
  }

  const categoryMap = await prisma.category.findMany();
  const slugToId = Object.fromEntries(categoryMap.map((c) => [c.slug, c.id]));

  const categoryCounters: Record<string, number> = {};
  let totalInserted = 0;
  for (const q of newQuestions) {
    const categoryId = slugToId[q.categorySlug];
    if (!categoryId) {
      console.warn(`⚠️  Kategori tidak ditemukan: ${q.categorySlug}`);
      continue;
    }
    const prefix = q.categorySlug === "bahasa-sastra" ? "sastra" : q.categorySlug.substring(0, 4);
    categoryCounters[q.categorySlug] = (categoryCounters[q.categorySlug] || 0) + 1;
    const questionId = `${prefix}-${categoryCounters[q.categorySlug]}`;
    await prisma.question.upsert({
      where: { id: questionId },
      update: {
        categoryId,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        difficulty: q.difficulty,
      },
      create: {
        id: questionId,
        categoryId,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        difficulty: q.difficulty,
      },
    });
    totalInserted++;
  }

   console.log(`\n🎉 SELESAI! ${totalInserted} soal berhasil diproses.`);
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
