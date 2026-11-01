
/* ==========================================
   1. DARK MODE DAN LIGHT MODE
========================================== */

// Mengambil tombol tema
const tombolTema = document.getElementById("theme-toggle");

// Mengambil tema yang tersimpan
const temaTersimpan = localStorage.getItem("tema");

// Fungsi untuk menerapkan tema
function terapkanTema(tema) {

    if (tema === "light") {

        document.body.classList.add("light-mode");

        tombolTema.textContent = "☀️";

        tombolTema.setAttribute(
            "aria-label",
            "Aktifkan mode gelap"
        );

        tombolTema.setAttribute("aria-pressed", "true");

    } else {

        document.body.classList.remove("light-mode");

        tombolTema.textContent = "🌙";

        tombolTema.setAttribute(
            "aria-label",
            "Aktifkan mode terang"
        );

        tombolTema.setAttribute("aria-pressed", "false");
    }

}

// Menerapkan tema saat halaman dibuka
terapkanTema(temaTersimpan === "light" ? "light" : "dark");

// Event klik tombol tema
tombolTema.addEventListener("click", function () {

    const modeTerangAktif =
        document.body.classList.contains("light-mode");

    const temaBaru = modeTerangAktif ? "dark" : "light";

    // Mengubah tema
    terapkanTema(temaBaru);

    // Menyimpan pilihan tema
    localStorage.setItem("tema", temaBaru);

});


/* ==========================================
   2. HAMBURGER BUTTON
========================================== */

// Mengambil elemen hamburger dan menu
const tombolHamburger = document.getElementById("hamburger");
const menuNavigasi = document.getElementById("nav-links");

// Fungsi membuka dan menutup menu
function ubahMenu() {

    const menuTerbuka =
        menuNavigasi.classList.toggle("menu-terbuka");

    // Mengubah animasi hamburger
    tombolHamburger.classList.toggle("aktif", menuTerbuka);

    // Memperbarui status aksesibilitas
    tombolHamburger.setAttribute(
        "aria-expanded",
        String(menuTerbuka)
    );

    tombolHamburger.setAttribute(
        "aria-label",
        menuTerbuka ? "Tutup menu navigasi" : "Buka menu navigasi"
    );

}

// Event klik hamburger
tombolHamburger.addEventListener("click", ubahMenu);

// Menutup menu setelah salah satu navigasi dipilih
const tautanNavigasi = menuNavigasi.querySelectorAll("a");

tautanNavigasi.forEach(function (tautan) {

    tautan.addEventListener("click", function () {

        menuNavigasi.classList.remove("menu-terbuka");
        tombolHamburger.classList.remove("aktif");

        tombolHamburger.setAttribute("aria-expanded", "false");
        tombolHamburger.setAttribute(
            "aria-label",
            "Buka menu navigasi"
        );

    });

});

// Menutup menu dengan tombol Escape
document.addEventListener("keydown", function (event) {

    if (event.key === "Escape") {

        menuNavigasi.classList.remove("menu-terbuka");
        tombolHamburger.classList.remove("aktif");

        tombolHamburger.setAttribute("aria-expanded", "false");
        tombolHamburger.setAttribute(
            "aria-label",
            "Buka menu navigasi"
        );
    }

});

// Menutup menu ketika ukuran layar kembali ke desktop
window.addEventListener("resize", function () {

    if (window.innerWidth > 768) {

        menuNavigasi.classList.remove("menu-terbuka");
        tombolHamburger.classList.remove("aktif");

        tombolHamburger.setAttribute("aria-expanded", "false");
    }

});


/* ==========================================
   3. TYPING EFFECT
========================================== */

// Mengambil elemen judul hero
const judulHero = document.querySelector(".hero h2");

// Daftar teks animasi
const daftarTeks = [
    "Informatics Student",
    "Web Developer",
    "Tech Enthusiast"
];

let indeksTeks = 0;
let indeksHuruf = 0;
let sedangMenghapus = false;

// Fungsi animasi mengetik
function animasiMengetik() {

    const teksSekarang = daftarTeks[indeksTeks];

    if (sedangMenghapus) {

        indeksHuruf--;

    } else {

        indeksHuruf++;

    }

    judulHero.textContent = teksSekarang.substring(
        0,
        indeksHuruf
    );

    let kecepatan = sedangMenghapus ? 45 : 100;

    // Jika teks selesai diketik
    if (!sedangMenghapus && indeksHuruf === teksSekarang.length) {

        sedangMenghapus = true;
        kecepatan = 1500;

    }

    // Jika teks selesai dihapus
    else if (sedangMenghapus && indeksHuruf === 0) {

        sedangMenghapus = false;

        indeksTeks =
            (indeksTeks + 1) % daftarTeks.length;

        kecepatan = 400;

    }

    setTimeout(animasiMengetik, kecepatan);

}

// Menjalankan animasi
animasiMengetik();


/* ==========================================
   4. ANIMASI SAAT SCROLL
========================================== */

// Mengambil elemen yang akan dianimasikan
const elemenAnimasi = document.querySelectorAll(
    ".section, .project-card, .skill-card"
);

// Membuat observer
const pengamat = new IntersectionObserver(
    function (entries) {

        entries.forEach(function (entry) {

            if (entry.isIntersecting) {

                entry.target.classList.add("muncul");

                // Berhenti mengamati setelah muncul
                pengamat.unobserve(entry.target);

            }

        });

    },
    {
        threshold: 0.15
    }
);

// Mengamati seluruh elemen
elemenAnimasi.forEach(function (elemen) {

    elemen.classList.add("animasi-awal");

    pengamat.observe(elemen);

});


/* ==========================================
   5. FILTER PROYEK
========================================== */

// Mengambil semua kartu proyek
const semuaProyek = document.querySelectorAll(".project-card");

// Kategori setiap proyek
const kategoriProyek = [
    "mobile",
    "web",
    "web"
];

// Membuat wadah filter
const wadahFilter = document.createElement("div");

wadahFilter.className = "filter-container";

wadahFilter.innerHTML = `
    <button class="filter-btn aktif" data-kategori="semua">
        Semua
    </button>

    <button class="filter-btn" data-kategori="mobile">
        Mobile
    </button>

    <button class="filter-btn" data-kategori="web">
        Web
    </button>
`;

// Memasukkan filter sebelum daftar proyek
const wadahProyek = document.querySelector(".projects-container");

if (wadahProyek) {

    wadahProyek.parentNode.insertBefore(
        wadahFilter,
        wadahProyek
    );

}

// Mengambil tombol filter
const tombolFilter = document.querySelectorAll(".filter-btn");

// Event klik tombol filter
tombolFilter.forEach(function (tombol) {

    tombol.addEventListener("click", function () {

        const kategoriDipilih = tombol.dataset.kategori;

        // Mengubah tombol aktif
        tombolFilter.forEach(function (item) {

            item.classList.remove("aktif");

        });

        tombol.classList.add("aktif");

        // Menampilkan proyek sesuai kategori
        semuaProyek.forEach(function (proyek, indeks) {

            if (
                kategoriDipilih === "semua" ||
                kategoriProyek[indeks] === kategoriDipilih
            ) {

                proyek.style.display = "block";

            } else {

                proyek.style.display = "none";

            }

        });

    });

});


/* ==========================================
   6. VALIDASI FORM KONTAK
========================================== */

// Mengambil formulir
const formulirKontak = document.querySelector(".contact-form");

// Event ketika formulir dikirim
formulirKontak.addEventListener("submit", function (event) {

    // Mengambil nilai input
    const nama = document.querySelector(
        'input[name="nama"]'
    ).value.trim();

    const email = document.querySelector(
        'input[name="email"]'
    ).value.trim();

    const pesan = document.querySelector(
        'textarea[name="pesan"]'
    ).value.trim();

    // Memeriksa kolom kosong
    if (nama === "" || email === "" || pesan === "") {

        event.preventDefault();

        alert("Mohon lengkapi seluruh formulir!");

        return;
    }

    // Memeriksa format email
    const polaEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!polaEmail.test(email)) {

        event.preventDefault();

        alert("Format email tidak valid!");

        return;
    }

    // Formulir akan diteruskan ke Python Flask
    alert("Formulir berhasil divalidasi. Mengirim pesan...");

});
