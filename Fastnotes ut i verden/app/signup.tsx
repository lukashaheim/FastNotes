import { Text as ThemedText, View as ThemedView } from "@/components/Themed";
import { supabase } from "@/lib/supabase";
import { Link, Stack, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, StyleSheet, TextInput } from "react-native";

export default function SignupScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignup = async () => {
    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert("Error", "Fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    try {
      setIsSubmitting(true);

      const { error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      });

      if (error) {
        throw error;
      }

      Alert.alert("Success", " Account created");
      router.replace("/login");
    } catch (error: any) {
      Alert.alert("Sign up failed", error.message ?? "Unknown error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: "Sign up" }} />

      <ThemedView style={styles.container}>
        <ThemedText style={styles.title}>Create account</ThemedText>

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TextInput
          style={styles.input}
          placeholder="Confirm password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
            isSubmitting && styles.buttonDisabled,
          ]}
          onPress={handleSignup}
          disabled={isSubmitting}
        >
          <ThemedText style={styles.buttonText}>
            {isSubmitting ? "Creating account..." : "Sign up"}
          </ThemedText>
        </Pressable>

        <Link href="/login" asChild>
          <Pressable>
            <ThemedText style={styles.link}>
              Already have an account? Log in
            </ThemedText>
          </Pressable>
        </Link>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#999",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#2e78b7",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  link: {
    marginTop: 15,
    textAlign: "center",
    color: "#2e78b7",
  },
});
