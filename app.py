
# ==========================================
# 1. IMPORT LIBRARY
# ==========================================

from flask import Flask, render_template, request
import sqlite3
import re
import html
from pathlib import Path
from datetime import datetime


# ==========================================
# 2. KONFIGURASI APLIKASI
# ==========================================

app = Flask(__name__)

# Menentukan lokasi database
LOKASI_DATABASE = Path(__file__).resolve().parent / "portfolio.db"


# ==========================================
# 3. MEMBUAT DATABASE
# ==========================================

def buat_database():

    koneksi = sqlite3.connect(LOKASI_DATABASE)

    cursor = koneksi.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS kontak (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nama TEXT NOT NULL,
            email TEXT NOT NULL,
            pesan TEXT NOT NULL,
            tanggal TEXT NOT NULL
        )
    """)

    koneksi.commit()
    koneksi.close()


# ==========================================
# 4. HALAMAN UTAMA
# ==========================================

@app.route("/")
def beranda():

    return render_template("index.html")


# ==========================================
# 5. MEMPROSES FORMULIR KONTAK
# ==========================================

@app.route("/contact", methods=["POST"])
def kontak():

    # Mengambil data dari formulir HTML
    nama = request.form.get("nama", "").strip()
    email = request.form.get("email", "").strip()
    pesan = request.form.get("pesan", "").strip()

    # Memeriksa apakah semua kolom sudah diisi
    if not nama or not email or not pesan:
        return halaman_respons(
            "Gagal Mengirim",
            "Semua kolom formulir wajib diisi.",
            False
        ), 400

    # Memeriksa panjang data
    if len(nama) > 100 or len(email) > 254 or len(pesan) > 5000:
        return halaman_respons(
            "Gagal Mengirim",
            "Data yang dimasukkan melebihi batas maksimal.",
            False
        ), 400

    # Memeriksa format email
    pola_email = r"^[^\s@]+@[^\s@]+\.[^\s@]+$"

    if not re.match(pola_email, email):
        return halaman_respons(
            "Email Tidak Valid",
            "Silakan masukkan alamat email yang benar.",
            False
        ), 400

    # Mengambil waktu pengiriman
    tanggal = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    try:

        # Menghubungkan ke database
        koneksi = sqlite3.connect(LOKASI_DATABASE)

        cursor = koneksi.cursor()

        # Menyimpan pesan menggunakan parameter SQL
        cursor.execute("""
            INSERT INTO kontak (nama, email, pesan, tanggal)
            VALUES (?, ?, ?, ?)
        """, (nama, email, pesan, tanggal))

        koneksi.commit()
        koneksi.close()

        return halaman_respons(
            "Pesan Berhasil Dikirim!",
            "Terima kasih! Pesan kamu sudah berhasil disimpan.",
            True
        )

    except sqlite3.Error:

        return halaman_respons(
            "Terjadi Kesalahan",
            "Maaf, pesan belum dapat disimpan. Silakan coba lagi.",
            False
        ), 500


# ==========================================
# 6. HALAMAN RESPONS
# ==========================================

def halaman_respons(judul, pesan, berhasil):

    warna = "#16a34a" if berhasil else "#dc2626"

    judul_aman = html.escape(judul)
    pesan_aman = html.escape(pesan)

    return f"""
    <!DOCTYPE html>
    <html lang="id">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>{judul_aman}</title>

        <style>
            body {{
                font-family: Arial, sans-serif;
                background: #0b1120;
                color: #f1f5f9;
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
                margin: 0;
                padding: 20px;
                box-sizing: border-box;
            }}

            .kotak {{
                background: #151f32;
                border: 1px solid #263449;
                border-radius: 15px;
                padding: 40px;
                text-align: center;
                max-width: 450px;
                width: 100%;
                box-sizing: border-box;
            }}

            h1 {{
                color: {warna};
            }}

            p {{
                color: #94a3b8;
                line-height: 1.7;
            }}

            a {{
                display: inline-block;
                margin-top: 20px;
                padding: 12px 22px;
                background: #38bdf8;
                color: #07111f;
                text-decoration: none;
                border-radius: 8px;
                font-weight: bold;
            }}
        </style>
    </head>

    <body>
        <div class="kotak">
            <h1>{judul_aman}</h1>
            <p>{pesan_aman}</p>
            <a href="/">Kembali ke Portfolio</a>
        </div>
    </body>
    </html>
    """


# ==========================================
# 7. MENJALANKAN APLIKASI
# ==========================================

if __name__ == "__main__":

    # Membuat database ketika aplikasi dijalankan
    buat_database()

    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )
