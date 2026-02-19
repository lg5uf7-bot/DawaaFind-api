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
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'fr-MA,fr;q=0.9,ar;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Referer': 'https://e-services.anam.ma/Guide-Medicaments',
        'Origin': 'https://e-services.anam.ma',
        'Host': 'e-services.anam.ma',
        'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin'
      },
      // مهم: تتبع الـ redirect تلقائياً
      redirect: 'follow'
    });

    const text = await response.text();
    
    // حاول parse كـ JSON
    try {
      const data = JSON.parse(text);
      return res.status(200).json(data);
    } catch {
      // أرجع النص كما هو للتشخيص
      return res.status(200).json({ 
        raw: text.substring(0, 500),
        status: response.status,
        headers: Object.fromEntries(response.headers)
      });
    }

  } catch (error) {
    res.status(500).json({ 
      error: error.message,
      type: error.cause?.code || 'unknown'
    });
  }
}
