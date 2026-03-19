import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useCompareStore } from "../../store/useCompareStore";
import { Colors } from "../../constants/colors";

export default function CompareScreen() {
  const { funds, removeFund, clearFunds } = useCompareStore();
  const router = useRouter();

  const metrics = [
    { label: "1 Aylık", key: "return1m" },
    { label: "3 Aylık", key: "return3m" },
    { label: "6 Aylık", key: "return6m" },
    { label: "1 Yıllık", key: "return1y" },
    { label: "Portföy", key: "size" },
    { label: "Yatırımcı", key: "investorCount" },
  ];

  const formatValue = (key: string, value: number) => {
    if (key === "size") return `₺${(value / 1_000_000).toFixed(0)}M`;
    if (key === "investorCount") return value.toLocaleString("tr-TR");
    return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
  };

  const isReturn = (key: string) => key.startsWith("return");

  const getBetter = (key: string) => {
    if (funds.length < 2) return null;
    const a = funds[0][key as keyof (typeof funds)[0]] as number;
    const b = funds[1][key as keyof (typeof funds)[1]] as number;
    if (a > b) return 0;
    if (b > a) return 1;
    return null;
  };

  const riskColor = (risk: string) =>
    ({ Düşük: "#059669", Orta: "#D97706", Yüksek: "#DC2626" })[risk] ??
    "#64748B";
  const riskBg = (risk: string) =>
    ({ Düşük: "#ECFDF5", Orta: "#FFFBEB", Yüksek: "#FEF2F2" })[risk] ??
    "#F1F5F9";

  if (funds.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.headerBlock}>
          <Text style={styles.pageTitle}>Karşılaştır</Text>
          <Text style={styles.pageSubtitle}>
            2 fon seç, yan yana karşılaştır
          </Text>
        </View>
        <View style={styles.emptyState}>
          <View style={styles.emptyIconWrapper}>
            <Feather name="bar-chart-2" size={32} color="#94A3B8" />
          </View>
          <Text style={styles.emptyTitle}>Henüz fon eklenmedi</Text>
          <Text style={styles.emptyText}>
            Fon detay sayfasından "Karşılaştırmaya Ekle" butonuna bas.
          </Text>
          <TouchableOpacity
            style={styles.goButton}
            onPress={() => router.push("/")}
          >
            <Text style={styles.goButtonText}>Fonlara Git</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerBlock}>
        <Text style={styles.pageTitle}>Karşılaştır</Text>
        <Text style={styles.pageSubtitle}>{funds.length}/2 fon seçildi</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Fon Kartları */}
        <View style={styles.fundCardsRow}>
          {funds.map((fund) => (
            <View key={fund.code} style={styles.fundCard}>
              <View style={styles.fundCardTop}>
                <Text style={styles.fundCode}>{fund.code}</Text>
                <TouchableOpacity
                  onPress={() => removeFund(fund.code)}
                  style={styles.removeBtn}
                >
                  <Feather name="x" size={14} color="#94A3B8" />
                </TouchableOpacity>
              </View>
              <Text style={styles.fundName} numberOfLines={2}>
                {fund.name}
              </Text>
              <View
                style={[
                  styles.riskBadge,
                  { backgroundColor: riskBg(fund.risk) },
                ]}
              >
                <Text
                  style={[styles.riskText, { color: riskColor(fund.risk) }]}
                >
                  {fund.risk}
                </Text>
              </View>
            </View>
          ))}

          {funds.length === 1 && (
            <TouchableOpacity
              style={styles.addFundCard}
              onPress={() => router.push("/")}
            >
              <Feather name="plus" size={24} color="#CBD5E1" />
              <Text style={styles.addFundText}>Fon Ekle</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Metrik Tablosu */}
        <View style={styles.metricsCard}>
          {metrics.map((metric, idx) => {
            const better = getBetter(metric.key);
            return (
              <View
                key={metric.key}
                style={[styles.metricRow, idx === 0 && { borderTopWidth: 0 }]}
              >
                <Text style={styles.metricLabel}>{metric.label}</Text>
                <View style={styles.metricValues}>
                  {funds.map((fund, i) => {
                    const value = fund[
                      metric.key as keyof typeof fund
                    ] as number;
                    const isBetter = better === i;
                    const isRet = isReturn(metric.key);
                    return (
                      <View
                        key={fund.code}
                        style={[
                          styles.metricValueBox,
                          isBetter && styles.metricValueBoxBetter,
                        ]}
                      >
                        <Text
                          style={[
                            styles.metricValue,
                            isRet && {
                              color: value >= 0 ? "#059669" : "#DC2626",
                            },
                            isBetter && styles.metricValueBetter,
                          ]}
                        >
                          {formatValue(metric.key, value)}
                        </Text>
                      </View>
                    );
                  })}
                  {funds.length === 1 && (
                    <View style={styles.metricValueBox}>
                      <Text style={styles.metricValueEmpty}>—</Text>
                    </View>
                  )}
                </View>
              </View>
            );
          })}
        </View>

        {funds.length === 2 && (
          <TouchableOpacity style={styles.clearButton} onPress={clearFunds}>
            <Feather name="trash-2" size={15} color="#DC2626" />
            <Text style={styles.clearButtonText}>Karşılaştırmayı Temizle</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },

  headerBlock: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.8,
  },
  pageSubtitle: {
    fontSize: 13,
    color: "#94A3B8",
    marginTop: 3,
  },

  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  emptyIconWrapper: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: "#94A3B8",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  },
  goButton: {
    backgroundColor: "#0F172A",
    borderRadius: 14,
    paddingHorizontal: 28,
    paddingVertical: 14,
  },
  goButtonText: { color: "#FFFFFF", fontWeight: "700", fontSize: 14 },

  fundCardsRow: {
    flexDirection: "row",
    padding: 16,
    gap: 10,
  },
  fundCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  fundCardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  fundCode: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: 0.3,
  },
  removeBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },
  fundName: {
    fontSize: 11,
    color: "#64748B",
    lineHeight: 16,
    marginBottom: 10,
  },
  riskBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  riskText: { fontSize: 10, fontWeight: "600" },

  addFundCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    borderStyle: "dashed",
    gap: 8,
    minHeight: 120,
  },
  addFundText: { fontSize: 12, color: "#94A3B8", fontWeight: "500" },

  metricsCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  metricRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: "#F8FAFC",
  },
  metricLabel: {
    width: 72,
    fontSize: 12,
    color: "#94A3B8",
    fontWeight: "500",
  },
  metricValues: {
    flex: 1,
    flexDirection: "row",
    gap: 8,
  },
  metricValueBox: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 6,
    borderRadius: 8,
  },
  metricValueBoxBetter: {
    backgroundColor: "#F0FDF4",
  },
  metricValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
  },
  metricValueBetter: {
    color: "#059669",
  },
  metricValueEmpty: {
    fontSize: 14,
    color: "#CBD5E1",
  },

  clearButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    margin: 16,
    marginTop: 12,
    backgroundColor: "#FEF2F2",
    borderRadius: 14,
    padding: 14,
  },
  clearButtonText: { color: "#DC2626", fontWeight: "600", fontSize: 14 },
});
