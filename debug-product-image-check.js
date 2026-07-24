const fs = require('fs');
const path = require('path');
const text = fs.readFileSync(path.resolve(__dirname, 'src/data/products.shared.ts'), 'utf8');
const entryRegex = /\{[^\}]*\}/g;
const brands = ['apple','asus','dell','hp','lenovo','msi','lg','intel','nvidia','amd','samsung','sony','razer','logitech','corsair','gigabyte','seasonic','be quiet','benq','synology','qnap','tcl','epson','xiaomi','garmin','baseus','anker','jbl','bose','shure','maono','ugreen','elgato','rode','secretlab','dxracer','herman','hyperx','oneplus','google','realme','tp-link','ubiquiti','caldigit','avermedia','noctua','nzxt','fractal','keychron','microsoft'];
const brandSynonyms = {
  'be quiet!': 'be quiet',
  'be quiet': 'be quiet',
  'cooler master': 'cooler master',
  'tp-link': 'tp-link',
  'asus rog': 'asus',
  'rog': 'asus',
  'macbook': 'apple',
  'mac mini': 'apple',
  'mac studio': 'apple',
  'macbook air': 'apple',
  'macbook pro': 'apple',
};
const normalize = name => {
  const lower = name.toLowerCase();
  for (const [key, value] of Object.entries(brandSynonyms)) {
    if (lower.includes(key)) return value;
  }
  for (const brand of brands) {
    if (lower.includes(brand)) return brand;
  }
  return null;
};
const extractBrands = url => {
  const lower = url.toLowerCase();
  return brands.filter(b => lower.includes(b));
};
const results = [];
for (const entry of text.match(entryRegex) || []) {
  const nameMatch = entry.match(/name:\s*"([^"]+)"/);
  const imgMatch = entry.match(/image:\s*"([^"]+)"/);
  if (!nameMatch || !imgMatch) continue;
  const name = nameMatch[1];
  const image = imgMatch[1];
  const nameBrand = normalize(name);
  const imgBrands = extractBrands(image);
  if (nameBrand && imgBrands.length && !imgBrands.includes(nameBrand)) {
    results.push({name, nameBrand, image, imgBrands});
  }
}
console.log(JSON.stringify(results, null, 2));
