export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  const { nom, dci } = req.query;
  
  try {
    let url;
    
    if (nom) {
      url = `https://e-services.anam.ma/eServices/api/Medicament/GetMedicament/${encodeURIComponent(nom)}/`;
    } else if (dci) {
      url = `https://e-services.anam.ma/eServices/api/Medicament/GetMedicamentClause/${encodeURIComponent(dci)}/`;
    } else {
      return res.status(400).json({ error: 'يجب تحديد nom أو dci' });
    }

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Accept': 'application/json',
        'Referer': 'https://e-services.anam.ma/'
      }
    });

    const data = await response.json();
    res.status(200).json(data);
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
