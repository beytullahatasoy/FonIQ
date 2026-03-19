import { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { Config } from "../../constants/config";

type Message = {
  id: string;
  text: string;
  isUser: boolean;
};

export default function AIScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "0",
      text: "Merhaba! Ben FonIQ AI asistanınım. Türk yatırım fonları hakkında sorularınızı yanıtlayabilirim. Ne öğrenmek istersiniz?",
      isUser: false,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const listRef = useRef<FlatList>(null);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: input.trim(),
      isUser: true,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(
        `${Config.GEMINI_API_URL}?key=${Config.GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `Sen FonIQ adlı bir Türk yatırım fonu analiz uygulamasının AI asistanısın. Sadece Türkçe yanıt ver. Yatırım fonları, TEFAS, portföy yönetimi hakkında yardımcı ol. Kullanıcı sorusu: ${userMsg.text}`,
                  },
                ],
              },
            ],
          }),
        },
      );

      const data = await response.json();
      const aiText =
        data?.candidates?.[0]?.content?.parts?.[0]?.text || "Yanıt alınamadı.";

      const cleaned = aiText
        .replace(/\*\*(.*?)\*\*/g, "$1")
        .replace(/\*(.*?)\*/g, "$1")
        .replace(/#{1,3} /g, "");

      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), text: cleaned, isUser: false },
      ]);
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          text: "Bağlantı hatası.",
          isUser: false,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={90}
    >
      {/* Header */}
      <View style={styles.headerBlock}>
        <View style={styles.headerLeft}>
          <Text style={styles.pageTitle}>AI Asistan</Text>
          <Text style={styles.pageSubtitle}>
            Fon analizi için sorularını sor
          </Text>
        </View>
        <View style={styles.aiIndicator}>
          <View style={styles.aiDot} />
          <Text style={styles.aiStatus}>Çevrimiçi</Text>
        </View>
      </View>

      {/* Mesajlar */}
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={[styles.messageRow, item.isUser && styles.messageRowUser]}
          >
            {!item.isUser && (
              <View style={styles.avatar}>
                <Feather name="zap" size={12} color="#0F172A" />
              </View>
            )}
            <View
              style={[
                styles.bubble,
                item.isUser ? styles.bubbleUser : styles.bubbleAI,
              ]}
            >
              <Text
                style={[
                  styles.bubbleText,
                  item.isUser ? styles.bubbleTextUser : styles.bubbleTextAI,
                ]}
              >
                {item.text}
              </Text>
            </View>
          </View>
        )}
        contentContainerStyle={styles.messageList}
        onContentSizeChange={() =>
          listRef.current?.scrollToEnd({ animated: true })
        }
        showsVerticalScrollIndicator={false}
      />

      {/* Yazıyor göstergesi */}
      {loading && (
        <View style={styles.typingRow}>
          <View style={styles.avatar}>
            <Feather name="zap" size={12} color="#0F172A" />
          </View>
          <View style={styles.typingBubble}>
            <ActivityIndicator size="small" color="#94A3B8" />
            <Text style={styles.typingText}>Yanıt yazılıyor...</Text>
          </View>
        </View>
      )}

      {/* Input */}
      <View style={styles.inputWrapper}>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Bir şeyler sor..."
            placeholderTextColor="#94A3B8"
            multiline
          />
          <TouchableOpacity
            style={[styles.sendBtn, !input.trim() && styles.sendBtnDisabled]}
            onPress={sendMessage}
            disabled={!input.trim() || loading}
          >
            <Feather
              name="send"
              size={16}
              color={input.trim() ? "#FFFFFF" : "#94A3B8"}
            />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: {},
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
  aiIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#F0FDF4",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  aiDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#059669",
  },
  aiStatus: {
    fontSize: 11,
    color: "#059669",
    fontWeight: "600",
  },

  messageList: {
    padding: 16,
    gap: 12,
    paddingBottom: 8,
  },
  messageRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    marginBottom: 8,
  },
  messageRowUser: {
    flexDirection: "row-reverse",
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },
  bubble: {
    maxWidth: "78%",
    padding: 12,
    borderRadius: 16,
  },
  bubbleUser: {
    backgroundColor: "#0F172A",
    borderBottomRightRadius: 4,
  },
  bubbleAI: {
    backgroundColor: "#FFFFFF",
    borderBottomLeftRadius: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  bubbleText: {
    fontSize: 14,
    lineHeight: 21,
  },
  bubbleTextUser: {
    color: "#FFFFFF",
  },
  bubbleTextAI: {
    color: "#1E293B",
  },

  typingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  typingBubble: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  typingText: {
    fontSize: 13,
    color: "#94A3B8",
  },

  inputWrapper: {
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    padding: 12,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: "#0F172A",
    maxHeight: 100,
    paddingVertical: 4,
  },
  sendBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#0F172A",
    justifyContent: "center",
    alignItems: "center",
  },
  sendBtnDisabled: {
    backgroundColor: "#F1F5F9",
  },
});
