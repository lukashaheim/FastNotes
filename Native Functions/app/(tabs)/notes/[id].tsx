import { Text } from "@/components/Themed";
import { supabase } from "@/lib/supabase";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Image, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";

type Note = {
  id: number;
  title: string;
  content: string;
  created_at?: string;
  created_by?: string;
  last_changed_by?: string;
  image_path?: string | null;
};

export default function NoteDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [note, setNote] = useState<Note | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(false);

  const fetchNote = useCallback(async () => {
    if (!id) {
      setNote(null);
      setImageUrl(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setImageUrl(null);
    setImageLoading(false);

    const { data, error } = await supabase
      .from("FastNotes")
      .select("*")
      .eq("id", Number(id))
      .single();

    if (error || !data) {
      console.log("Fetch note error:", error?.message);
      setNote(null);
      setImageUrl(null);
      setLoading(false);
      return;
    }

    setNote(data);

    const cleanImagePath =
      typeof data.image_path === "string" ? data.image_path.trim() : "";

    if (!cleanImagePath) {
      setImageUrl(null);
      setLoading(false);
      return;
    }

    const { data: signedData, error: signedError } = await supabase.storage
      .from("notes")
      .createSignedUrl(cleanImagePath, 3600);

    if (signedError || !signedData?.signedUrl) {
      console.log("Signed URL error:", signedError?.message);
      setImageUrl(null);
      setLoading(false);
      return;
    }

    setImageUrl(signedData.signedUrl);
    setLoading(false);
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      fetchNote();
    }, [fetchNote])
  );

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (!note) {
    return <Text>Note not found</Text>;
  }

  return (
    <>
      <Stack.Screen options={{ title: note.title || "Note" }} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          <Text style={styles.title}>{note.title}</Text>
          <Text style={styles.content}>{note.content}</Text>

          {imageUrl ? (
            <>
              {imageLoading && <Text>Loading image...</Text>}
              <Image
                source={{ uri: imageUrl }}
                style={styles.previewImage}
                onLoadStart={() => setImageLoading(true)}
                onLoadEnd={() => setImageLoading(false)}
                onError={(e) => {
                  console.log("Image load error:", e.nativeEvent.error);
                  setImageLoading(false);
                  setImageUrl(null);
                }}
              />
            </>
          ) : (
            <Text>No image available</Text>
          )}
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <Pressable
          style={({ pressed }) => [
            styles.editButton,
            pressed && styles.editButtonPressed,
          ]}
          onPress={() =>
            router.push({
              pathname: "/notes/edit/[id]",
              params: { id: String(note.id) },
            })
          }
        >
          <Text style={styles.editButtonText}>Edit note</Text>
        </Pressable>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 100,
  },
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
    marginBottom: 16,
  },
  previewImage: {
    width: "100%",
    height: 250,
    borderRadius: 8,
    resizeMode: "cover",
    marginTop: 12,
  },
  bottomBar: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 16,
  },
  editButton: {
    backgroundColor: "#2ecc71",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
  },
  editButtonPressed: {
    opacity: 0.8,
  },
  editButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});