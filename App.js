import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import ProjectsScreen from "./ProjectsScreen";
import TasksScreen from "./TasksScreen";
import { ProjectProvider } from "./ProjectContext";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function ProjectsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Projects" component={ProjectsScreen} />
      <Stack.Screen name="Tasks" component={TasksScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <ProjectProvider>
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen name="ProjectsTab" component={ProjectsStack} options={{ title: "Projects" }} />
        </Tab.Navigator>
      </NavigationContainer>
    </ProjectProvider>
  );
}
