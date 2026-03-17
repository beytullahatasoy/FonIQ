import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { useCompareStore } from "../../store/useCompareStore";
import RiskBadge from "../../components/RiskBadge";
import { Colors } from "../../constants/colors";

export default function CompareScreen() {
  const { funds, removeFund, clearFunds } = useCompareStore();
  const router = useRouter();

  if (funds.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyIcon}>⚖️</Text>
        <Text style={styles.emptyTitle}>Karşılaştırma Boş</Text>
        <Text style={styles.emptyText}>
          Fon detay sayfasından "Karşılaştırmaya Ekle" butonuna basarak 2 fon
          seç.
        </Text>
        <TouchableOpacity
          style={styles.goButton}
          onPress={() => router.push("/")}
        >
          <Text style={styles.goButtonText}>Fonlara Git</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const metrics = [
    { label: "1 Aylık Getiri", key: "return1m" },
    { label: "3 Aylık Getiri", key: "return3m" },
    { label: "6 Aylık Getiri", key: "return6m" },
    { label: "1 Yıllık Getiri", key: "return1y" },
    { label: "Portföy Büyüklüğü", key: "size" },
    { label: "Yatırımcı Sayısı", key: "investorCount" },
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

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Karşılaştırma</Text>

      {/* Fon Başlıkları */}
      <View style={styles.headerRow}>
        <View style={styles.labelCol} />
        {funds.map((fund, i) => (
          <View key={fund.code} style={styles.fundCol}>
            <Text style={styles.fundCode}>{fund.code}</Text>
            <Text style={styles.fundName} numberOfLines={2}>
              {fund.name}
            </Text>
            <RiskBadge risk={fund.risk} />
            <TouchableOpacity
              onPress={() => removeFund(fund.code)}
              style={styles.removeBtn}
            >
              <Text style={styles.removeBtnText}>✕ Kaldır</Text>
            </TouchableOpacity>
          </View>
        ))}
        {funds.length === 1 && (
          <View style={[styles.fundCol, styles.emptyFundCol]}>
            <Text style={styles.addFundText}>+ Fon Ekle</Text>
            <TouchableOpacity
              style={styles.goButton}
              onPress={() => router.push("/")}
            >
              <Text style={styles.goButtonText}>Fonlara Git</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Metrik Satırları */}
      {metrics.map((metric) => {
        const better = getBetter(metric.key);
        return (
          <View key={metric.key} style={styles.metricRow}>
            <Text style={styles.metricLabel}>{metric.label}</Text>
            {funds.map((fund, i) => {
              const value = fund[metric.key as keyof typeof fund] as number;
              const isBetter = better === i;
              const isReturn_ = isReturn(metric.key);
              return (
                <View
                  key={fund.code}
                  style={[styles.metricValueCol, isBetter && styles.betterCol]}
                >
                  <Text
                    style={[
                      styles.metricValue,
                      isReturn_ && {
                        color: value >= 0 ? Colors.success : Colors.danger,
                      },
                      isBetter && styles.betterText,
                    ]}
                  >
                    {formatValue(metric.key, value)}
                  </Text>
                </View>
              );
            })}
            {funds.length === 1 && <View style={styles.metricValueCol} />}
          </View>
        );
      })}

      {funds.length === 2 && (
        <TouchableOpacity style={styles.clearButton} onPress={clearFunds}>
          <Text style={styles.clearButtonText}>Karşılaştırmayı Temizle</Text>
        </TouchableOpacity>
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  title: { fontSize: 24, fontWeight: "bold", color: Colors.text, padding: 16 },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  emptyIcon: { fontSize: 48, marginBottom: 16 },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
  },
  goButton: {
    marginTop: 16,
    backgroundColor: Colors.primary,
    borderRadius: 10,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  goButtonText: { color: "#fff", fontWeight: "600" },
  headerRow: { flexDirection: "row", padding: 16, gap: 8 },
  labelCol: { width: 100 },
  fundCol: { flex: 1, alignItems: "center", gap: 6 },
  emptyFundCol: {
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    padding: 12,
    borderStyle: "dashed",
  },
  addFundText: { color: Colors.textSecondary, fontSize: 13, marginBottom: 8 },
  fundCode: { fontSize: 20, fontWeight: "bold", color: Colors.primary },
  fundName: { fontSize: 11, color: Colors.textSecondary, textAlign: "center" },
  removeBtn: {
    marginTop: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.danger,
  },
  removeBtnText: { color: Colors.danger, fontSize: 11 },
  metricRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  metricLabel: { width: 100, fontSize: 12, color: Colors.textSecondary },
  metricValueCol: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 4,
    borderRadius: 6,
  },
  betterCol: { backgroundColor: `${Colors.success}20` },
  metricValue: { fontSize: 14, fontWeight: "600", color: Colors.text },
  betterText: { color: Colors.success },
  clearButton: {
    margin: 16,
    backgroundColor: Colors.danger,
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
  },
  clearButtonText: { color: "#fff", fontWeight: "600", fontSize: 15 },
});
