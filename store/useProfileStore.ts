import { create } from "zustand";
import { RiskLevel } from "../types/fund";

type ProfileStore = {
  riskLevel: RiskLevel | null;
  setRiskLevel: (level: RiskLevel) => void;
};

export const useProfileStore = create<ProfileStore>((set) => ({
  riskLevel: null,
  setRiskLevel: (level) => set({ riskLevel: level }),
}));
