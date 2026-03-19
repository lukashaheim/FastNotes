import { Text } from "@/components/Themed";
import { Stack, useLocalSearchParams } from "expo-router";
import { StyleSheet, View } from "react-native";
import { useNotes } from "../NotesContext";

export default function NoteDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { notes } = useNotes();

  const note = notes.find((n) => n.id === id);

  if (!note) {
    return <Text>Note not found</Text>;
  }

  return (
    <>
    <Stack.Screen options={{ title: note?.title ?? "Note" }} />
    
    <View style={styles.container}>
      <Text style={styles.title}>{note.title}</Text>
      <Text style={styles.content}>{note.content}</Text>
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
});
