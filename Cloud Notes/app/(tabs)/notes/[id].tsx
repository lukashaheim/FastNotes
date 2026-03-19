import { Text } from "@/components/Themed";
import { supabase } from "@/lib/supabase";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

type Note = {
  id: string;
  title: string;
  content: string;
  created_at?: string;
  created_by?: string;
};

export default function NoteDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNote = async () => {
      if (!id) return;

      const { data, error } = await supabase
        .from("FastNotes")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.log(error.message);
        setNote(null);
        setLoading(false);
        return;
      }

      setNote(data);
      setLoading(false);
    };

    fetchNote();
  }, [id]);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (!note) {
    return <Text>Note not found</Text>;
  }

  return (
    <>
      <Stack.Screen options={{ title: note.title || "Note" }} />
      <View style={styles.container}>
        <Text style={styles.title}>{note.title}</Text>
        <Text style={styles.content}>{note.content}</Text>
      </View>
      <View style={styles.bottomBar}>
        <Pressable
          style={({ pressed }) => [
            styles.newNoteButton,
            pressed && styles.newNoteButtonPressed,
          ]}
          onPress={() =>
              router.push({
                pathname: "/notes/edit/[id]",
                params: { id: String(note.id) },
              })
            }
        >
          <Text style={styles.newNoteText}>Edit note</Text>
        </Pressable>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
  },
  content: {
    fontSize: 16,
    lineHeight: 22,
  },
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
