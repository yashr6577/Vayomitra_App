import { View, Text, Image } from "react-native";
import React from "react";
import { FontAwesome5 } from "@expo/vector-icons";
import { StyleSheet } from "react-native";

export default function Header() {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.textContainer}>
        <Text style={styles.greeting}>
          👋 Hello, <Text style={styles.name}>Ishan Mulajkar!</Text>
        </Text>
        <Text style={styles.date}>Feb 22, 2025 | Shift - 9:00 AM to 5:00 PM</Text>
      </View>
      <FontAwesome5 name="user" size={28} color={"#FFA726"} style={styles.icon} />
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    borderRadius: 12,
    marginHorizontal: 10,
    marginTop: 10,
  },
  textContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  name: {
    color: "#E53935",
  },
  date: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  icon: {
    marginLeft: 10,
  },
});
