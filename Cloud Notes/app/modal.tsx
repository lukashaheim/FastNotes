import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet } from "react-native";

import { View } from "@/components/Themed";
import SignOutButton from "@/components/social-auth-buttons/sign-out-button";
import { Stack } from "expo-router";

export default function ModalScreen() {
  return (
    <>
    <Stack.Screen options={{ title: "Profile" }} />

    <View style={styles.container}>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <SignOutButton />

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
