import https from 'https';

// تجاهل SSL غير الموثوق
const agent = new https.Agent({ rejectUnauthorized: false });

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const { nom, dci } = req.query;

  if (!nom && !dci) {
    return res.status(200).json({ 
      message: 'DawaaFind API تعمل ✅',
      usage: {
        byName: '/api/medicament?nom=DANTRON',
        byDCI: '/api/medicament?dci=DAN'
      }
    });
  }

  try {
    let url;
    if (nom) {
      url = `https://e-services.anam.ma/eServices/api/Medicament/GetMedicament/${encodeURIComponent(nom)}/`;
    } else {
      url = `https://e-services.anam.ma/eServices/api/Medicament/GetMedicamentClause/${encodeURIComponent(dci)}/`;
    }

    const response = await fetch(url, {
      agent, // ← هذا هو الحل
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
        'Referer': 'https://e-services.anam.ma/Guide-Medicaments',
        'Origin': 'https://e-services.anam.ma'
      },
      redirect: 'follow'
    });

    const text = await response.text();

    try {
      const data = JSON.parse(text);
      return res.status(200).json(data);
    } catch {
      return res.status(200).json({ raw: text.substring(0, 500), status: response.status });
    }

  } catch (error) {
    res.status(500).json({ error: error.message, type: error.cause?.code || 'unknown' });
  }
}
