import axios from 'axios';
import https from 'https';

const httpsAgent = new https.Agent({ rejectUnauthorized: false });

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  // أضفنا 'page' للتحكم في الصفحات
  const { nom, dci, page = 1 } = req.query;

  try {
    let url;

    // 1. إذا كان المستخدم يبحث عن دواء محدد (بالإكمال التلقائي)
    if (dci) {
      url = https://e-services.anam.ma/eServices/api/Medicament/GetMedicamentClause/${encodeURIComponent(dci)}/;
    } 
    // 2. إذا كان يبحث عن تفاصيل دواء بالاسم الكامل
    else if (nom) {
      url = https://e-services.anam.ma/eServices/api/Medicament/GetMedicament/${encodeURIComponent(nom)}/;
    } 
    // 3. الحالة الجديدة: الصفحة الرئيسية (Default) ليعرض أدوية مرتبة
    else {
      // سنستخدم حرف "A" كافتراضي لجلب أول أدوية تظهر في الموقع الرسمي
      // أو يمكنك جلب قائمة عامة إذا كان السيرفر يدعم ذلك
      url = https://e-services.anam.ma/eServices/api/Medicament/GetMedicamentClause/A/;
    }

    const response = await axios.get(url, {
      httpsAgent,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
        'Referer': 'https://e-services.anam.ma/Guide-Medicaments',
      }
    });

    let data = response.data;

    // منطق الـ Pagination اليدوي (لأن سيرفر ANAM قد لا يدعمه مباشرة)
    // سنقوم بقص 12 دواء فقط بناءً على رقم الصفحة المرسل
    const limit = 12;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    
    // إذا كانت البيانات مصفوفة (Array)، سنقص منها الجزء المطلوب
    if (Array.isArray(data)) {
        const paginatedData = data.slice(startIndex, endIndex);
        return res.status(200).json({
            total: data.length,
            currentPage: parseInt(page),
            totalPages: Math.ceil(data.length / limit),
            results: paginatedData
        });
    }

    return res.status(200).json(data);

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
