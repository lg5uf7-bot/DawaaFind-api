import axios from 'axios';
import https from 'https';

const httpsAgent = new https.Agent({ rejectUnauthorized: false });

const ALL_DRUG_NAMES = [
  "ABACAVIR","AMOXICILLINE","AUGMENTIN","AZITHROMYCINE",
  "CIPROFLOXACINE","DANTRON","DIAZEPAM","DICLOFENAC","DOLIPRANE",
  "ESOMEPRAZOLE","FUROSEMIDE","GLUCOPHAGE","IBUPROFEN","INSULINE",
  "KETOPROFENE","LANSOPRAZOLE","LEVOFLOXACINE","LEVOTHYROXINE",
  "LOSARTAN","METFORMINE","METRONIDAZOLE","MORPHINE","OMEPRAZOLE",
  "ONDANSETRON","PACLITAXEL","PANTOPRAZOLE","PAROXETINE","PREDNISOLONE",
  "RAMIPRIL","SALBUTAMOL","SERTRALINE","SIMVASTATINE","TRAMADOL",
  "VALPROATE","VALSARTAN","VANCOMYCINE","ZOLPIDEM"
];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const { nom, dci, page = '1', limit = '12', search } = req.query;

  // بحث
  if (search) {
    const query = search.toUpperCase();
    const matched = ALL_DRUG_NAMES.filter(n => n.startsWith(query)).slice(0, 5);
    const results = [];
    for (const name of matched) {
      try {
        const r = await axios.get(
          `https://e-services.anam.ma/eServices/api/Medicament/GetMedicament/${encodeURIComponent(name)}/`,
          { httpsAgent, headers: { 'Referer': 'https://e-services.anam.ma/Guide-Medicaments' } }
        );
        if (Array.isArray(r.data)) results.push(...r.data);
      } catch {}
    }
    return res.status(200).json({ data: results, total: matched.length });
  }

  // pagination
  if (!nom && !dci) {
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const pageNames = ALL_DRUG_NAMES.slice((pageNum - 1) * limitNum, pageNum * limitNum);
    const results = [];
    for (const name of pageNames) {
      try {
        const r = await axios.get(
          `https://e-services.anam.ma/eServices/api/Medicament/GetMedicament/${encodeURIComponent(name)}/`,
          { httpsAgent, headers: { 'Referer': 'https://e-services.anam.ma/Guide-Medicaments' } }
        );
        if (Array.isArray(r.data) && r.data.length > 0) results.push(r.data[0]);
      } catch {}
    }
    return res.status(200).json({
      data: results,
      total: ALL_DRUG_NAMES.length,
      page: pageNum,
      totalPages: Math.ceil(ALL_DRUG_NAMES.length / limitNum)
    });
  }

  // بحث مباشر
  try {
    const url = nom
      ? `https://e-services.anam.ma/eServices/api/Medicament/GetMedicament/${encodeURIComponent(nom)}/`
      : `https://e-services.anam.ma/eServices/api/Medicament/GetMedicamentClause/${encodeURIComponent(dci)}/`;

    const response = await axios.get(url, {
      httpsAgent,
      headers: { 'Referer': 'https://e-services.anam.ma/Guide-Medicaments' }
    });
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
```
