import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { Calendar, DateData } from "react-native-calendars";
import TaskModal from "../../components/TaskModel";
import TaskItem from "../../components/TaskItem";

interface Task {
  time: string;
  task: string;
  elder: string;
  status: string;
}

const ScheduleScreen: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>(getTodayDate());
  const [tasks, setTasks] = useState<{ [date: string]: Task[] }>({
    [getTodayDate()]: [
      { time: "08:00 AM", task: "Medication", elder: "Mrs. Rao", status: "Done!" },
      { time: "08:00 AM", task: "BP Check", elder: "Mrs. Rao", status: "NA" },
    ],
  });
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  function getTodayDate(): string {
    return new Date().toISOString().split("T")[0];
  }

  const handleDayPress = (day: DateData) => {
    setSelectedDate(day.dateString);
  };

  const addTask = (newTask: Task) => {
    setTasks((prevTasks) => ({
      ...prevTasks,
      [selectedDate]: [...(prevTasks[selectedDate] || []), newTask],
    }));
    setModalVisible(false);
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
      <TaskModal visible={modalVisible} onClose={() => setModalVisible(false)} onAdd={addTask} />
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },

  /* Header */
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  header: { fontSize: 24, fontWeight: "bold" },
  highlight: { color: "#ff6b6b" },
  subHeader: { fontSize: 16, color: "#666", marginBottom: 10 },

  /* Calendar */
  calendar: { marginBottom: 10 },

  /* Task Section */
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

  /* Table Header */
  taskHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#ff6b6b",
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  taskHeader: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
  },

  /* Empty Message */
  emptyText: { textAlign: "center", color: "#888", marginTop: 10 },

  /* Add Button */
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

export default  ScheduleScreen;
