export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const { nom, dci } = req.query;

  // إذا لا يوجد query — أرجع رسالة ترحيب
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
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Accept': 'application/json',
        'Referer': 'https://e-services.anam.ma/'
      }
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: `ANAM returned ${response.status}` });
    }

    const data = await response.json();
    res.status(200).json(data);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
