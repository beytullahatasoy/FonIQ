import { create } from "zustand";
import { Fund } from "../types/fund";

type CompareStore = {
  funds: Fund[];
  addFund: (fund: Fund) => void;
  removeFund: (code: string) => void;
  clearFunds: () => void;
};

export const useCompareStore = create<CompareStore>((set) => ({
  funds: [],
  addFund: (fund) =>
    set((state) => ({
      funds: state.funds.length < 2 ? [...state.funds, fund] : state.funds,
    })),
  removeFund: (code) =>
    set((state) => ({
      funds: state.funds.filter((f) => f.code !== code),
    })),
  clearFunds: () => set({ funds: [] }),
}));
