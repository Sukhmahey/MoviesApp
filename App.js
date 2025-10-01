import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";

import MoviesPage from "./src/pages/MoviesPage";
import TvPage from "./src/pages/TvPage";
import SearchPage from "./src/pages/SearchPage";
import ShowPage from "./src/pages/ShowPage";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function Tabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Movies" component={MoviesPage} />
      <Tab.Screen name="Search Results" component={SearchPage} />
      <Tab.Screen name="TV Shows" component={TvPage} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Back To List"
          component={Tabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="ShowPage" component={ShowPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
