import axios from 'axios';
import https from 'https';

const httpsAgent = new https.Agent({ rejectUnauthorized: false });

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

    const response = await axios.get(url, {
      httpsAgent,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
        'Referer': 'https://e-services.anam.ma/Guide-Medicaments',
        'Origin': 'https://e-services.anam.ma'
      },
      maxRedirects: 5
    });

    return res.status(200).json(response.data);

  } catch (error) {
    return res.status(500).json({ 
      error: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
  }
}
