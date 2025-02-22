import React, { useState } from "react";
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";

interface TaskModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (task: { time: string; task: string; elder: string; status: string }) => void;
}

const TaskModal: React.FC<TaskModalProps> = ({ visible, onClose, onAdd }) => {
  const [time, setTime] = useState("");
  const [task, setTask] = useState("");
  const [elder, setElder] = useState("");

  const handleSubmit = () => {
    if (!time || !task || !elder) return alert("Please fill all fields");
    onAdd({ time, task, elder, status: "NA" });
    setTime("");
    setTask("");
    setElder("");
    onClose();
  };

  return (
    <Modal transparent visible={visible} animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Add New Task</Text>

          <TextInput style={styles.input} placeholder="Time (08:00 AM)" onChangeText={setTime} value={time} />
          <TextInput style={styles.input} placeholder="Task" onChangeText={setTask} value={task} />
          <TextInput style={styles.input} placeholder="Elder Name" onChangeText={setElder} value={elder} />

          <TouchableOpacity style={styles.addButton} onPress={handleSubmit}>
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "85%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ff6b6b",
    textAlign: "center",
    marginBottom: 15,
  },
  input: {
    width: "100%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: "#ff6b6b",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  closeButton: {
    backgroundColor: "#ccc",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  closeButtonText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default TaskModal;
