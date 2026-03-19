import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Animated,
} from "react-native";
import { useRef } from "react";
import { Fund } from "../types/fund";

type Props = {
  fund: Fund;
  onPress: (fund: Fund) => void;
};

export default function FundCard({ fund, onPress }: Props) {
  const scale = useRef(new Animated.Value(1)).current;
  const isPositive = fund.return1m >= 0;

  const riskColor = { Düşük: "#059669", Orta: "#D97706", Yüksek: "#DC2626" }[
    fund.risk
  ];
  const riskBg = { Düşük: "#ECFDF5", Orta: "#FFFBEB", Yüksek: "#FEF2F2" }[
    fund.risk
  ];

  const onPressIn = () =>
    Animated.spring(scale, {
      toValue: 0.97,
      useNativeDriver: true,
      speed: 50,
    }).start();
  const onPressOut = () =>
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
    }).start();

  return (
    <Animated.View style={[styles.wrapper, { transform: [{ scale }] }]}>
      <TouchableOpacity
        style={styles.card}
        onPress={() => onPress(fund)}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        activeOpacity={1}
      >
        <View style={styles.top}>
          <Text style={styles.code}>{fund.code}</Text>
          <View style={[styles.badge, { backgroundColor: riskBg }]}>
            <Text style={[styles.badgeText, { color: riskColor }]}>
              {fund.risk}
            </Text>
          </View>
        </View>

        <Text style={styles.name} numberOfLines={1}>
          {fund.name}
        </Text>

        <View style={styles.bottom}>
          <Text style={styles.category}>{fund.category}</Text>
          <Text
            style={[
              styles.return,
              { color: isPositive ? "#059669" : "#DC2626" },
            ]}
          >
            {isPositive ? "+" : ""}
            {fund.return1m.toFixed(2)}%
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 16,
    marginBottom: 10,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 5,
  },
  top: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  code: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
    letterSpacing: 0.3,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "600",
  },
  name: {
    fontSize: 13,
    color: "#64748B",
    marginBottom: 14,
    lineHeight: 18,
  },
  bottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  category: {
    fontSize: 12,
    color: "#94A3B8",
    fontWeight: "500",
  },
  return: {
    fontSize: 24,
    fontWeight: "700",
    letterSpacing: -0.5,
  },
});
