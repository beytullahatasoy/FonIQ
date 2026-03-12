import { View, Text, StyleSheet } from "react-native";

type Props = {
  code: string;
};

export default function FundChart({ code }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Grafik yakında — {code}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F7FA",
    borderRadius: 12,
    margin: 16,
  },
  text: {
    color: "#888",
  },
});
