import { Text } from "@/components/Themed";
import { useAuthContext } from "@/hooks/auth-context";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Button,
  KeyboardAvoidingView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { createNote } from "../models/Note";
import { useNotes } from "../NotesContext";

export default function TabTwoScreen() {
  const { profile } = useAuthContext();
  const { notes, setNotes } = useNotes();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const router = useRouter();

  const addNote = () => {
    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();
    if (!trimmedTitle || !trimmedContent) return;

    const newNote = createNote(trimmedTitle, trimmedContent);

    setNotes((prev) => [newNote, ...prev]);

    Toast.show({
      type: "success",
      text1: "Successfully added note",
      position: "top",
      visibilityTime: 3000,
    });

    setTitle("");
    setContent("");

    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView>
        <View style={styles.inputContainer}>
          <Text style={styles.subTitle}>Title</Text>
          <TextInput
            style={styles.input}
            placeholder="Title for your note ... "
            editable
            maxLength={10}
            value={title}
            onChangeText={setTitle}
          />
          <Text style={styles.subTitle}>Content</Text>
          <TextInput
            style={[styles.input, styles.contentInput]}
            placeholder="Content for your note ... "
            multiline
            editable
            numberOfLines={4}
            maxLength={100}
            value={content}
            onChangeText={setContent}
          />
          <Button title="Add" onPress={addNote} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "stretch",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    alignContent: "center",
  },
  subTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  contentInput: {
    minHeight: 120,
    textAlignVertical: "top",
  },
  inputContainer: {
    width: "100%",
    padding: 16,
    gap: 12,
  },
  noteItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  list: {
    flex: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
