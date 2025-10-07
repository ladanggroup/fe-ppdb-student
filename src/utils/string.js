/**
 * Capitalize setiap kata (hanya huruf awal yang besar)
 * @param {string} str
 * @returns {string}
 */
export function capitalizeWords(str) {
  if (!str) return "";
  return str
    .toLowerCase()
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
