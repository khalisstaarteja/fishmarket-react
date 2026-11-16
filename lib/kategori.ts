import { getProduk, saveProduk } from "@/lib/produk";
import { renameKategoriTransaksi } from "@/lib/pesanan";

export type KategoriItem = {
  id: number;
  nama: string;
};

// KEY KATEGORI
const KEY_KATEGORI = "categories_data";

export const DEFAULT_KATEGORI: KategoriItem[] = [
  { id: 1, nama: "Ikan Air Asin" },
  { id: 2, nama: "Ikan Air Tawar" },
];

// Ambil kategori
export function getKategori(): KategoriItem[] {
  if (typeof window === "undefined") return DEFAULT_KATEGORI;
  const stored = localStorage.getItem(KEY_KATEGORI);
  if (!stored) {
    localStorage.setItem(KEY_KATEGORI, JSON.stringify(DEFAULT_KATEGORI));
    return DEFAULT_KATEGORI;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return DEFAULT_KATEGORI;
  }
}

// Simpan daftar kategori
export function saveKategoriList(list: KategoriItem[]) {
  localStorage.setItem(KEY_KATEGORI, JSON.stringify(list));
  window.dispatchEvent(new Event("kategoriUpdated"));
}

// Tambah kategori
export function addKategori(nama: string) {
  const current = getKategori();
  const newItem: KategoriItem = { id: Date.now(), nama };
  const updated = [...current, newItem]; // taro item setelah current
  saveKategoriList(updated);
  return updated;
}

// Edit/update kategori
export function updateKategori(id: number, namaBaru: string) {
  const current = getKategori();
  const index = current.findIndex((k) => k.id === Number(id));

  if (index !== -1) {
    const namaLama = current[index].nama;
    current[index].nama = namaBaru;

    if (namaLama !== namaBaru) {
      // update produk dulu, baru kategori, biar listener kategoriUpdated
      // baca data produk yang sudah baru
      const produkUpdated = getProduk().map((p) =>
        p.kategori.trim().toLowerCase() === namaLama.trim().toLowerCase()
          ? { ...p, kategori: namaBaru }
          : p
      );
      saveProduk(produkUpdated);
      renameKategoriTransaksi(namaLama, namaBaru);
    }

    saveKategoriList(current);
  }
  return current;
}
// Delete kategori
export function deleteKategori(id: number) {
  const current = getKategori();
  const filtered = current.filter((k) => k.id !== id);
  saveKategoriList(filtered);
  return filtered;
}
