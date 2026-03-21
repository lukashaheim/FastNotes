import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import { useIsFocused } from "@react-navigation/native";
import { useRef, useState } from "react";
import {
  Button,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function CameraScreen() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [isTakingPhoto, setIsTakingPhoto] = useState(false);
  const cameraRef = useRef<CameraView | null>(null);
  const router = useRouter();
  const isFocused = useIsFocused();

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="Grant permission" />
      </View>
    );
  }

  async function takePicture() {
    if (!cameraRef.current || isTakingPhoto || !isFocused) return;

    try {
      setIsTakingPhoto(true);
      const photo = await cameraRef.current.takePictureAsync();

      if (!photo?.uri) return;

      setPhotoUri(photo.uri);
    } finally {
      setIsTakingPhoto(false);
    }
  }

  function usePhoto() {
    if (!photoUri) return;

    router.replace({
      pathname: "../two",
      params: { photoUri },
    });
    setPhotoUri(null);
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  return photoUri ? (
    <View style={{ flex: 1 }}>
      <Image source={{ uri: photoUri }} style={styles.camera} />
      <View style={styles.topBar} />

      <TouchableOpacity
        style={styles.topLeft}
        onPress={() => setPhotoUri(null)}
      >
        <Text style={styles.icon}>✕</Text>
      </TouchableOpacity>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={usePhoto}>
          <Text style={styles.text}>Use photo</Text>
        </TouchableOpacity>
      </View>
    </View>
  ) : (
    <View style={{ flex: 1 }}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={facing}
        active={isFocused}
      />

      <View style={styles.topBar} />

      <TouchableOpacity
        style={styles.topLeft}
        onPress={() => router.replace("../two")}
      >
        <Text style={styles.icon}>✕</Text>
      </TouchableOpacity>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={takePicture}
          disabled={isTakingPhoto}
        >
          <Text style={styles.text}>
            {isTakingPhoto ? "Taking..." : "Take photo"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
          <Text style={styles.text}>Flip camera</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 64,
    flexDirection: "row",
    width: "100%",
    paddingHorizontal: 64,
  },
  button: {
    flex: 1,
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  topLeft: {
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 10,
  },
  topBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: "black",
    zIndex: 5,
  },
  icon: {
    fontSize: 30,
    color: "white",
  },
});