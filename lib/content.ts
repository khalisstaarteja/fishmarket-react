import { getDefaultContent } from "@/app/data/dataContent";
export { getDefaultContent };

// Ambil content (saat halaman load)
export const getContent = () => {
  if (typeof window === "undefined") return getDefaultContent();

  // KEY SITECONTENT
  const data = localStorage.getItem("siteContent");
  if (!data) return getDefaultContent();
  try {
    return { ...getDefaultContent(), ...JSON.parse(data) };
  } catch {
    return getDefaultContent();
  }
};

// Simpan content ke localStorage, return false kalau gagal (misal localStorage penuh karena gambar besar)
export const saveContent = (content: any): boolean => {
  try {
    localStorage.setItem("siteContent", JSON.stringify(content));
    return true;
  } catch {
    return false;
  }
};

// Reset
export const resetDefaultContent = () => {
  localStorage.removeItem("siteContent");
};
