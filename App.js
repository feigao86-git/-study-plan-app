import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Text, View, StyleSheet } from 'react-native';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import TaskScreen from './src/screens/TaskScreen';
import PetScreen from './src/screens/PetScreen';
import StatsScreen from './src/screens/StatsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import AddTaskScreen from './src/screens/AddTaskScreen';
import IncompleteRecordScreen from './src/screens/IncompleteRecordScreen';

// Services
import { initDatabase } from './src/services/database';
import { setupNotifications } from './src/services/notifications';

// Constants
import { COLORS } from './src/constants/theme';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Tab Icon Component
function TabIcon({ name, focused }) {
  const icons = {
    首页: '🏠',
    任务: '📝',
    宠物: '🐱',
    统计: '📊',
    我的: '👤',
  };

  return (
    <View style={[styles.iconContainer, focused && styles.iconContainerFocused]}>
      <Text style={styles.icon}>{icons[name] || '📱'}</Text>
      <Text style={[styles.label, focused && styles.labelFocused]}>{name}</Text>
    </View>
  );
}

// Main Tabs
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
        tabBarIcon: ({ focused }) => <TabIcon name={route.name} focused={focused} />,
      })}
    >
      <Tab.Screen name="首页" component={HomeScreen} />
      <Tab.Screen name="任务" component={TaskScreen} />
      <Tab.Screen name="宠物" component={PetScreen} />
      <Tab.Screen name="统计" component={StatsScreen} />
      <Tab.Screen name="我的" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  useEffect(() => {
    // Initialize database and notifications
    const init = async () => {
      try {
        await initDatabase();
        await setupNotifications();
        console.log('App initialized successfully');
      } catch (error) {
        console.error('Initialization error:', error);
      }
    };
    init();
  }, []);

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen
          name="AddTask"
          component={AddTaskScreen}
          options={{ presentation: 'modal' }}
        />
        <Stack.Screen
          name="IncompleteRecord"
          component={IncompleteRecordScreen}
          options={{ presentation: 'modal' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 70,
    paddingBottom: 10,
    paddingTop: 10,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    elevation: 8,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  iconContainerFocused: {
    backgroundColor: COLORS.primary + '20',
  },
  icon: {
    fontSize: 24,
    marginBottom: 2,
  },
  label: {
    fontSize: 11,
    color: COLORS.gray,
  },
  labelFocused: {
    color: COLORS.primary,
    fontWeight: '600',
  },
});
