const fs = require('fs');
const path = require('path');
const filePath = path.resolve(__dirname, '../src/data/products.shared.ts');
const text = fs.readFileSync(filePath, 'utf8');
const lines = text.split('\n');
const products = [];
let current = null;
for (let i = 0; i < lines.length; i += 1) {
  const line = lines[i];
  const nameMatch = line.match(/\{ name: "([^"]+)"/);
  if (nameMatch) {
    if (current) products.push(current);
    current = { name: nameMatch[1], image: null, line: i + 1 };
  }
  const imgMatch = line.match(/image:\s*"([^"]+)"/);
  if (imgMatch && current) {
    current.image = imgMatch[1];
    current.imageLine = i + 1;
  }
}
if (current) products.push(current);

const brands = [
  'Dell','HP','Lenovo','Apple','ASUS','MSI','Acer','Samsung','LG','Sony','Intel','AMD','NVIDIA','Corsair','Beelink','Synology','QNAP','G.Skill','Kingston','Gigabyte','Razer','Logitech','SteelSeries','Sennheiser','Bose','Creative','Shure','Blue','Rode','Maono','TP-Link','Ubiquiti','Anker','CalDigit','Noctua','Seasonic','Cooler Master','be quiet!','Fractal','Lian Li','NZXT','Secretlab','DXRacer','Herman Miller','HyperX','Realme','Xiaomi','Google','OnePlus','TCL','BenQ','Epson','Elgato','AVerMedia'
];
const suspicious = products.filter((product) => {
  if (!product.image) return false;
  const brand = brands.find((b) => product.name.includes(b));
  if (!brand) return false;
  const url = product.image.toLowerCase();
  const normalizedBrand = brand.toLowerCase().replace(/\s+/g, '').replace(/\./g, '').replace(/!/g, '').replace(/-/g, '');
  const firstWord = brand.toLowerCase().split(' ')[0].replace(/[^a-z0-9]/g, '');
  return !url.includes(normalizedBrand) && !url.includes(firstWord);
});
console.log(`Total products parsed: ${products.length}`);
console.log(`Suspicious products: ${suspicious.length}`);
suspicious.forEach((p) => {
  console.log(`- ${p.name} (line ${p.line}) image line ${p.imageLine}`);
  console.log(`  ${p.image}`);
});
