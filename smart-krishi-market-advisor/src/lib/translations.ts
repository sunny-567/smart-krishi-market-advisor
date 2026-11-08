export type Language = "en" | "te" | "hi";

export interface Translations {
  appName: string;
  tagline: string;
  home: string;
  about: string;
  crops: string;
  demandSupply: string;
  recommendations: string;
  marketPrices: string;
  farmerDashboard: string;
  buyerDashboard: string;
  adminDashboard: string;
  produceListings: string;
  buyerRequirements: string;
  voiceAssistant: string;
  smsDemo: string;
  helplineDemo: string;
  callbackRequest: string;
  notifications: string;
  userManagement: string;
  reports: string;
  login: string;
  logout: string;
  register: string;
  farmerRegister: string;
  buyerRegister: string;
  roleFarmer: string;
  roleBuyer: string;
  roleAdmin: string;
  demoLogin: string;
  sampleDataNotice: string;
  readAloud: string;
  stopReading: string;
  surplus: string;
  shortage: string;
  balanced: string;
  gapFormula: string;
  estimatedDemand: string;
  expectedSupply: string;
  supplyGap: string;
  marketPrice: string;
  actions: string;
  submit: string;
  filter: string;
  allCrops: string;
  allMarkets: string;
  tonnes: string;
  quintal: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    appName: "Smart Krishi Market Advisor",
    tagline: "Agricultural Demand & Supply Intelligence and Decision Support System",
    home: "Home",
    about: "About Project",
    crops: "Crop Intelligence",
    demandSupply: "Demand & Supply",
    recommendations: "Crop Advisory",
    marketPrices: "Market Prices",
    farmerDashboard: "Farmer Dashboard",
    buyerDashboard: "Buyer Dashboard",
    adminDashboard: "Admin Dashboard",
    produceListings: "Produce Listings",
    buyerRequirements: "Buyer Demands",
    voiceAssistant: "Voice Assistant",
    smsDemo: "SMS Simulator",
    helplineDemo: "AI Helpline Call",
    callbackRequest: "Request Callback",
    notifications: "Alerts",
    userManagement: "User Management",
    reports: "Analytics & Reports",
    login: "Login",
    logout: "Logout",
    register: "Register",
    farmerRegister: "Farmer Registration",
    buyerRegister: "Buyer Registration",
    roleFarmer: "Farmer",
    roleBuyer: "Trader / Buyer",
    roleAdmin: "Agronomist / Admin",
    demoLogin: "One-Click Demo Logins",
    sampleDataNotice: "SAMPLE DATA — ACADEMIC PROTOTYPE FOR COLLEGE DEMONSTRATION",
    readAloud: "Read Aloud",
    stopReading: "Stop Audio",
    surplus: "Potential Surplus",
    shortage: "Potential Shortage",
    balanced: "Balanced Supply",
    gapFormula: "Supply Gap = Expected Supply - Estimated Demand",
    estimatedDemand: "Estimated Demand",
    expectedSupply: "Expected Supply",
    supplyGap: "Supply Gap",
    marketPrice: "Average Price",
    actions: "Actions",
    submit: "Submit Request",
    filter: "Filter Records",
    allCrops: "All Crops",
    allMarkets: "All Markets",
    tonnes: "Tonnes",
    quintal: "₹ / Quintal",
  },
  te: {
    appName: "స్మార్ట్ కృషి మార్కెట్ సలహాదారు",
    tagline: "వ్యవసాయ డిమాండ్ మరియు సప్లై విశ్లేషణ, నిర్ణయ సహాయక వ్యవస్థ",
    home: "హోమ్",
    about: "ప్రాజెక్ట్ వివరాలు",
    crops: "పంట సమాచారం",
    demandSupply: "డిమాండ్ & సప్లై",
    recommendations: "పంట సిఫార్సులు",
    marketPrices: "మార్కెట్ ధరలు",
    farmerDashboard: "రైతు డ్యాష్‌బోర్డ్",
    buyerDashboard: "కొనుగోలుదారు డ్యాష్‌బోర్డ్",
    adminDashboard: "అడ్మిన్ డ్యాష్‌బోర్డ్",
    produceListings: "పంట ఉత్పత్తుల జాబితా",
    buyerRequirements: "కొనుగోలు అవసరాలు",
    voiceAssistant: "వాయిస్ అసిస్టెంట్",
    smsDemo: "ఎస్.ఎమ్.ఎస్ డెమో",
    helplineDemo: "హెల్ప్‌లైన్ కాల్ డెమో",
    callbackRequest: "కాల్‌బ్యాక్ అభ్యర్థన",
    notifications: "నోటిఫికేషన్లు",
    userManagement: "వినియోగదారుల నిర్వహణ",
    reports: "నివేదికలు & విశ్లేషణ",
    login: "లాగిన్",
    logout: "లాగ్అవుట్",
    register: "రిజిస్ట్రేషన్",
    farmerRegister: "రైతు నమోదు",
    buyerRegister: "కొనుగోలుదారు నమోదు",
    roleFarmer: "రైతు",
    roleBuyer: "వ్యాపారి / కొనుగోలుదారు",
    roleAdmin: "అడ్మిన్ / నిపుణుడు",
    demoLogin: "డెమో ఖాతాలు",
    sampleDataNotice: "నమూనా డేటా — విద్యా ప్రాజెక్ట్ డెమో మాత్రమే",
    readAloud: "వినండి (వాయిస్)",
    stopReading: "ఆపండి",
    surplus: "అధిక సప్లై (మిగులు)",
    shortage: "సప్లై కొరత",
    balanced: "సమతుల్య మార్కెట్",
    gapFormula: "సప్లై గ్యాప్ = అంచనా సప్లై - అంచనా డిమాండ్",
    estimatedDemand: "అంచనా డిమాండ్",
    expectedSupply: "అంచనా సప్లై",
    supplyGap: "సప్లై వ్యత్యాసం",
    marketPrice: "సగటు ధర",
    actions: "చర్యలు",
    submit: "సమర్పించండి",
    filter: "ఫిల్టర్ చేయండి",
    allCrops: "అన్ని పంటలు",
    allMarkets: "అన్ని మార్కెట్లు",
    tonnes: "టన్నులు",
    quintal: "₹ / క్వింటాలు",
  },
  hi: {
    appName: "स्मार्ट कृषि मार्केट एडवाइजर",
    tagline: "कृषि मांग और आपूर्ति विश्लेषण एवं निर्णय समर्थन प्रणाली",
    home: "होम",
    about: "प्रोजेक्ट परिचय",
    crops: "फसल जानकारी",
    demandSupply: "मांग और आपूर्ति",
    recommendations: "फसल सलाह",
    marketPrices: "मंडी भाव",
    farmerDashboard: "किसान डैशबोर्ड",
    buyerDashboard: "क्रेता डैशबोर्ड",
    adminDashboard: "एडमिन डैशबोर्ड",
    produceListings: "फसल उत्पाद सूची",
    buyerRequirements: "क्रेता आवश्यकताएं",
    voiceAssistant: "वॉयस असिस्टेंट",
    smsDemo: "एसएमएस डेमो",
    helplineDemo: "हेल्पलाइन कॉल डेमो",
    callbackRequest: "कॉलबैक अनुरोध",
    notifications: "सूचनाएं",
    userManagement: "उपयोगकर्ता प्रबंधन",
    reports: "रिपोर्ट और विश्लेषण",
    login: "लॉग इन",
    logout: "लॉग आउट",
    register: "पंजीकरण",
    farmerRegister: "किसान पंजीकरण",
    buyerRegister: "क्रेता पंजीकरण",
    roleFarmer: "किसान",
    roleBuyer: "क्रेता / व्यापारी",
    roleAdmin: "कृषि विशेषज्ञ / एडमिन",
    demoLogin: "डेमो लॉगिन",
    sampleDataNotice: "सैंपल डेटा — कॉलेज डेमो के लिए प्रोटोटाइप",
    readAloud: "सुनें (स्पीच)",
    stopReading: "रोकें",
    surplus: "अधिशेष (सरप्लस)",
    shortage: "आपूर्ति की कमी",
    balanced: "संतुलित आपूर्ति",
    gapFormula: "सप्लाई गैप = अनुमानित सप्लाई - अनुमानित मांग",
    estimatedDemand: "अनुमानित मांग",
    expectedSupply: "अनुमानित आपूर्ति",
    supplyGap: "आपूर्ति अंतर",
    marketPrice: "औसत मूल्य",
    actions: "कार्रवाई",
    submit: "जमा करें",
    filter: "फ़िल्टर करें",
    allCrops: "सभी फसलें",
    allMarkets: "सभी मंडियां",
    tonnes: "टन",
    quintal: "₹ / क्विंटल",
  },
};
