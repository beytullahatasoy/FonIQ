import { Fund, RiskLevel } from "../types/fund";

const mapRisk = (score: number): RiskLevel => {
  if (score <= 2) return "Düşük";
  if (score <= 4) return "Orta";
  return "Yüksek";
};

export const getFunds = async (): Promise<Fund[]> => {
  const response = await fetch(`https://www.tefas.gov.tr/Api/DB/BindFundList`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Referer: "https://www.tefas.gov.tr/",
      "X-Requested-With": "XMLHttpRequest",
    },
    body: "fontip=YAT",
  });

  const text = await response.text();
  console.log("TEFAS raw:", text.slice(0, 500));
  return [];
};
