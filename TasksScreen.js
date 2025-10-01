import React, { useEffect, useState, useContext } from "react";
import { View, Text, FlatList, TextInput, Button, TouchableOpacity, StyleSheet } from "react-native";
import { db } from "./firebase";
import { collection, addDoc, deleteDoc, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { ProjectContext } from "./ProjectContext";

const TasksScreen = ({ navigation }) => {
  const { selectedProject, setSelectedProject } = useContext(ProjectContext);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    if (!selectedProject) return;

    const projectRef = doc(db, "projects", selectedProject.id);
    const unsubProject = onSnapshot(projectRef, (snapshot) => {
      if (!snapshot.exists()) {
        setSelectedProject(null);
        navigation.navigate("Projects");
      }
    });

    return () => unsubProject();
  }, [selectedProject]);

  useEffect(() => {
    if (!selectedProject) return;

    const tasksRef = collection(db, "projects", selectedProject.id, "tasks");
    const unsub = onSnapshot(tasksRef, (snapshot) => {
      const taskList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks(taskList);
    });

    return () => unsub();
  }, [selectedProject]);

  const addTask = async () => {
    if (!newTask.trim()) return;
    await addDoc(collection(db, "projects", selectedProject.id, "tasks"), {
      title: newTask,
    });
    const tasksRef = collection(db, "projects", selectedProject.id, "tasks");
    const snapshot = await tasksRef.get();
    await updateDoc(doc(db, "projects", selectedProject.id), {
      taskCount: snapshot.size,
    });
    setNewTask("");
  };

  const deleteTask = async (taskId) => {
    await deleteDoc(doc(db, "projects", selectedProject.id, "tasks", taskId));
    const tasksRef = collection(db, "projects", selectedProject.id, "tasks");
    const snapshot = await tasksRef.get();
    await updateDoc(doc(db, "projects", selectedProject.id), {
      taskCount: snapshot.size,
    });
  };

  if (!selectedProject) {
    return (
      <View style={styles.container}>
        <Text>No project selected</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{selectedProject.name} - Tasks</Text>

      <View style={styles.addTaskRow}>
        <TextInput
          value={newTask}
          onChangeText={setNewTask}
          placeholder="New Task"
          style={styles.input}
        />
        <Button title="Add" onPress={addTask} />
      </View>

      {tasks.length === 0 ? (
        <Text>No tasks found for this project.</Text>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.taskItem}>
              <Text>{item.title}</Text>
              <TouchableOpacity onPress={() => deleteTask(item.id)}>
                <Text style={{ color: "red" }}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
};

export default TasksScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { fontSize: 20, fontWeight: "bold", marginBottom: 12 },
  addTaskRow: { flexDirection: "row", marginBottom: 12, alignItems: "center" },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginRight: 8,
    borderRadius: 5,
  },
  taskItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
    backgroundColor: "#eee",
    borderRadius: 8,
    marginBottom: 8,
  },
});
