import React, { useEffect, useState, useContext } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { db } from "./firebase";
import { collection, onSnapshot, addDoc } from "firebase/firestore";
import { ProjectContext } from "./ProjectContext";

const ProjectsScreen = ({ navigation }) => {
  const [projects, setProjects] = useState([]);
  const { setSelectedProject } = useContext(ProjectContext);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "projects"), (snapshot) => {
      const projectList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProjects(projectList);
    });
    return () => unsub();
  }, []);

  const handlePress = (project) => {
    setSelectedProject(project);
    navigation.navigate("Tasks"); 
  };

  

  return (
    <View style={styles.container}>
    
      <FlatList
        data={projects}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.projectItem}
            onPress={() => handlePress(item)}
          >
            <Text style={styles.title}>{item.name}</Text>
            <Text style={styles.count}>{item.taskCount || 0} tasks</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default ProjectsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  projectItem: {
    padding: 16,
    backgroundColor: "#f1f1f1",
    marginBottom: 12,
    borderRadius: 8,
  },
  title: { fontSize: 18, fontWeight: "bold" },
  count: { fontSize: 14, color: "gray" },
});
