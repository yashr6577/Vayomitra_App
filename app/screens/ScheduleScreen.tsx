import React, { useState } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  FlatList, 
  StyleSheet, 
  Alert 
} from "react-native";
import { Calendar, DateData } from "react-native-calendars";
import TaskModal from "../../components/TaskModel";
import TaskItem from "../../components/TaskItem";
import { 
  db, 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  updateDoc, 
  arrayUnion 
} from "../../config/firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Task {
  time: string;
  task: string;
  elder: string; // This field can be ignored now since we'll use AsyncStorage
  status: string;
}

const ScheduleScreen: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>(getTodayDate());
  const [tasks, setTasks] = useState<{ [date: string]: Task[] }>({
    [getTodayDate()]: [
      { time: "08:00 AM", task: "Medication", elder: "elder@example.com", status: "Done!" },
      { time: "08:00 AM", task: "BP Check", elder: "elder@example.com", status: "NA" },
    ],
  });
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  function getTodayDate(): string {
    return new Date().toISOString().split("T")[0];
  }

  const handleDayPress = (day: DateData) => {
    setSelectedDate(day.dateString);
  };

  // Add task and update the specified elder's tasks array in the "users" collection
  const addTask = async (newTask: Task) => {
    try {
      // Update local state
      setTasks((prevTasks) => ({
        ...prevTasks,
        [selectedDate]: [...(prevTasks[selectedDate] || []), newTask],
      }));

      // Add the new task document to Firestore "task" collection
      const taskDocRef = await addDoc(collection(db, "task"), {
        ...newTask,
        date: selectedDate, // Include the selected date for reference
      });
      console.log("Task added with ID:", taskDocRef.id);

      // Retrieve the elder's email from AsyncStorage using key "userRole"
      const elderEmail = await AsyncStorage.getItem("userEmail");
      if (!elderEmail) {
        console.warn("No elder email found in AsyncStorage under key 'userRole'");
      } else {
        // Query the "users" collection to find the elder by email
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("email", "==", elderEmail));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          // Update each matching user document by adding the new task ID to the tasks array
          querySnapshot.forEach(async (doc) => {
            await updateDoc(doc.ref, {
              tasks: arrayUnion(taskDocRef.id),
            });
          });
        } else {
          console.warn("No user found with email:", elderEmail);
        }
      }

      setModalVisible(false);
    } catch (error) {
      console.error("Error adding task:", error);
      Alert.alert("Error", "Failed to add task.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.headerRow}>
        <Text style={styles.header}>
          Today's <Text style={styles.highlight}>Schedule</Text>
        </Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.addButtonText}>+ Add New Task</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.subHeader}>Choose a day to view the schedule.</Text>

      {/* Calendar */}
      <Calendar
        onDayPress={handleDayPress}
        markedDates={{ [selectedDate]: { selected: true, selectedColor: "#ff6b6b" } }}
        theme={{
          selectedDayBackgroundColor: "#ff6b6b",
          todayTextColor: "#ff6b6b",
          arrowColor: "#ff6b6b",
        }}
      />

      {/* Task List Section */}
      <View style={styles.taskContainer}>
        {/* Table Header */}
        <View style={styles.taskHeaderRow}>
          <Text style={[styles.taskHeader, { flex: 1 }]}>Time</Text>
          <Text style={[styles.taskHeader, { flex: 2 }]}>Task</Text>
          <Text style={[styles.taskHeader, { flex: 1.5 }]}>Elder</Text>
          <Text style={[styles.taskHeader, { flex: 1 }]}>Status</Text>
        </View>

        {/* Task List */}
        <FlatList
          showsVerticalScrollIndicator={false}
          data={tasks[selectedDate] || []}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => <TaskItem {...item} />}
          ListEmptyComponent={<Text style={styles.emptyText}>No tasks found.</Text>}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>

      {/* Task Modal */}
      <TaskModal 
        visible={modalVisible} 
        onClose={() => setModalVisible(false)} 
        onAdd={addTask} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  header: { fontSize: 24, fontWeight: "bold" },
  highlight: { color: "#ff6b6b" },
  subHeader: { fontSize: 16, color: "#666", marginBottom: 10 },
  calendar: { marginBottom: 10 },
  taskContainer: {
    flex: 1,
    marginTop: 20,
    padding: 10,
    backgroundColor: "#ffe6e6",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ff6b6b",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  taskHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#ff6b6b",
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  taskHeader: { textAlign: "center", fontSize: 14, fontWeight: "bold", color: "#fff" },
  emptyText: { textAlign: "center", color: "#888", marginTop: 10 },
  addButton: {
    backgroundColor: "#ff6b6b",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
  },
  addButtonText: { color: "#fff", fontSize: 14, fontWeight: "bold" },
});

export default ScheduleScreen;
