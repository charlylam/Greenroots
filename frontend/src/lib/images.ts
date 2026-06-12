const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';
const PLACEHOLDER = '/images/placeholder.webp'; // dans le /public de Next

/**
 * Construit l'URL complète d'une image uploadée à partir du nom de fichier stocké en BDD.
 * @param filename - le nom du fichier seul (ex: "1780641839769-acajou-afrique.webp")
 */
export function getImageUrl(filename: string): string {
  if (!filename) return PLACEHOLDER;
  return `${API_URL}/uploads/${filename}`;
}
