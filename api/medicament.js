import axios from 'axios';
import https from 'https';

const httpsAgent = new https.Agent({ rejectUnauthorized: false });

const ALL_DRUG_NAMES = [
  "ABACAVIR","AMOXICILLINE","AUGMENTIN","AZITHROMYCINE",
  "CIPROFLOXACINE","DANTRON","DIAZEPAM","DICLOFENAC","DOLIPRANE",
  "ESOMEPRAZOLE","FUROSEMIDE","GLUCOPHAGE","IBUPROFEN","KETOPROFENE",
  "LANSOPRAZOLE","LEVOFLOXACINE","LEVOTHYROXINE","LOSARTAN",
  "METFORMINE","METRONIDAZOLE","MORPHINE","OMEPRAZOLE","ONDANSETRON",
  "PANTOPRAZOLE","PAROXETINE","PREDNISOLONE","RAMIPRIL","SALBUTAMOL",
  "SERTRALINE","SIMVASTATINE","TRAMADOL","VALPROATE","VALSARTAN",
  "VANCOMYCINE","ZOLPIDEM"
];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const { page = '1', limit = '12', search } = req.query;
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);

  // فلتر الأسماء حسب البحث أو الصفحة
  let names = ALL_DRUG_NAMES;
  if (search) {
    names = ALL_DRUG_NAMES.filter(n => n.startsWith(search.toUpperCase()));
  }

  const pageNames = names.slice((pageNum - 1) * limitNum, pageNum * limitNum);

  // جلب كل الأدوية بشكل متوازي (parallel) بدل واحد واحد
  const promises = pageNames.map(name =>
    axios.get(
      `https://e-services.anam.ma/eServices/api/Medicament/GetMedicament/${encodeURIComponent(name)}/`,
      { httpsAgent, headers: { 'Referer': 'https://e-services.anam.ma/Guide-Medicaments' }, timeout: 8000 }
    ).then(r => Array.isArray(r.data) && r.data.length > 0 ? r.data[0] : null)
     .catch(() => null)
  );

  const results = (await Promise.all(promises)).filter(Boolean);

  return res.status(200).json({
    data: results,
    total: names.length,
    page: pageNum,
    totalPages: Math.ceil(names.length / limitNum)
  });
}
