import { Stack, Link } from 'expo-router'
import { useState } from 'react'
import { Alert, Pressable, StyleSheet, TextInput } from 'react-native'
import { Text as ThemedText, View as ThemedView } from '@/components/Themed'
import { useAuthContext } from '@/hooks/auth-context'

export default function LoginScreen() {
  const { login } = useAuthContext()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Enter email and password')
      return
    }

    try {
      await login(email, password)
    } catch (error: any) {
      Alert.alert('Login failed', error.message ?? 'Unknown error')
    }
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Login' }} />
      <ThemedView style={styles.container}>
        <ThemedText style={styles.title}>Login</ThemedText>

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

        <Pressable style={styles.button} onPress={handleLogin}>
          <ThemedText style={styles.buttonText}>Log in</ThemedText>
        </Pressable>
        <Link href="/signup" asChild>
        <Pressable>
          <ThemedText style={styles.link}>
            Don't have an account? Sign up
          </ThemedText>
        </Pressable>
        </Link>
      </ThemedView>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#2e78b7',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  link: {
    marginTop: 15,
    textAlign: 'center',
    color: '#2e78b7',
  },
})