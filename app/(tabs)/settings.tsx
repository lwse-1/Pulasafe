import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, SafeAreaView, TextInput, Image, Alert } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { router } from 'expo-router';
import { supabase } from '../supabase/supabase'; // Initialize Supabase client

// Define the SFSymbols6_0 type
type SFSymbols6_0 = "chevron.right" | "person.fill" | "camera.fill" | "location.fill" | "arrow.down.doc.fill" | "trash.fill" | "arrow.clockwise" | "questionmark.circle.fill" | "exclamationmark.triangle.fill" | "text.bubble.fill" | "star.fill" | "info.circle.fill" | "doc.text.fill" | "lock.shield.fill";

// Define types for the props
interface SettingToggleItemProps {
  title: string;
  description?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}

interface SettingNavItemProps {
  title: string;
  description?: string;
  onPress: () => void;
  iconName?: SFSymbols6_0;
}

interface SectionHeaderProps {
  title: string;
}

interface ProfileCardProps {
  name: string;
  email: string;
  location: string;
  avatar?: string;
  onEdit: () => void;
}

// Setting Item Component with Switch
const SettingToggleItem = ({ title, description, value, onValueChange }: SettingToggleItemProps) => {
  const colorScheme = useColorScheme() || 'light';
  const isDark = colorScheme === 'dark';

  return (
    <View style={styles.settingItem}>
      <View style={styles.settingInfo}>
        <Text style={[styles.settingTitle, { color: isDark ? '#f0f0f0' : '#333' }]}>{title}</Text>
        {description && (
          <Text style={[styles.settingDescription, { color: isDark ? '#aaa' : '#666' }]}>
            {description}
          </Text>
        )}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#d1d1d1', true: '#6366f1' }}
        thumbColor="#fff"
      />
    </View>
  );
};

// Setting Item Component with Navigation
const SettingNavItem = ({ title, description, onPress, iconName }: SettingNavItemProps) => {
  const colorScheme = useColorScheme() || 'light';
  const isDark = colorScheme === 'dark';

  return (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={styles.settingInfo}>
        <Text style={[styles.settingTitle, { color: isDark ? '#f0f0f0' : '#333' }]}>{title}</Text>
        {description && (
          <Text style={[styles.settingDescription, { color: isDark ? '#aaa' : '#666' }]}>
            {description}
          </Text>
        )}
      </View>
      <IconSymbol size={20} name={iconName || "chevron.right"} color={Colors[colorScheme].tint} />
    </TouchableOpacity>
  );
};

// Setting Section Header
const SectionHeader = ({ title }: SectionHeaderProps) => {
  const colorScheme = useColorScheme() || 'light';
  const isDark = colorScheme === 'dark';

  return (
    <Text style={[styles.sectionHeader, { color: isDark ? '#6366f1' : '#6366f1' }]}>
      {title}
    </Text>
  );
};

// Profile Card Component
const ProfileCard = ({ name, email, location, avatar, onEdit }: ProfileCardProps) => {
  const colorScheme = useColorScheme() || 'light';
  const isDark = colorScheme === 'dark';

  return (
    <View style={[styles.profileCard, { backgroundColor: isDark ? '#1e1e1e' : '#fff' }]}>
      <View style={styles.profileHeader}>
        <View style={styles.profileAvatarContainer}>
          {avatar ? (
            <Image source={{ uri: avatar }} style={styles.profileAvatar} />
          ) : (
            <View style={styles.profileAvatarPlaceholder}>
              <IconSymbol size={40} name="person.fill" color="#aaa" />
            </View>
          )}
          <TouchableOpacity style={styles.editAvatarButton}>
            <IconSymbol size={16} name="camera.fill" color="#fff" />
          </TouchableOpacity>
        </View>
        <View style={styles.profileInfo}>
          <Text style={[styles.profileName, { color: isDark ? '#f0f0f0' : '#333' }]}>{name}</Text>
          <Text style={[styles.profileEmail, { color: isDark ? '#bbb' : '#666' }]}>{email}</Text>
          <View style={styles.locationContainer}>
            <IconSymbol size={14} name="location.fill" color="#6366f1" />
            <Text style={styles.profileLocation}>{location}</Text>
          </View>
        </View>
      </View>
      <TouchableOpacity style={styles.editProfileButton} onPress={onEdit}>
        <Text style={styles.editProfileText}>Edit Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

// Main Settings Component
export default function SettingsScreen() {
  const colorScheme = useColorScheme() || 'light';
  const isDark = colorScheme === 'dark';

  // State for toggle settings
  const [notifications, setNotifications] = useState(true);
  const [locationServices, setLocationServices] = useState(true);
  const [whatsappAlerts, setWhatsappAlerts] = useState(true);
  const [darkMode, setDarkMode] = useState(colorScheme === 'dark');
  const [dataSync, setDataSync] = useState(true);
  const [emergencyContacts, setEmergencyContacts] = useState(true);
  const [biometricAuth, setBiometricAuth] = useState(false);
  const [analyticsCollection, setAnalyticsCollection] = useState(true);

  // State for user profile
  const [userProfile, setUserProfile] = useState({
    name: '',
    email: '',
    location: 'Gaborone, Botswana',
    avatar: '',
  });

  // Fetch user details from Supabase
  useEffect(() => {
    const fetchUserProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('full_name, email, phone_number, avatar_url')
          .eq('id', user.id)
          .single();

        if (data) {
          setUserProfile({
            name: data.full_name,
            email: data.email,
            location: 'Gaborone, Botswana',
            avatar: data.avatar_url,
          });
        }
      }
    };

    fetchUserProfile();
  }, []);

  // Handle profile edit
  const handleEditProfile = async () => {
    Alert.prompt(
      'Edit Profile',
      'Enter your new name:',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Save',
          onPress: async (newName) => {

            const updatedName = newName || userProfile.name;

            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
              const { error } = await supabase
                .from('profiles')
                .update({ full_name: updatedName })
                .eq('id', user.id);

              if (!error) {
                setUserProfile((prev) => ({ ...prev, name: updatedName }));
                Alert.alert('Success', 'Profile updated successfully');
              } else {
                Alert.alert('Error', 'Failed to update profile');
              }
            }
          },
        },
      ],
      'plain-text',
      userProfile.name
    );
  };

  // Log out the user
  const handleLogOut = async () => {
    await supabase.auth.signOut();
    router.replace('/login');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#121212' : '#f8f9fa' }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: isDark ? '#f0f0f0' : '#333' }]}>Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ProfileCard
          name={userProfile.name}
          email={userProfile.email}
          location={userProfile.location}
          avatar={userProfile.avatar}
          onEdit={handleEditProfile}
        />

<View style={[styles.settingsSection, { backgroundColor: isDark ? '#1e1e1e' : '#fff' }]}>
          <SectionHeader title="NOTIFICATION PREFERENCES" />
          <SettingToggleItem
            title="Push Notifications"
            description="Receive alerts for new incidents and updates"
            value={notifications}
            onValueChange={setNotifications}
          />
          <SettingToggleItem
            title="WhatsApp Alerts"
            description="Receive critical alerts via WhatsApp"
            value={whatsappAlerts}
            onValueChange={setWhatsappAlerts}
          />
          <SettingNavItem
            title="Alert Categories"
            description="Choose which types of incidents to receive alerts for"
            onPress={() => console.log('Navigate to Alert Categories')}
            iconName="chevron.right"
          />
          <SettingNavItem
            title="Alert Frequency"
            description="Set how often you receive notifications"
            onPress={() => console.log('Navigate to Alert Frequency')}
            iconName="chevron.right"
          />
        </View>

        <View style={[styles.settingsSection, { backgroundColor: isDark ? '#1e1e1e' : '#fff' }]}>
          <SectionHeader title="LOCATION & PRIVACY" />
          <SettingToggleItem
            title="Location Services"
            description="Allow app to access your location for nearby alerts"
            value={locationServices}
            onValueChange={setLocationServices}
          />
          <SettingNavItem
            title="Location Preferences"
            description="Manage tracked locations and radius"
            onPress={() => console.log('Navigate to Location Preferences')}
            iconName="chevron.right"
          />
          <SettingNavItem
            title="Emergency Contacts"
            description="Add people to notify in case of emergency"
            onPress={() => console.log('Navigate to Emergency Contacts')}
            iconName="chevron.right"
          />
          <SettingToggleItem
            title="Data Analytics Collection"
            description="Help improve the app by sharing anonymous usage data"
            value={analyticsCollection}
            onValueChange={setAnalyticsCollection}
          />
        </View>

        <View style={[styles.settingsSection, { backgroundColor: isDark ? '#1e1e1e' : '#fff' }]}>
          <SectionHeader title="APP PREFERENCES" />
          <SettingToggleItem
            title="Dark Mode"
            description="Toggle between light and dark theme"
            value={darkMode}
            onValueChange={setDarkMode}
          />
          <SettingNavItem
            title="Language"
            description="Change app language (Currently: English)"
            onPress={() => console.log('Navigate to Language Settings')}
            iconName="chevron.right"
          />
          <SettingToggleItem
            title="Background Data Sync"
            description="Keep data updated when app is not in use"
            value={dataSync}
            onValueChange={setDataSync}
          />
          <SettingToggleItem
            title="Biometric Authentication"
            description="Use fingerprint or face recognition to login"
            value={biometricAuth}
            onValueChange={setBiometricAuth}
          />
        </View>

        <View style={[styles.settingsSection, { backgroundColor: isDark ? '#1e1e1e' : '#fff' }]}>
          <SectionHeader title="DATA MANAGEMENT" />
          <SettingNavItem
            title="Download Reports"
            description="Export incident reports as PDF or CSV"
            onPress={() => console.log('Navigate to Download Reports')}
            iconName="arrow.down.doc.fill"
          />
          <SettingNavItem
            title="Clear Cache"
            description="Free up storage space on your device"
            onPress={() => console.log('Clear Cache')}
            iconName="trash.fill"
          />
          <SettingNavItem
            title="Data Backup"
            description="Back up your settings and preferences"
            onPress={() => console.log('Navigate to Backup Settings')}
            iconName="arrow.clockwise"
          />
        </View>

        <View style={[styles.settingsSection, { backgroundColor: isDark ? '#1e1e1e' : '#fff' }]}>
          <SectionHeader title="SUPPORT & FEEDBACK" />
          <SettingNavItem
            title="Help Center"
            description="Find answers to common questions"
            onPress={() => console.log('Navigate to Help Center')}
            iconName="questionmark.circle.fill"
          />
          <SettingNavItem
            title="Report an Issue"
            description="Let us know about any problems"
            onPress={() => console.log('Navigate to Report Issue')}
            iconName="exclamationmark.triangle.fill"
          />
          <SettingNavItem
            title="Send Feedback"
            description="Share your thoughts and suggestions"
            onPress={() => console.log('Navigate to Send Feedback')}
            iconName="text.bubble.fill"
          />
          <SettingNavItem
            title="Rate the App"
            description="Tell others what you think of Pulse Safety"
            onPress={() => console.log('Navigate to Rate App')}
            iconName="star.fill"
          />
        </View>

        <View style={[styles.settingsSection, { backgroundColor: isDark ? '#1e1e1e' : '#fff' }]}>
          <SectionHeader title="ABOUT" />
          <SettingNavItem
            title="About Pulse Safety"
            description="Learn more about our mission"
            onPress={() => console.log('Navigate to About')}
            iconName="info.circle.fill"
          />
          <SettingNavItem
            title="Terms of Service"
            onPress={() => console.log('Navigate to Terms')}
            iconName="doc.text.fill"
            description={undefined}
          />
          <SettingNavItem
            title="Privacy Policy"
            onPress={() => console.log('Navigate to Privacy Policy')}
            iconName="lock.shield.fill"
            description={undefined}
          />
          <View style={styles.versionContainer}>
            <Text style={styles.versionText}>Version 1.0.2</Text>
          </View>
        </View>
        
        
        <View style={styles.logoutButton}>
          <TouchableOpacity onPress={handleLogOut}>
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2025 Pulse Safety. All rights reserved.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  backButton: {
    padding: 4,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  // Profile Card
  profileCard: {
    margin: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  profileHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  profileAvatarContainer: {
    position: 'relative',
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  profileAvatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#6366f1',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  profileInfo: {
    marginLeft: 16,
    flex: 1,
    justifyContent: 'center',
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileLocation: {
    fontSize: 14,
    color: '#6366f1',
    marginLeft: 4,
  },
  editProfileButton: {
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
  },
  editProfileText: {
    color: '#6366f1',
    fontWeight: '500',
    fontSize: 14,
  },
  // Settings Sections
  settingsSection: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#e0e0e0',
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 13,
  },
  // Version info
  versionContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },
  versionText: {
    fontSize: 14,
    color: '#888',
  },
  // Logout button
  logoutButton: {
    marginHorizontal: 16,
    marginVertical: 8,
    backgroundColor: '#f44336',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  // Footer
  footer: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  footerText: {
    fontSize: 12,
    color: '#888',
  },
});