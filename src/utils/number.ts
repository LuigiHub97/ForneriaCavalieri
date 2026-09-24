export function parseDecimal(value: string): number | null {
  let cleaned = value.replace(/R\$|\s/g, "");
  if (cleaned.includes(",")) cleaned = cleaned.replace(/\./g, "").replace(",", ".");
  const n = Number(cleaned);
  return cleaned && Number.isFinite(n) ? n : null;
}
