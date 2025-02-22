import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import * as Notifications from "expo-notifications";
import * as Location from "expo-location";
import { Audio } from "expo-av";

export default function WelcomeScreen() {
  const router = useRouter();
  const [bgColor, setBgColor] = useState("#fff");
  const [liveLocation, setLiveLocation] = useState("");
  const SERVER_URL = "http://192.168.235.9:5000"; // 🔥 Replace with your IP

  useEffect(() => {
    async function registerForPushNotifications() {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        alert("Permission for push notifications is required!");
      }
    }
    registerForPushNotifications();
  }, []);

  const getLiveLocation = async (): Promise<string> => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Location permission denied!");
        return "";
      }
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      const googleMapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
      setLiveLocation(googleMapsLink);
      return googleMapsLink;
    } catch (error) {
      console.error("Error fetching location:", error);
      return "";
    }
  };

  const playAlarm = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require("../../assets/sos.mp3")
      );
      await sound.playAsync();
      setTimeout(() => sound.stopAsync(), 5000);
    } catch (error) {
      console.error("Error playing alarm:", error);
    }
  };

  const sendNotification = async (locationLink: string) => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "🚨 Emergency Alert!",
          body: `Help me! I am in an emergency. Live Location: ${locationLink}`,
          sound: true,
        },
        trigger: null,
      });
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  };

  const sendSMSToBackend = async (locationLink: string) => {
    try {
      const response = await fetch(`${SERVER_URL}/send-sms`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `🚨 Help me! I am in an emergency. Live Location: ${locationLink}`,
        }),
      });

      if (!response.ok) {
        throw new Error(`SMS Error: ${response.statusText}`);
      }
    } catch (error) {
      alert("Failed to send SMS.");
      console.error("SMS error:", error);
    }
  };
  const makeEmergencyCall = async () => {
    try {
      await fetch(`${SERVER_URL}/make-call`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Call error:", error);
    }
  };
  const handleSOSPress = async () => {
    setBgColor("#8B0000");
    const locationLink = await getLiveLocation();
    if (locationLink) {
      await Promise.all([
        sendSMSToBackend(locationLink),
        sendNotification(locationLink),
        makeEmergencyCall(),
        playAlarm(),
      ]);
    }
    setTimeout(() => setBgColor("#fff"), 5000);
  };

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <TouchableOpacity style={styles.sosButton} onPress={handleSOSPress}>
        <Text style={styles.sosText}>🚨 EMERGENCY SOS 🚨</Text>
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
    paddingHorizontal: 20,
  },
  sosButton: {
    backgroundColor: "#FF0000",
    paddingVertical: 20,
    paddingHorizontal: 0,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
    marginVertical: 20,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 8,
  },
  sosText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 22,
  },
});