export default function e2a(s) {
  return s.replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
}