import { useEffect, useState } from "react";
import {
  View,
  FlatList,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { Fund } from "../../types/fund";
import { getFunds } from "../../services/tefas";
import FundCard from "../../components/FundCard";
import { Colors } from "../../constants/colors";

const CATEGORIES = [
  "Tümü",
  "Hisse Senedi",
  "Karma",
  "Tahvil",
  "Altın",
  "Para Piyasası",
];

export default function KesfetScreen() {
  const [funds, setFunds] = useState<Fund[]>([]);
  const [filtered, setFiltered] = useState<Fund[]>([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Tümü");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    getFunds()
      .then((data) => {
        setFunds(data);
        setFiltered(data);
      })
      .catch(() => setError("Veriler yüklenemedi."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();

    let result = funds.filter(
      (f) =>
        f.code.toLowerCase().includes(q) || f.name.toLowerCase().includes(q),
    );

    if (activeCategory !== "Tümü") {
      result = result.filter((f) => f.category === activeCategory);
    }

    setFiltered(result);
  }, [search, funds, activeCategory]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header Bloğu */}
      <View style={styles.headerBlock}>
        <View style={styles.heroRow}>
          <View>
            <Text style={styles.logo}>FonIQ</Text>
          </View>

          <View style={styles.sloganContainer}>
            <Text style={styles.sloganLabel}>Yapay Zeka Destekli</Text>

            <Text style={styles.slogan}>Akıllı fon analizi</Text>
          </View>
        </View>

        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>⌕</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Fon kodu veya adı..."
            value={search}
            onChangeText={setSearch}
            placeholderTextColor="#94A3B8"
          />
          {search.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearch("")}
              style={styles.clearBtn}
              activeOpacity={0.7}
            >
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryContainer}
        >
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;

            return (
              <TouchableOpacity
                key={cat}
                style={[styles.chip, isActive && styles.chipActive]}
                onPress={() => setActiveCategory(cat)}
                activeOpacity={0.85}
              >
                <Text
                  style={[styles.chipText, isActive && styles.chipTextActive]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Liste */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.code}
        renderItem={({ item }) => (
          <FundCard
            fund={item}
            onPress={(f) => router.push(`/fund/${f.code}`)}
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Sonuç bulunamadı</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
  },

  error: {
    color: Colors.danger,
    fontSize: 14,
  },

  headerBlock: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },

  heroRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 10,
  },

  logo: {
    fontSize: 26,
    fontWeight: "700",
    letterSpacing: -0.5,
    color: "#111827",
    marginTop: 4,
    alignItems: "center",
  },

  sloganContainer: {
    alignItems: "flex-end",
    paddingBottom: 4,
  },

  sloganLabel: {
    fontSize: 10,
    color: "#CBD5E1",
    fontWeight: "500",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 0.5,
  },

  slogan: {
    fontSize: 12,
    color: "#94A3B8",
    fontWeight: "500",
    textAlign: "right",
    lineHeight: 17,
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",

    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    paddingHorizontal: 14,
    height: 50,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },

  searchIcon: {
    fontSize: 18,
    color: "#94A3B8",
    marginRight: 10,
  },

  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#0F172A",
  },

  clearBtn: {
    padding: 4,
    marginLeft: 6,
  },

  clearIcon: {
    fontSize: 12,
    color: "#94A3B8",
  },

  categoryContainer: {
    gap: 8,
    alignItems: "center",
    paddingRight: 8,
  },

  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  chipActive: {
    backgroundColor: "#0F172A",
    borderColor: "#0F172A",
  },

  chipText: {
    fontSize: 13,
    color: "#64748B",
    fontWeight: "500",
  },

  chipTextActive: {
    color: "#FFFFFF",
    fontWeight: "600",
  },

  listContent: {
    paddingTop: 10,
    paddingBottom: 110,
  },

  empty: {
    alignItems: "center",
    paddingTop: 60,
  },

  emptyText: {
    fontSize: 14,
    color: "#94A3B8",
  },
});
