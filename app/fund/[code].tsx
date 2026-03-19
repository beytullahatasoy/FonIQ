import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { Fund } from "../../types/fund";
import { getFundByCode } from "../../services/tefas";
import { getFundComment } from "../../services/gemini";
import { Colors } from "../../constants/colors";
import { useCompareStore } from "../../store/useCompareStore";
import { useProfileStore } from "../../store/useProfileStore";

export default function FundDetailScreen() {
  const { code } = useLocalSearchParams<{ code: string }>();
  const [fund, setFund] = useState<Fund | null>(null);
  const [loading, setLoading] = useState(true);
  const [aiComment, setAiComment] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const router = useRouter();
  const { addFund, funds: compareFunds } = useCompareStore();
  const { riskLevel } = useProfileStore();

  useEffect(() => {
    if (code) {
      getFundByCode(code)
        .then(setFund)
        .finally(() => setLoading(false));
    }
  }, [code]);

  const handleAI = async () => {
    if (!fund) return;
    setAiLoading(true);
    try {
      const comment = await getFundComment(fund, riskLevel || "Orta");
      setAiComment(comment);
    } catch {
      setAiComment("AI yorumu alınamadı.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleCompare = () => {
    if (!fund) return;
    if (compareFunds.length >= 2) {
      Alert.alert("Uyarı", "En fazla 2 fon karşılaştırabilirsiniz.");
      return;
    }
    addFund(fund);
    Alert.alert("Eklendi", `${fund.code} karşılaştırmaya eklendi.`, [
      { text: "Karşılaştırmaya Git", onPress: () => router.push("/compare") },
      { text: "Tamam" },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0F172A" />
      </View>
    );
  }

  if (!fund) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Fon bulunamadı.</Text>
      </View>
    );
  }

  const riskColor = { Düşük: "#059669", Orta: "#D97706", Yüksek: "#DC2626" }[
    fund.risk
  ];
  const riskBg = { Düşük: "#ECFDF5", Orta: "#FFFBEB", Yüksek: "#FEF2F2" }[
    fund.risk
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.headerBlock}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color="#0F172A" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Text style={styles.code}>{fund.code}</Text>
            <Text style={styles.name}>{fund.name}</Text>
            <Text style={styles.category}>{fund.category}</Text>
          </View>
          <View style={[styles.riskBadge, { backgroundColor: riskBg }]}>
            <Text style={[styles.riskText, { color: riskColor }]}>
              {fund.risk}
            </Text>
          </View>
        </View>
      </View>

      {/* Getiri Grid */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Getiri Performansı</Text>
        <View style={styles.returnsGrid}>
          {[
            { label: "1 Aylık", value: fund.return1m },
            { label: "3 Aylık", value: fund.return3m },
            { label: "6 Aylık", value: fund.return6m },
            { label: "1 Yıllık", value: fund.return1y },
          ].map((item) => (
            <View key={item.label} style={styles.returnCard}>
              <Text style={styles.returnLabel}>{item.label}</Text>
              <Text
                style={[
                  styles.returnValue,
                  { color: item.value >= 0 ? "#059669" : "#DC2626" },
                ]}
              >
                {item.value >= 0 ? "+" : ""}
                {item.value.toFixed(2)}%
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Fon Bilgileri */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Fon Bilgileri</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <View style={styles.infoLeft}>
              <Feather name="trending-up" size={14} color="#94A3B8" />
              <Text style={styles.infoLabel}>Portföy Büyüklüğü</Text>
            </View>
            <Text style={styles.infoValue}>
              ₺{(fund.size / 1_000_000).toFixed(0)}M
            </Text>
          </View>
          <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
            <View style={styles.infoLeft}>
              <Feather name="users" size={14} color="#94A3B8" />
              <Text style={styles.infoLabel}>Yatırımcı Sayısı</Text>
            </View>
            <Text style={styles.infoValue}>
              {fund.investorCount.toLocaleString("tr-TR")}
            </Text>
          </View>
        </View>
      </View>

      {/* Aksiyonlar */}
      <View style={styles.section}>
        <TouchableOpacity
          style={styles.aiButton}
          onPress={handleAI}
          disabled={aiLoading}
        >
          {aiLoading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <Feather name="zap" size={16} color="#fff" />
              <Text style={styles.aiButtonText}>AI ile Yorumla</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.compareButton} onPress={handleCompare}>
          <Feather name="bar-chart-2" size={16} color="#0F172A" />
          <Text style={styles.compareButtonText}>Karşılaştırmaya Ekle</Text>
        </TouchableOpacity>
      </View>

      {/* AI Yorum */}
      {aiComment !== "" && (
        <View style={styles.section}>
          <View style={styles.aiCommentCard}>
            <View style={styles.aiCommentHeader}>
              <Feather name="zap" size={14} color="#0F172A" />
              <Text style={styles.aiCommentTitle}>AI Yorumu</Text>
            </View>
            <Text style={styles.aiCommentText}>{aiComment}</Text>
          </View>
        </View>
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
  },
  error: { color: "#DC2626", fontSize: 14 },

  headerBlock: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  headerLeft: { flex: 1, marginRight: 12 },
  code: {
    fontSize: 32,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -1,
    marginBottom: 4,
  },
  name: {
    fontSize: 14,
    color: "#64748B",
    lineHeight: 20,
    marginBottom: 4,
  },
  category: {
    fontSize: 12,
    color: "#94A3B8",
    fontWeight: "500",
  },
  riskBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    marginTop: 4,
  },
  riskText: { fontSize: 11, fontWeight: "700" },

  section: { paddingHorizontal: 16, paddingTop: 20 },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#94A3B8",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginBottom: 10,
  },

  returnsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  returnCard: {
    width: "47.5%",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  returnLabel: {
    fontSize: 11,
    color: "#94A3B8",
    fontWeight: "500",
    marginBottom: 6,
  },
  returnValue: {
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: -0.5,
  },

  infoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F8FAFC",
  },
  infoLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  infoLabel: { fontSize: 13, color: "#64748B" },
  infoValue: { fontSize: 14, fontWeight: "700", color: "#0F172A" },

  aiButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#0F172A",
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
  },
  aiButtonText: { color: "#fff", fontSize: 15, fontWeight: "700" },

  compareButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  compareButtonText: { color: "#0F172A", fontSize: 15, fontWeight: "600" },

  aiCommentCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  aiCommentHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 10,
  },
  aiCommentTitle: { fontSize: 13, fontWeight: "700", color: "#0F172A" },
  aiCommentText: { fontSize: 14, color: "#475569", lineHeight: 22 },
});
