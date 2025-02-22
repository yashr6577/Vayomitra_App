import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from "react-native";
import { FlashList } from "@shopify/flash-list"; // ✅ Import FlashList
import { FontAwesome5 } from "@expo/vector-icons";
import Fontisto from "@expo/vector-icons/Fontisto";
import { ScrollView } from "react-native";

const initialElders = [
  { id: "1", name: "Mr. Ishan Mulajkar", age: 69, health: "Good" },
  { id: "2", name: "Mr. Ishan Mulajkar", age: 69, health: "Average" },
];

export default function AssignedElders() {
  const [elders, setElders] = useState(initialElders);
  const [modalVisible, setModalVisible] = useState(false);
  const [newElder, setNewElder] = useState({ name: "", age: "", health: "Good" });

  const addElder = () => {
    if (newElder.name && newElder.age) {
      setElders([...elders, { ...newElder, id: Math.random().toString() }]);
      setNewElder({ name: "", age: "", health: "Good" });
      setModalVisible(false);
    }
  };

  const healthColors = {
    Good: "#28A745",
    Average: "#FFC107",
    Severe: "#DC3545",
  };

  return (
    <ScrollView style={styles.container} pagingEnabled
    showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>🔴 Assigned Elders</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.addButton}>
          <FontAwesome5 name="user-plus" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Elder List using FlashList */}
      <FlashList
        data={elders}
        keyExtractor={(item) => item.id}
        estimatedItemSize={80} // ✅ Required for performance
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.leftSection}>
              <View style={[styles.healthIndicator, { backgroundColor: healthColors[item.health] }]} />
              <FontAwesome5 name="user" size={20} color={"#FFA726"} style={styles.icon} />
              <Text style={styles.healthText}>{item.health} Health</Text>
            </View>

            <View style={styles.middleSection}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.age}>
                Age - <Text style={styles.ageNumber}>{item.age}</Text>
              </Text>
              <Text style={styles.task}>Upcoming Exercise Task</Text>
            </View>

            <View style={styles.rightSection}>
              <FontAwesome5 name="heartbeat" size={20} color={"#FFA726"} style={styles.icon} />
              <Text style={styles.healthValue}>120/80</Text>
              <Fontisto name="blood" size={20} color={"red"} style={styles.icon} />
              <Text style={styles.healthValue}>120/80</Text>
            </View>
          </View>
        )}
      />

      {/* Add Elder Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Elder</Text>
            <TextInput
              placeholder="Name"
              style={styles.input}
              value={newElder.name}
              onChangeText={(text) => setNewElder({ ...newElder, name: text })}
            />
            <TextInput
              placeholder="Age"
              style={styles.input}
              keyboardType="numeric"
              value={newElder.age}
              onChangeText={(text) => setNewElder({ ...newElder, age: text })}
            />
            <TouchableOpacity onPress={addElder} style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

// 🔹 Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  addButton: {
    backgroundColor: "#E53935",
    padding: 10,
    borderRadius: 20,
  },
  card: {
    backgroundColor: "#FFEBEE",
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    marginBottom: 10,
    borderRadius: 20,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  leftSection: {
    alignItems: "center",
    marginRight: 10,
  },
  healthIndicator: {
    width: 10,
    height: 10,
    borderRadius: 6,
    marginBottom: 4,
  },
  healthText: {
    fontSize: 12,
    color: "#E53935",
  },
  middleSection: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  age: {
    fontSize: 14,
    color: "#555",
  },
  ageNumber: {
    color: "#D32F2F",
    fontWeight: "bold",
  },
  task: {
    fontSize: 13,
    color: "#777",
  },
  rightSection: {
    alignItems: "center",
  },
  icon: {
    width: 20,
    height: 20,
    tintColor: "#D32F2F",
    marginBottom: 4,
  },
  healthValue: {
    fontSize: 12,
    color: "#D32F2F",
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: "#E53935",
    padding: 12,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  cancelButton: {
    marginTop: 10,
  },
  cancelButtonText: {
    color: "#E53935",
    fontWeight: "bold",
  },
});
