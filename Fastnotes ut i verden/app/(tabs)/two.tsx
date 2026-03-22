import { Text, Text as ThemedText } from "@/components/Themed";
import { useAuthContext } from "@/hooks/auth-context";
import { supabase } from "@/lib/supabase";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { useNotes } from "../NotesContext";

type PendingIosAction = "library" | null;

export default function TabTwoScreen() {
  const { profile } = useAuthContext();
  const { setNotes } = useNotes();
  const router = useRouter();
  const { photoUri } = useLocalSearchParams<{ photoUri?: string }>();

  const [localPhotoUri, setLocalPhotoUri] = useState<string | undefined>(
    photoUri,
  );
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageMenuVisible, setImageMenuVisible] = useState(false);
  const [pendingIosAction, setPendingIosAction] =
    useState<PendingIosAction>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (photoUri) {
      setLocalPhotoUri(photoUri);
    }
  }, [photoUri]);

  const openLibrary = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Toast.show({
          type: "error",
          text1: "Permission denied",
          text2: "You need to allow access to your photo library",
          position: "top",
        });
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.[0]?.uri) {
        setLocalPhotoUri(result.assets[0].uri);
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Could not open library",
        text2: error instanceof Error ? error.message : "Unknown error",
        position: "top",
      });
    }
  };

  const openAndroidCamera = async () => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();

      if (!permission.granted) {
        Toast.show({
          type: "error",
          text1: "Permission denied",
          text2: "You need to allow access to your camera",
          position: "top",
        });
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.[0]?.uri) {
        setLocalPhotoUri(result.assets[0].uri);
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Could not open camera",
        text2: error instanceof Error ? error.message : "Unknown error",
        position: "top",
      });
    }
  };

  const handleModalDismiss = async () => {
    if (Platform.OS === "ios" && pendingIosAction === "library") {
      setPendingIosAction(null);
      await openLibrary();
    }
  };

  const handleTakePhoto = async () => {
    if (Platform.OS === "ios") {
      setImageMenuVisible(false);
      router.push("/notes/camera");
      return;
    }

    setImageMenuVisible(false);

    setTimeout(async () => {
      await openAndroidCamera();
    }, 200);
  };

  const handleChooseFromLibrary = async () => {
    if (Platform.OS === "ios") {
      setPendingIosAction("library");
      setImageMenuVisible(false);
      return;
    }

    setImageMenuVisible(false);

    setTimeout(async () => {
      await openLibrary();
    }, 200);
  };

  const addNote = async () => {
    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (!trimmedTitle || !trimmedContent || !profile?.id || isSaving) return;

    setIsSaving(true);

    try {
      const { data: noteData, error: noteError } = await supabase
        .from("FastNotes")
        .insert([
          {
            title: trimmedTitle,
            content: trimmedContent,
            created_by: profile.id,
          },
        ])
        .select()
        .single();

      if (noteError) {
        Toast.show({
          type: "error",
          text1: "Could not save note",
          text2: noteError.message,
          position: "top",
        });
        return;
      }

      let finalNote = noteData;

      if (localPhotoUri) {
        const arrayBuffer = await fetch(localPhotoUri).then((res) =>
          res.arrayBuffer(),
        );

        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`;
        const filePath = `${profile.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("notes")
          .upload(filePath, arrayBuffer, {
            contentType: "image/jpg",
          });

        if (uploadError) {
          Toast.show({
            type: "error",
            text1: "Note saved, but image upload failed",
            text2: uploadError.message,
            position: "top",
          });

          setNotes((prev) => [noteData, ...prev]);
          setTitle("");
          setContent("");
          setLocalPhotoUri(undefined);
          return;
        }

        const { data: updatedNote, error: updateError } = await supabase
          .from("FastNotes")
          .update({ image_path: filePath })
          .eq("id", noteData.id)
          .select()
          .single();

        if (updateError) {
          Toast.show({
            type: "error",
            text1: "Image uploaded, but note update failed",
            text2: updateError.message,
            position: "top",
          });

          setNotes((prev) => [noteData, ...prev]);
          setTitle("");
          setContent("");
          setLocalPhotoUri(undefined);
          return;
        }

        finalNote = updatedNote;
      }

      setNotes((prev) => [finalNote, ...prev]);

      Toast.show({
        type: "success",
        text1: "Successfully added note",
        position: "top",
        visibilityTime: 3000,
      });

      setTitle("");
      setContent("");
      setLocalPhotoUri(undefined);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Something went wrong",
        text2: error instanceof Error ? error.message : "Unknown error",
        position: "top",
      });
    } finally {
      setIsSaving(false);
      router.replace("/");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.inputContainer}>
            <Text style={styles.subTitle}>Title</Text>
            <TextInput
              style={styles.input}
              placeholder="Title for your note ..."
              editable={!isSaving}
              maxLength={20}
              value={title}
              onChangeText={setTitle}
              returnKeyType="done"
            />

            <Text style={styles.subTitle}>Content</Text>
            <TextInput
              style={[styles.input, styles.contentInput]}
              placeholder="Content for your note ..."
              multiline
              editable={!isSaving}
              numberOfLines={4}
              maxLength={100}
              value={content}
              onChangeText={setContent}
              textAlignVertical="top"
            />

            {localPhotoUri ? (
              <Image
                source={{ uri: localPhotoUri }}
                style={styles.previewImage}
              />
            ) : null}

            <View style={styles.bottomButtons}>
              <Pressable
                style={[styles.button, isSaving && styles.buttonDisabled]}
                onPress={() => setImageMenuVisible(true)}
                disabled={isSaving}
              >
                <ThemedText style={styles.buttonText}>Image</ThemedText>
              </Pressable>

              <Pressable
                style={[styles.button, isSaving && styles.buttonDisabled]}
                onPress={addNote}
                disabled={isSaving}
              >
                {isSaving ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <ThemedText style={styles.buttonText}>Add</ThemedText>
                )}
              </Pressable>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      <Modal
        visible={imageMenuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => {
          setPendingIosAction(null);
          setImageMenuVisible(false);
        }}
        onDismiss={handleModalDismiss}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => {
            setPendingIosAction(null);
            setImageMenuVisible(false);
          }}
        >
          <Pressable style={styles.modalContent} onPress={() => {}}>
            <Pressable style={styles.modalButton} onPress={handleTakePhoto}>
              <Text style={styles.modalButtonText}>Take photo</Text>
            </Pressable>

            <Pressable
              style={styles.modalButton}
              onPress={handleChooseFromLibrary}
            >
              <Text style={styles.modalButtonText}>Choose from library</Text>
            </Pressable>

            <Pressable
              style={[styles.modalButton, styles.removeButton]}
              onPress={() => {
                setPendingIosAction(null);
                setLocalPhotoUri(undefined);
                setImageMenuVisible(false);
              }}
            >
              <Text style={styles.modalButtonText}>Remove image</Text>
            </Pressable>

            <Pressable
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => {
                setPendingIosAction(null);
                setImageMenuVisible(false);
              }}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  inputContainer: {
    flex: 1,
    width: "100%",
    padding: 16,
    gap: 12,
  },
  subTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  contentInput: {
    minHeight: 120,
  },
  previewImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
  },
  bottomButtons: {
    marginTop: "auto",
    gap: 12,
    paddingTop: 12,
  },
  button: {
    backgroundColor: "#2e78b7",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalContent: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  modalButton: {
    backgroundColor: "#2e78b7",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  removeButton: {
    backgroundColor: "#c94c4c",
  },
  cancelButton: {
    backgroundColor: "#888",
  },
});