import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  ScrollView, 
  FlatList, 
  StyleSheet, 
  Alert 
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { 
  db, 
  collection, 
  query, 
  where, 
  getDocs, 
  documentId 
} from "../../config/firebaseConfig";

export default function NotificationScreen() {
  const [tasks, setTasks] = useState([]);
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      // Retrieve caretaker's email from AsyncStorage
      const caretakerEmail = await AsyncStorage.getItem("userEmail");
      if (!caretakerEmail) {
        Alert.alert("Error", "Caretaker email not found.");
        return;
      }
      // Query the "users" collection for the caretaker's document
      const usersRef = collection(db, "users");
      const caretakerQuery = query(usersRef, where("email", "==", caretakerEmail));
      const caretakerSnapshot = await getDocs(caretakerQuery);
      if (caretakerSnapshot.empty) {
        Alert.alert("Error", "Caretaker not found.");
        return;
      }
      const caretakerDoc = caretakerSnapshot.docs[0];
      const caretakerData = caretakerDoc.data();
      const assignedElders = caretakerData.elders || [];
      if (assignedElders.length === 0) {
        setTasks([]);
        setMedications([]);
        setLoading(false);
        return;
      }

      // Query the "users" collection for elder documents using the assignedElders IDs
      const eldersQuery = query(collection(db, "users"), where(documentId(), "in", assignedElders));
      const eldersSnapshot = await getDocs(eldersQuery);

      let allTasks = [];
      let allMeds = [];
      eldersSnapshot.docs.forEach((elderDoc) => {
        const elderData = elderDoc.data();
        const elderName = elderData.name || "Unknown Elder";
        // If the elder document has a tasks array, add tasks with additional elder info
        if (Array.isArray(elderData.tasks)) {
          const tasksWithElder = elderData.tasks.map((task) => ({
            ...task,
            elderName,
            elderId: elderDoc.id,
          }));
          allTasks = allTasks.concat(tasksWithElder);
        }
        // If the elder document has a medications array, add medications with additional elder info
        if (Array.isArray(elderData.medications)) {
          const medsWithElder = elderData.medications.map((med) => ({
            ...med,
            elderName,
            elderId: elderDoc.id,
          }));
          allMeds = allMeds.concat(medsWithElder);
        }
      });

      setTasks(allTasks);
      setMedications(allMeds);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      Alert.alert("Error", "Failed to fetch notifications.");
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Notification Screen</Text>

      <Text style={styles.subHeading}>Tasks</Text>
      {tasks.length === 0 ? (
        <Text style={styles.emptyText}>No tasks found.</Text>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <Text style={styles.itemTitle}>{item.task}</Text>
              <Text>Time: {item.time}</Text>
              <Text>Elder: {item.elderName}</Text>
            </View>
          )}
        />
      )}

      <Text style={styles.subHeading}>Medications</Text>
      {medications.length === 0 ? (
        <Text style={styles.emptyText}>No medications found.</Text>
      ) : (
        <FlatList
          data={medications}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <Text style={styles.itemTitle}>{item.name}</Text>
              <Text>Schedule: {item.schedule}</Text>
              <Text>Dosage: {item.dosage}</Text>
              <Text>Time: {item.time}</Text>
              <Text>Elder: {item.elderName}</Text>
            </View>
          )}
        />
      )}

      {loading && <Text style={styles.loadingText}>Loading...</Text>}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  heading: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  subHeading: { fontSize: 20, fontWeight: "bold", marginTop: 20, marginBottom: 10 },
  emptyText: { fontSize: 16, color: "#888", marginBottom: 10 },
  loadingText: { fontSize: 16, color: "#888", marginTop: 10 },
  itemContainer: {
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    marginBottom: 10,
  },
  itemTitle: { fontSize: 16, fontWeight: "bold" },
});
