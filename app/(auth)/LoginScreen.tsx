import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../config/firebaseConfig";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      const role = await AsyncStorage.getItem("userRole");
      const uemail = await AsyncStorage.getItem("userEmail");
      if (role === "careTaker" && uemail === email) {
        router.push("../../(tabs)");
      } else if (role === "elder" && uemail === email) {
        router.push("../../(tabs)");
      }
      
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("An unexpected error occurred");
      }
    }
  };

  return (
    <View style={styles.container}>
     
      <Text style={styles.welcome}>Welcome <Text style={styles.bold}>Back!</Text></Text>
      <Text style={styles.subtext}>Please enter your credentials.</Text>

      <TextInput 
        style={styles.input} 
        placeholder="Enter your Email" 
        value={email} 
        onChangeText={setEmail} 
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput 
        style={styles.input} 
        placeholder="Enter your Password" 
        secureTextEntry 
        value={password} 
        onChangeText={setPassword} 
      />

      <TouchableOpacity>
        <Text style={styles.forgotText}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  welcome: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
  bold: {
    color: "#e57373",
  },
  subtext: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  input: {
    width: "90%",
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e57373",
    marginBottom: 10,
    backgroundColor: "#f9f9f9",
  },
  forgotText: {
    color: "#e57373",
    marginBottom: 20,
    fontSize: 14,
  },
  button: {
    backgroundColor: "#e57373",
    padding: 15,
    borderRadius: 10,
    width: "90%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
