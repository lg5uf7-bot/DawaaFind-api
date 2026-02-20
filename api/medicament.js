import axios from 'axios';
import https from 'https';

const httpsAgent = new https.Agent({ rejectUnauthorized: false });

// قائمة أسماء الأدوية مرتبة A-Z (مستخرجة من scraping)
const ALL_DRUG_NAMES = [
  "ABACAVIR","ABBIFEN","ABDINE","ABECEF","ABELCET","ABEMACICLIB",
  "ABILIFY","ABIRATONE","ABRILAR","ABSORAL","ACARBOSE","ACECLOFEN",
  "ACENOCOUMAROL","ACETAZOLAMIDE","ACETYLCYSTEINE","ACICLOVIR",
  "ACIDRINE","ACLOR","ACNECLIN","ACOMPLIA","ACOURANE","ACROMYCINE",
  "ACTAPULGITE","ACTIFED","ACTILYSE","ACTIQ","ACTIVELLE","ACTONEL",
  "ACTOS","ACULAR","ADALAT","ADARTREL","ADCIRCA","ADDERALL",
  "ADEQUAN","ADFEL","ADIZEM","ADMELOG","ADOXA","ADREKAR",
  "ADRIBLASTINE","ADROVANCE","ADRYX","ADVAGRAF","ADVANTAN",
  "AERIUS","AERODIOL","AEROLIN","AFINITOR","AGGRASTAT","AGGRENOX",
  "AGIRAL","AGLUCOSIDE","AGOMELATINE","AIROL","AIROMIR","AKNEMYCIN",
  "ALBENDAZOLE","ALBORAL","ALBUTEROL","ALDACTONE","ALDARA","ALDOMET",
  "ALDOSTOP","ALEMTUZUMAB","ALENTOL","ALETRIS","ALEXAN","ALFACALCIDOL",
  "ALFENTANIL","ALFUZOSIN","ALGOCALMIN","ALIMTA","ALKERAN","ALLEGRA",
  "ALLOPURINOL","ALMOTRIPTAN","ALODONT","ALOSETRON","ALOSTIL",
  "ALPRAZOLAM","ALPROSTADIL","ALTACE","ALTARGO","ALTEIS","ALUCOL",
  "ALUMINIUM","ALVESCO","AMANTADINE","AMARYL","AMBRISENTAN","AMBROXOL",
  "AMIKACINE","AMILORIDE","AMINOPHYLLINE","AMIODARONE","AMISULPRIDE",
  "AMITRIPTYLINE","AMLODIPINE","AMOCLAN","AMOKSIKLAV","AMOXICILLINE",
  "AMPHOTERICINE","AMPICILLINE","AMREL","AMRUBICINE","AMSACRINE",
  "AMUGARD","AMUZED","ANAFRANIL","ANALOGUES","ANASPAZ","ANASTROZOLE",
  "ANCOTIL","ANDROCUR","ANDROTARDYL","ANECTINE","ANEXATE","ANGIOPRIL",
  "ANGIOX","ANGISED","ANIDULAFUNGINE","ANORO","ANTABUSE","ANTADYS",
  "ANTALGYL","ANTAXONE","ANTEPSIN","ANTITHYMOCYTE","ANTRAFENINE",
  "ANTURANE","ANUSOL","APAURIN","APIXABAN","APOKYN","APRANAX",
  "APREPITANT","APRESOLINE","APROVEL","APTIVUS","ARALEN","ARANESP",
  "ARCALION","ARCOXIA","ARGATROBAN","ARICEPT","ARIMIDEX","ARIPIPRAZOLE",
  "ARIXTRA","ARLEVERT","ARNICA","AROMASIN","ARRANON","ARTANE",
  "ARTEMETHER","ARTESUNATE","ARTHROTEC","ARZNEI","ASACOL","ASASANTIN",
  "ASCABIOL","ASCOFER","ASCORBIQUE","ASMABEC","ASMALIN","ASMANEX",
  "ASPEGIC","ASPIRINE","ASTEMIZOLE","ATACAND","ATARAX","ATENOLOL",
  "ATIVAN","ATOMOXETINE","ATORVASTATINE","ATOVAQUONE","ATROVENT",
  "AUGMENTIN","AURORIX","AVALIDE","AVAMYS","AVANDIA","AVASTIN",
  "AVAXIM","AVELOX","AVENTYL","AVIL","AVONEX","AXEPIM","AXIUM",
  "AZACTAM","AZATHIOPRINE","AZELASTINE","AZITHROMYCINE","AZOPT",
  "AZYTER","BACLOFEN","BACTRIM","BACTROBAN","BARACLUDE","BARIXTEN",
  "BASILIXIMAB","BECLOJET","BECLOMETASONE","BECONASE","BELARA",
  "BELATACEPT","BELIMUMAB","BENEMID","BENLYSTA","BENTYL","BENZATHINE",
  "BENZOYL","BENZYDAMINE","BEPANTHEN","BETADINE","BETAFERON",
  "BETAHISTINE","BETAMETHASONE","BETAXOLOL","BETOPTIC","BEVACIZUMAB",
  "BEXAROTENE","BIAXIN","BINOCRIT","BISOPROLOL","BLEOMYCINE",
  "BONVIVA","BOTOX","BRINZOLAMIDE","BROMHEXINE","BROMOCRIPTINE",
  "BUDESONIDE","BUMETANIDE","BUPIVACAINE","BUPRENORPHINE","BUSCOPAN",
  "BUSILVEX","BUSPIRONE","BUSULFAN","CAFEINE","CALCIPARINE","CALCIUM",
  "CALMATEL","CAMPRAL","CAMPTO","CANDESARTAN","CAPECITABINE",
  "CAPTOPRIL","CARBAMAZEPINE","CARBOPLATIN","CARDENSIEL","CARDIOASPIRIN",
  "CARDIZEM","CARVEDILOL","CASODEX","CATAPRESAN","CELEBREX",
  "CELOCURINE","CEPHALEXINE","CERNEVIT","CERTICAN","CETIRIZINE",
  "CHAMPIX","CIPROFLOXACINE","CISPLATINE","CITALOPRAM","CLARITHROMYCINE",
  "CLINDAMYCINE","CLOPIDOGREL","COARTEM","CODEINE","COLCHICINE",
  "COLISTINE","COMBIVENT","CORDARONE","COVERSYL","CRESTOR",
  "CYCLOPHOSPHAMIDE","CYMBALTA","CYTARABINE","DACARBAZINE","DACLATASVIR",
  "DAKTARIN","DANTRON","DAPAGLIFLOZINE","DAPTOMYCINE","DEXAMETHASONE",
  "DIAZEPAM","DICLOFENAC","DIGOXINE","DILTIAZEM","DOLIPRANE",
  "DOMPERIDONE","DOXORUBICINE","DOXYCYCLINE","DUPHALAC","EFAVIRENZ",
  "ENALAPRIL","ENOXAPARINE","ENTECAVIR","ERYTHROMYCINE","ESCITALOPRAM",
  "ESOMEPRAZOLE","ETOPOSIDE","FAMOTIDINE","FENOFIBRATE","FENTANYL",
  "FLUCONAZOLE","FLUOXETINE","FLUTAMIDE","FLUTICASONE","FONDAPARINUX",
  "FUROSEMIDE","GABAPENTINE","GEMCITABINE","GLIBENCLAMIDE","GLICLAZIDE",
  "GLIMEPIRIDE","GLUCOPHAGE","HALOPERIDOL","HEPARINE","HYDROCORTISONE",
  "HYDROXYCHLOROQUINE","IBUPROFEN","IMATINIB","IMIPENEM","INDINAVIR",
  "INFLIXIMAB","INSULINE","INTERFERON","IRINOTECAN","ISONIAZIDE",
  "ITRACONAZOLE","IVERMECTINE","KETAMINE","KETOCONAZOLE","KETOPROFENE",
  "LABETALOL","LACTULOSE","LAMIVUDINE","LAMOTRIGINE","LANSOPRAZOLE",
  "LEFLUNOMIDE","LENALIDOMIDE","LEVETIRACETAM","LEVOFLOXACINE",
  "LEVOTHYROXINE","LIDOCAINE","LINEZOLIDE","LISINOPRIL","LITHIUM",
  "LOPINAVIR","LORATADINE","LORAZEPAM","LOSARTAN","MEBENDAZOLE",
  "MELPHALAN","MEMANTINE","MERCAPTOPURINE","METFORMINE","METHOTREXATE",
  "METHYLPREDNISOLONE","METOCLOPRAMIDE","METOPROLOL","METRONIDAZOLE",
  "MIDAZOLAM","MIRTAZAPINE","MISOPROSTOL","MORPHINE","MOXIFLOXACINE",
  "MYCOPHENOLATE","NAPROXENE","NEVIRAPINE","NICARDIPINE","NIFEDIPINE",
  "NITROFURANTOINE","NITROGLYCERIN","NYSTATIN","OLANZAPINE","OMEPRAZOLE",
  "ONDANSETRON","OSELTAMIVIR","OXALIPLATINE","OXYCODONE","PACLITAXEL",
  "PANTOPRAZOLE","PAROXETINE","PEMETREXED","PENICILLINE","PERINDOPRIL",
  "PHENOBARBITAL","PHENYTOINE","PIPERACILLINE","PIROXICAM","PREDNISOLONE",
  "PREDNISONE","PREGABALINE","PRIMAQUINE","PROPRANOLOL","QUETIAPINE",
  "QUINAPRIL","RABEPRAZOLE","RAMIPRIL","RANITIDINE","RASAGILINE",
  "RIBAVIRIN","RIFAMPICINE","RISPERIDONE","RITONAVIR","RITUXIMAB",
  "RIVAROXABAN","ROPIVACAINE","ROSUVASTATINE","SALBUTAMOL","SERTRALINE",
  "SILDENAFIL","SIMVASTATINE","SIROLIMUS","SORAFENIB","SPIRAMYCINE",
  "SPIRONOLACTONE","SULFAMETHOXAZOLE","SUNITINIB","TACROLIMUS",
  "TAMOXIFENE","TAMSULOSINE","TELMISARTAN","TENOFOVIR","TERBINAFINE",
  "TOBRAMYCINE","TOPIRAMATE","TRAMADOL","TRASTUZUMAB","TRIMETHOPRIME",
  "VALACICLOVIR","VALGANCICLOVIR","VALPROATE","VALSARTAN","VANCOMYCINE",
  "VENLAFAXINE","VERAPAMIL","VINCRISTINE","VORICONAZOLE","WARFARINE",
  "ZIDOVUDINE","ZOLPIDEM","ZOPICLONE"
];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const { nom, dci, page = '1', limit = '12', search } = req.query;

  // ── البحث ──
  if (search) {
    try {
      const query = search.toUpperCase();
      // فلتر الأسماء التي تبدأ بالحرف المكتوب
      const matched = ALL_DRUG_NAMES.filter(n => n.startsWith(query));
      
      // جلب أول 5 نتائج فقط من API (لتجنب الطول)
      const results = [];
      for (const name of matched.slice(0, 5)) {
        try {
          const r = await axios.get(
            `https://e-services.anam.ma/eServices/api/Medicament/GetMedicament/${encodeURIComponent(name)}/`,
            { httpsAgent, headers: { 'Referer': 'https://e-services.anam.ma/Guide-Medicaments' }, maxRedirects: 5 }
          );
          if (Array.isArray(r.data)) results.push(...r.data);
        } catch {}
      }
      return res.status(200).json({ data: results, total: matched.length, search: query });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // ── Pagination (بدون بحث) ──
  if (!nom && !dci) {
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const start = (pageNum - 1) * limitNum;
    const pageNames = ALL_DRUG_NAMES.slice(start, start + limitNum);

    const results = [];
    for (const name of pageNames) {
      try {
        const r = await axios.get(
          `https://e-services.anam.ma/eServices/api/Medicament/GetMedicament/${encodeURIComponent(name)}/`,
          { httpsAgent, headers: { 'Referer': 'https://e-services.anam.ma/Guide-Medicaments' }, maxRedirects: 5 }
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

  // ── البحث المباشر بالاسم أو DCI ──
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
        'User-Agent': 'Mozilla/5.0',
        'Accept': 'application/json',
        'Referer': 'https://e-services.anam.ma/Guide-Medicaments'
      },
      maxRedirects: 5
    });

    return res.status(200).json(response.data);

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
```

---

## روابط الاستخدام بعد التحديث
```
# صفحة 1 (12 دواء)
/api/medicament?page=1&limit=12

# صفحة 2
/api/medicament?page=2&limit=12

# بحث
/api/medicament?search=d

# بحث مباشر
/api/medicament?nom=DANTRON
