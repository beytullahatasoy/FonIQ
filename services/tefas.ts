import { Fund, RiskLevel } from "../types/fund";
import { Config } from "../constants/config";

// Risk skorunu RiskLevel'a çevirir
const mapRisk = (score: number): RiskLevel => {
  if (score <= 2) return "Düşük";
  if (score <= 4) return "Orta";
  return "Yüksek";
};

// Tüm fonları çek
export const getFunds = async (): Promise<Fund[]> => {
  const response = await fetch(`${Config.TEFAS_BASE_URL}/BindFundBasket`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: "fontip=YAT",
  });

  const data = await response.json();

  return data.data.map((item: any) => ({
    code: item.FONKODU,
    name: item.FONUNVAN,
    category: item.FONTIPI,
    return1m: parseFloat(item.GETIRI1AY) || 0,
    return3m: parseFloat(item.GETIRI3AY) || 0,
    return6m: parseFloat(item.GETIRI6AY) || 0,
    return1y: parseFloat(item.GETIRI1YIL) || 0,
    risk: mapRisk(parseInt(item.RISKDEGERI) || 3),
    size: parseFloat(item.PORTFOYBUYUKLUK) || 0,
    investorCount: parseInt(item.YATIRIMCISAYISI) || 0,
  }));
};
