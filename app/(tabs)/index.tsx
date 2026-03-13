import { useEffect, useState } from "react";
import {
  View,
  FlatList,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Text,
} from "react-native";
import { useRouter } from "expo-router";
import { Fund } from "../../types/fund";
import { getFunds } from "../../services/tefas";
import FundCard from "../../components/FundCard";
import { Colors } from "../../constants/colors";

export default function KesfetScreen() {
  const [funds, setFunds] = useState<Fund[]>([]);
  const [filtered, setFiltered] = useState<Fund[]>([]);
  const [search, setSearch] = useState("");
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
    setFiltered(
      funds.filter(
        (f) =>
          f.code.toLowerCase().includes(q) || f.name.toLowerCase().includes(q),
      ),
    );
  }, [search, funds]);

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
      <TextInput
        style={styles.search}
        placeholder="Fon ara (kod veya isim)..."
        value={search}
        onChangeText={setSearch}
        placeholderTextColor={Colors.textSecondary}
      />
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.code}
        renderItem={({ item }) => (
          <FundCard
            fund={item}
            onPress={(fund) => router.push(`/fund/${fund.code}`)}
          />
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: 16,
  },
  search: {
    margin: 16,
    padding: 12,
    backgroundColor: Colors.card,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    fontSize: 14,
    color: Colors.text,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  error: {
    color: Colors.danger,
    fontSize: 16,
  },
});
