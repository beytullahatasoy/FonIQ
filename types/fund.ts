export type RiskLevel = "Düşük" | "Orta" | "Yüksek";

export type Fund = {
  code: string; // "MAC" → fon kartında, API isteğinde
  name: string; // "Fon adı" → fon kartında, detay sayfasında
  category: string; // "Hisse" → filtreleme ekranında
  return1m: number; // 4.2 → fon kartında, karşılaştırma tablosunda
  return3m: number; // 11.4 → detay sayfası grafiğinde
  return6m: number; // 18.2 → detay sayfası grafiğinde
  return1y: number; // 42.0 → detay sayfası grafiğinde
  risk: RiskLevel; // "Orta" → RiskBadge bileşeninde, AI yorumunda
  size: number; // fon büyüklüğü → detay sayfasında
  investorCount: number; // yatırımcı sayısı → detay sayfasında
};
