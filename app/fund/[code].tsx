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
import { Fund } from "../../types/fund";
import { getFundByCode } from "../../services/tefas";
import { getFundComment } from "../../services/gemini";
import RiskBadge from "../../components/RiskBadge";
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
      Alert.alert(
        "Uyarı",
        "Karşılaştırmak için en fazla 2 fon seçebilirsiniz.",
      );
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
        <ActivityIndicator size="large" color={Colors.primary} />
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

  return (
    <ScrollView style={styles.container}>
      {/* Başlık */}
      <View style={styles.header}>
        <View>
          <Text style={styles.code}>{fund.code}</Text>
          <Text style={styles.name}>{fund.name}</Text>
          <Text style={styles.category}>{fund.category}</Text>
        </View>
        <RiskBadge risk={fund.risk} />
      </View>

      {/* Getiri Kartları */}
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
                { color: item.value >= 0 ? Colors.success : Colors.danger },
              ]}
            >
              {item.value >= 0 ? "+" : ""}
              {item.value.toFixed(2)}%
            </Text>
          </View>
        ))}
      </View>

      {/* Detay Bilgileri */}
      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Portföy Büyüklüğü</Text>
          <Text style={styles.infoValue}>
            ₺{(fund.size / 1_000_000).toFixed(0)}M
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Yatırımcı Sayısı</Text>
          <Text style={styles.infoValue}>
            {fund.investorCount.toLocaleString("tr-TR")}
          </Text>
        </View>
      </View>

      {/* Butonlar */}
      <TouchableOpacity
        style={styles.aiButton}
        onPress={handleAI}
        disabled={aiLoading}
      >
        {aiLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.aiButtonText}>✨ AI ile Yorumla</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.compareButton} onPress={handleCompare}>
        <Text style={styles.compareButtonText}>⚖️ Karşılaştırmaya Ekle</Text>
      </TouchableOpacity>

      {/* AI Yorum */}
      {aiComment !== "" && (
        <View style={styles.aiCommentCard}>
          <Text style={styles.aiCommentTitle}>AI Yorumu</Text>
          <Text style={styles.aiCommentText}>{aiComment}</Text>
        </View>
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  error: { color: Colors.danger, fontSize: 16 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: 20,
    backgroundColor: Colors.card,
    margin: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  code: { fontSize: 28, fontWeight: "bold", color: Colors.primary },
  name: { fontSize: 14, color: Colors.text, marginTop: 4, maxWidth: 220 },
  category: { fontSize: 12, color: Colors.textSecondary, marginTop: 4 },
  returnsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    gap: 8,
  },
  returnCard: {
    width: "47%",
    backgroundColor: Colors.card,
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
  },
  returnLabel: { fontSize: 12, color: Colors.textSecondary },
  returnValue: { fontSize: 20, fontWeight: "bold", marginTop: 4 },
  infoCard: {
    margin: 16,
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  infoLabel: { color: Colors.textSecondary, fontSize: 14 },
  infoValue: { color: Colors.text, fontSize: 14, fontWeight: "600" },
  aiButton: {
    margin: 16,
    marginBottom: 8,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  aiButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  compareButton: {
    marginHorizontal: 16,
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  compareButtonText: { color: Colors.primary, fontSize: 16, fontWeight: "600" },
  aiCommentCard: {
    margin: 16,
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  aiCommentTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 8,
  },
  aiCommentText: { fontSize: 14, color: Colors.text, lineHeight: 22 },
});
