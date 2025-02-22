import React, { useState } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  FlatList, 
  Modal, 
  TextInput, 
  StyleSheet, 
  Image, 
  Alert 
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { db, collection, addDoc ,query, where, getDocs, updateDoc, arrayUnion } from "../../config/firebaseConfig";

export default function App() {
  const [modalVisible, setModalVisible] = useState(false);
  const [medications, setMedications] = useState([
    { id: "2", name: "RGV", time: "1:00 PM", dosage: "1 tablet", schedule: "Before Lunch" },
  ]);
  const [newMed, setNewMed] = useState({ name: "", time: "", dosage: "", schedule: "" });

  const addMedication = async () => {
    if (newMed.name && newMed.time) {
      try {
        // Retrieve user email from AsyncStorage
        const email = await AsyncStorage.getItem("userEmail");
        if (!email) {
          Alert.alert("Error", "User email not found.");
          return;
        }

        // Add the new medication to Firestore's "medications" collection
        const docRef = await addDoc(collection(db, "medications"), {
          ...newMed,
          email, // Associate medication with the user's email
          createdAt: new Date().toISOString(),
        });
        console.log("Medication added with ID:", docRef.id);

        // Update local state with the new medication (using the doc ID)
        setMedications([...medications, { ...newMed, id: docRef.id }]);
        setNewMed({ name: "", time: "", dosage: "", schedule: "" });
        setModalVisible(false);
      } catch (error) {
        console.error("Error adding medication:", error);
        Alert.alert("Error", "Failed to add medication.");
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* Header Section with Add Button */}
      <View style={styles.header}>
        <Text style={styles.heading}>Medication Reminders</Text>
        <TouchableOpacity style={styles.addMButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.addText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      {/* Medication List */}
      <FlatList
        data={medications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <LinearGradient colors={["#FEE8D5", "#FFE5E5"]} style={styles.medCard}>
            <View style={styles.iconContainer}>
              <FontAwesome name="medkit" size={30} color="#FF3D00" />
            </View>
            <View style={styles.medInfo}>
              <Text style={styles.medName}>{item.name}</Text>
              <Text style={styles.medSchedule}>{item.schedule}</Text>
              <Text style={styles.medDosage}>{item.dosage}</Text>
            </View>
            <View style={styles.separator} />
            <View style={styles.timeContainer}>
              <Text style={styles.medTime}>{item.time}</Text>
            </View>
          </LinearGradient>
        )}
      />

      {/* Modal for Adding Medication */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Close Button */}
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <FontAwesome name="close" size={24} color="#FF3D00" />
            </TouchableOpacity>

            {/* Medication Image */}
            <Image source={require("@/assets/images/medicine.png")} style={styles.medicineImage} />

            <Text style={styles.modalTitle}>
              Add New <Text style={{ color: "#FF3D00" }}>Medication.</Text>
            </Text>

            {/* Medicine Name Input */}
            <View style={styles.inputContainer}>
              <FontAwesome name="medkit" size={20} color="#FF3D00" style={styles.inputIcon} />
              <TextInput
                placeholder="Medicine Name"
                style={styles.input}
                onChangeText={(text) => setNewMed({ ...newMed, name: text })}
                value={newMed.name}
              />
            </View>

            {/* Medication Type Selection */}
            <View style={styles.categoryContainer}>
              {["Tablet", "Drops", "Syrup", "Injection"].map((type) => (
                <TouchableOpacity key={type} style={styles.categoryButton}>
                  <Text style={styles.categoryText}>{type}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Dosage Input */}
            <View style={styles.inputContainer}>
              <FontAwesome name="pencil" size={20} color="#FF3D00" style={styles.inputIcon} />
              <TextInput
                placeholder="Dose Ex. 2, 5ml"
                style={styles.input}
                onChangeText={(text) => setNewMed({ ...newMed, dosage: text })}
                value={newMed.dosage}
              />
            </View>

            {/* When to Take Input */}
            <View style={styles.inputContainer}>
              <FontAwesome name="clock-o" size={20} color="#FF3D00" style={styles.inputIcon} />
              <TextInput
                placeholder="When to Take"
                style={styles.input}
                onChangeText={(text) => setNewMed({ ...newMed, schedule: text })}
                value={newMed.schedule}
              />
            </View>

            {/* Reminder Time Input */}
            <View style={styles.inputContainer}>
              <FontAwesome name="bell" size={20} color="#FF3D00" style={styles.inputIcon} />
              <TextInput
                placeholder="Select Reminder Time"
                style={styles.input}
                onChangeText={(text) => setNewMed({ ...newMed, time: text })}
                value={newMed.time}
              />
            </View>

            {/* Buttons Container */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.addButton} onPress={addMedication}>
                <Text style={styles.addButtonText}>Add +</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  // Header Section
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 15 },
  heading: { fontSize: 20, fontWeight: "bold" },
  addMButton: { backgroundColor: "red", padding: 10, borderRadius: 8 },
  addText: { fontSize: 16, color: "#fff", fontWeight: "bold" },
  // Medication Card
  medCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 2, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  // Icon Container
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#FFD700",
    justifyContent: "center",
    alignItems: "center",
  },
  // Medication Info
  medInfo: { flex: 1, marginLeft: 15 },
  medName: { fontSize: 18, fontWeight: "bold", color: "#333" },
  medSchedule: { fontSize: 14, color: "red", fontWeight: "bold" },
  medDosage: { fontSize: 14, color: "#666" },
  // Separator
  separator: { width: 1, height: "80%", backgroundColor: "#BDBDBD", marginHorizontal: 10 },
  // Time Box
  timeContainer: { backgroundColor: "red", paddingHorizontal: 15, paddingVertical: 8, borderRadius: 10 },
  medTime: { fontSize: 14, fontWeight: "bold", color: "#fff" },
  // Modal Styling
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
  },
  medicineImage: { width: 100, height: 100, marginBottom: 10 },
  modalTitle: { fontSize: 20, fontWeight: "bold", color: "#333", marginBottom: 10 },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FF7F7F",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
    width: "100%",
    backgroundColor: "#FFF5F5",
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, height: 50, fontSize: 16, color: "#333" },
  categoryContainer: { flexDirection: "row", justifyContent: "space-between", width: "100%", marginBottom: 10 },
  categoryButton: { backgroundColor: "#FF7F7F", paddingVertical: 10, paddingHorizontal: 15, borderRadius: 10 },
  categoryText: { color: "#fff", fontWeight: "bold" },
  buttonContainer: { marginTop: 10, width: "100%" },
  addButton: { backgroundColor: "#FF3D00", padding: 12, borderRadius: 10, width: "100%", alignItems: "center", marginTop: 10 },
  addButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  closeButton: { position: "absolute", top: 15, right: 15, zIndex: 10 },
});
