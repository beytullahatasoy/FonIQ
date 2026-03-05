export type RiskLevel = "Düşük" | "Orta" | "Yüksek";

export type Fund = {
  code: string; // "MAC"
  name: string; // "Fon adı"
  category: string; // "Hisse Senedi"
  return1m: number; // 4.2
  return3m: number; // 11.4
  return6m: number; // 18.2
  return1y: number; // 42.0
  risk: RiskLevel;
  size: number; // Fon büyüklüğü (TL)
  investorCount: number;
};
