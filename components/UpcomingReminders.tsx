import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  Image,
} from "react-native";

const DATES = [
  { id: "1", day: "22", month: "Feb" },
  { id: "2", day: "23", month: "Feb" },
  { id: "3", day: "24", month: "Feb" },
  { id: "4", day: "25", month: "Feb" },
  { id: "5", day: "26", month: "Feb" },
];

const MEDICATIONS = [
  {
    id: "1",
    name: "Dolo",
    schedule: "Before Lunch",
    dosage: "1 tablet",
    time: "1:00 PM",
  },
  {
    id: "2",
    name: "RGV",
    schedule: "Before Lunch",
    dosage: "1 tablet",
    time: "1:00 PM",
  },
];

export default function UpcomingReminders() {
  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>Upcoming Medical Reminders :</Text>

      {/* Horizontal List of Dates */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.dateScroll}
      >
        {DATES.map((item) => (
          <View key={item.id} style={styles.dateBox}>
            <Text style={styles.dateDay}>{item.day}</Text>
            <Text style={styles.dateMonth}>{item.month}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Medication List */}
      <FlatList
        data={MEDICATIONS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.medCard}>
            {/* Pill Icon */}
            <View style={styles.iconContainer}>
              <Image
                source={require("../assets/images/pill.png")} // Adjust path to your pill icon
                style={styles.icon}
              />
            </View>

            {/* Middle Section: Name, Schedule, Dosage */}
            <View style={styles.medInfo}>
              <Text style={styles.medName}>{item.name}</Text>
              <Text style={styles.medSchedule}>{item.schedule}</Text>
              <Text style={styles.medDosage}>{item.dosage}</Text>
            </View>

            {/* Time on the Right */}
            <View style={styles.timeContainer}>
              <Text style={styles.medTime}>{item.time}</Text>
            </View>
          </View>
        )}
        style={{ marginTop: 10 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    backgroundColor: "#FFF",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  // Horizontal Date Scroll
  dateScroll: {
    marginBottom: 15,
  },
  dateBox: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: "#F2F2F2",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  dateDay: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#F44336", // Red color for day
  },
  dateMonth: {
    fontSize: 14,
    color: "#333",
  },
  // Medication Card
  medCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF7F0",
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    elevation: 2, // For Android shadow
    shadowColor: "#000", // For iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#FFD36E",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  icon: {
    width: 30,
    height: 30,
    resizeMode: "contain",
  },
  medInfo: {
    flex: 1,
  },
  medName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  medSchedule: {
    fontSize: 14,
    color: "#FF3D00",
    fontWeight: "500",
  },
  medDosage: {
    fontSize: 14,
    color: "#666",
  },
  timeContainer: {
    backgroundColor: "#FF3D00",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  medTime: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 14,
  },
});
