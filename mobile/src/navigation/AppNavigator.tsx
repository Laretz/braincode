import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../store/authStore';
import { COLORS } from '../constants';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

import {
  WelcomeScreen,
  LoginScreen,
  RegisterScreen,
  FeedScreen,
  PostDetailsScreen,
  ProfileScreen,
  CreatePostScreen,
  SearchScreen,
  FoldersScreen,
  FolderDetailsScreen,
} from '../screens';
// TODO: Import these screens when they are created
// import UserProfileScreen from '../screens/profile/UserProfileScreen';

import type {
  RootStackParamList,
  AuthStackParamList,
  MainTabParamList,
  FeedStackParamList,
  FoldersStackParamList,
  SearchStackParamList,
  ProfileStackParamList,
} from './types';

const RootStack = createStackNavigator<RootStackParamList>();
const AuthStack = createStackNavigator<AuthStackParamList>();
const MainTab = createBottomTabNavigator<MainTabParamList>();
const FeedStack = createStackNavigator<FeedStackParamList>();
const FoldersStack = createStackNavigator<FoldersStackParamList>();
const SearchStack = createStackNavigator<SearchStackParamList>();
const ProfileStack = createStackNavigator<ProfileStackParamList>();

// Navegação de Autenticação
function AuthNavigator() {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: COLORS.background },
      }}
    >
      <AuthStack.Screen name="Welcome" component={WelcomeScreen} />
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
    </AuthStack.Navigator>
  );
}

// Navegação do Feed
function FeedNavigator() {
  return (
    <FeedStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.primary,
        },
        headerTintColor: COLORS.background,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <FeedStack.Screen 
        name="FeedList" 
        component={FeedScreen}
        options={{ title: 'Feed' }}
      />
      <FeedStack.Screen 
        name="PostDetails" 
        component={PostDetailsScreen}
        options={{ title: 'Post' }}
      />
      {/* TODO: Add this screen when it is created
      <FeedStack.Screen 
        name="UserProfile" 
        component={UserProfileScreen}
        options={{ title: 'Perfil' }}
      />
      */}
    </FeedStack.Navigator>
  );
}

// Navegação das Pastas
function FoldersNavigator() {
  return (
    <FoldersStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.primary,
        },
        headerTintColor: COLORS.background,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <FoldersStack.Screen 
        name="FoldersList" 
        component={FoldersScreen}
        options={{ title: 'Minhas Pastas' }}
      />
      <FoldersStack.Screen 
        name="FolderDetails" 
        component={FolderDetailsScreen}
        options={{ title: 'Pasta' }}
      />
    </FoldersStack.Navigator>
  );
}

// Navegação da Busca
function SearchNavigator() {
  return (
    <SearchStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.primary,
        },
        headerTintColor: COLORS.background,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <SearchStack.Screen 
        name="SearchHome" 
        component={SearchScreen}
        options={{ title: 'Buscar' }}
      />
    </SearchStack.Navigator>
  );
}

// Navegação do Perfil
function ProfileNavigator() {
  return (
    <ProfileStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.primary,
        },
        headerTintColor: COLORS.background,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <ProfileStack.Screen 
        name="ProfileHome" 
        component={ProfileScreen}
        options={{ title: 'Meu Perfil' }}
      />
    </ProfileStack.Navigator>
  );
}

// Navegação Principal com Tabs
function MainNavigator() {
  return (
    <MainTab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case 'Feed':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Folders':
              iconName = focused ? 'folder' : 'folder-outline';
              break;
            case 'Create':
              iconName = focused ? 'add-circle' : 'add-circle-outline';
              break;
            case 'Search':
              iconName = focused ? 'search' : 'search-outline';
              break;
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
            default:
              iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarStyle: {
          backgroundColor: COLORS.background,
          borderTopColor: COLORS.border,
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      })}
    >
      <MainTab.Screen 
        name="Feed" 
        component={FeedNavigator}
        options={{ tabBarLabel: 'Feed' }}
      />
      <MainTab.Screen 
        name="Folders" 
        component={FoldersNavigator}
        options={{ tabBarLabel: 'Pastas' }}
      />
      <MainTab.Screen 
        name="Create" 
        component={CreatePostScreen}
        options={{ tabBarLabel: 'Criar' }}
      />
      <MainTab.Screen 
        name="Search" 
        component={SearchNavigator}
        options={{ tabBarLabel: 'Buscar' }}
      />
      <MainTab.Screen 
        name="Profile" 
        component={ProfileNavigator}
        options={{ tabBarLabel: 'Perfil' }}
      />
    </MainTab.Navigator>
  );
}

// Componente de Loading
function LoadingScreen() {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={COLORS.primary} />
      <Text style={styles.loadingText}>Carregando...</Text>
    </View>
  );
}

// Navegador Principal
export default function AppNavigator() {
  const { user, isLoading } = useAuthStore();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <RootStack.Screen name="Main" component={MainNavigator} />
      ) : (
        <RootStack.Screen name="Auth" component={AuthNavigator} />
      )}
    </RootStack.Navigator>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.text,
  },
});