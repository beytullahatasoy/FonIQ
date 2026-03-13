import { Fund } from "../types/fund";

const BACKEND_URL = "http://10.126.222.196:3000"; // Android emülatör için

export const getFunds = async (): Promise<Fund[]> => {
  const response = await fetch(`${BACKEND_URL}/api/funds`);
  const data = await response.json();
  return data;
};

export const getFundByCode = async (code: string): Promise<Fund | null> => {
  const response = await fetch(`${BACKEND_URL}/api/funds/${code}`);
  if (!response.ok) return null;
  const data = await response.json();
  return data;
};
