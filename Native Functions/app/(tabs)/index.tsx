import { FlatList, Pressable, StyleSheet } from "react-native";
import { Text, View } from "@/components/Themed";
import { useRouter, useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { useNotes } from "../NotesContext";
import { supabase } from "@/lib/supabase";

export default function TabOneScreen() {
  const { notes, setNotes } = useNotes();
  const router = useRouter();

  const fetchNotes = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setNotes([]);
      return;
    }

    const { data, error } = await supabase
      .from("FastNotes")
      .select("*")
      .is("deleted_at", null)
    if (error) {
      console.log(error.message);
      return;
    }

    setNotes(data ?? []);
  }, [setNotes]);

  useFocusEffect(
    useCallback(() => {
      fetchNotes();
    }, [fetchNotes])
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={notes}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <Pressable
            style={({ pressed }) => [
              styles.card,
              pressed && styles.cardPressed,
            ]}
            onPress={() =>
              router.push({
                pathname: "/notes/[id]",
                params: { id: String(item.id) },
              })
            }
          >
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.preview} numberOfLines={2}>
              {item.content}
            </Text>
          </Pressable>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No notes yet</Text>}
      />

      <View style={styles.bottomBar}>
        <Pressable
          style={({ pressed }) => [
            styles.newNoteButton,
            pressed && styles.newNoteButtonPressed,
          ]}
          onPress={() => router.push("/two")}
        >
          <Text style={styles.newNoteText}>New note</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },

  listContent: {
    gap: 12,
    paddingBottom: 90,
  },

  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  cardPressed: { opacity: 0.7 },
  cardTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 6 },
  preview: { fontSize: 14, color: "#555" },
  empty: { textAlign: "center", marginTop: 40, fontSize: 16, color: "#888" },

  bottomBar: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 16,
  },

  newNoteButton: {
    backgroundColor: "#2ecc71",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
  },
  newNoteButtonPressed: { opacity: 0.8 },
  newNoteText: { color: "white", fontSize: 16, fontWeight: "bold" },
});