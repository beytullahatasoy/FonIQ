import { Config } from "../constants/config";
import { Fund, RiskLevel } from "../types/fund";

export const getFundComment = async (
  fund: Fund,
  userRisk: RiskLevel | null,
): Promise<string> => {
  const prompt = `
    Sen bir finans asistanısın. Türkçe, sade ve anlaşılır yaz.
    
    Fon Bilgileri:
    - Fon Adı: ${fund.name} (${fund.code})
    - Kategori: ${fund.category}
    - 1 Aylık Getiri: %${fund.return1m}
    - 3 Aylık Getiri: %${fund.return3m}
    - 1 Yıllık Getiri: %${fund.return1y}
    - Risk Seviyesi: ${fund.risk}
    - Fon Büyüklüğü: ${fund.size} TL
    - Kullanıcının Risk Toleransı: ${userRisk ?? "Belirtilmemiş"}
    
    Bu fonu 3-4 cümleyle yorumla. Yatırım tavsiyesi verme.
  `;

  const response = await fetch(
    `${Config.GEMINI_API_URL}?key=${Config.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    },
  );

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
};
