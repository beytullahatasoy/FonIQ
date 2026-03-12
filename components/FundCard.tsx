import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Fund } from "../types/fund";
import { Colors } from "../constants/colors";
import RiskBadge from "./RiskBadge";

type Props = {
  fund: Fund;
  onPress: (fund: Fund) => void;
};

export default function FundCard({ fund, onPress }: Props) {
  const isPositive = fund.return1m >= 0;

  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(fund)}>
      <View style={styles.header}>
        <View>
          <Text style={styles.code}>{fund.code}</Text>
          <Text style={styles.name} numberOfLines={2}>
            {fund.name}
          </Text>
        </View>
        <RiskBadge risk={fund.risk} />
      </View>

      <View style={styles.footer}>
        <Text style={styles.category}>{fund.category}</Text>
        <Text
          style={[
            styles.return,
            { color: isPositive ? Colors.success : Colors.danger },
          ]}
        >
          {isPositive ? "+" : ""}
          {fund.return1m.toFixed(2)}%
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  code: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.primary,
  },
  name: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
    maxWidth: 200,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  category: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  return: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
