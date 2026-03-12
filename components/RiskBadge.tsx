import { View, Text, StyleSheet } from "react-native";
import { RiskLevel } from "../types/fund";
import { Colors } from "../constants/colors";

type Props = {
  risk: RiskLevel;
};

export default function RiskBadge({ risk }: Props) {
  const color =
    risk === "Düşük"
      ? Colors.low
      : risk === "Orta"
        ? Colors.medium
        : Colors.high;

  return (
    <View style={[styles.badge, { backgroundColor: color }]}>
      <Text style={styles.text}>{risk} Risk</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  text: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
});
