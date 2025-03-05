import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { BlurView } from 'expo-blur';


type SFSymbols6_0 = 'house.fill' | 'eye.fill' | 'chart.bar.fill' | 'gear';
type IconKey = 'home' | 'eye' | 'insights' | 'settings';

const ICONS: Record<IconKey, { ios: SFSymbols6_0; android: string }> = {
  home: { ios: "house.fill", android: "home" },
  eye: { ios: "eye.fill", android: "eye" },
  insights: { ios: "chart.bar.fill", android: "insights" },
  settings: { ios: "gear", android: "settings" }
};

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const getIcon = (iconKey: IconKey): SFSymbols6_0 | string => {
    return Platform.select({
      ios: ICONS[iconKey].ios,
      android: ICONS[iconKey].android,
      default: ICONS[iconKey].android,
    });
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarInactiveTintColor: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: Platform.OS === 'ios' ? () => (
          <BlurView 
            intensity={80} 
            tint={isDark ? 'dark' : 'light'} 
            style={StyleSheet.absoluteFill} 
          />
        ) : TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
            backgroundColor: 'transparent',
            borderTopWidth: 0,
            elevation: 0,
            height: 85,
            paddingBottom: 20,
          },
          android: {
            height: 60,
            elevation: 8,
            backgroundColor: isDark ? '#1F1F1F' : '#FFFFFF',
          },
        }),
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginBottom: Platform.OS === 'ios' ? 0 : 8,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <IconSymbol 
              size={size || 24} 
              name={getIcon('home') as SFSymbols6_0} 
              color={color} 
            />
          ),
        }}
      />
       <Tabs.Screen
        name="feed"
        options={{
          title: 'Feed',
          tabBarIcon: ({ color, size }) => (
            <IconSymbol 
              size={size || 24} 
              name={getIcon('eye') as SFSymbols6_0} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="insights"
        options={{
          title: 'Insights',
          tabBarIcon: ({ color, size }) => (
            <IconSymbol 
              size={size || 24} 
              name={getIcon('insights') as SFSymbols6_0} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <IconSymbol 
              size={size || 24} 
              name={getIcon('settings') as SFSymbols6_0} 
              color={color} 
            />
          ),
        }}
      />
    </Tabs>
  );
}