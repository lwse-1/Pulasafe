import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { supabase } from '../app/supabase/supabaseClient';

type RootStackParamList = {
  'login': undefined;
};
export default function ForgotPassScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  
  const handleBackLogin = () => {
    navigation.navigate('login');
  };

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'yourapp://reset-password',
      });

      if (error) throw error;

      Alert.alert(
        'Password Reset Email Sent',
        'Check your email for a link to reset your password',
        [{ text: 'OK', onPress: () => navigation.navigate('login') }]
      );
    } catch (error: any) {
      Alert.alert('Error resetting password', error.message);
      console.error('Error resetting password:', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#1a237e', '#3949ab', '#5c6bc0']}
      style={styles.gradientBackground}
    >
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidView}
        >
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            {/* Logo and Background Design */}
            <View style={styles.decorationTop}>
              <View style={styles.circle1} />
              <View style={styles.circle2} />
            </View>

            {/* Logo */}
            <View style={styles.logoContainer}>
              <Image
                source={{ uri: 'https://via.placeholder.com/150' }}
                style={styles.logo}
              />
              <Text style={styles.appName}>PULSASAFE</Text>
            </View>

            {/* Reset Password Form */}
            <View style={styles.formContainer}>
              <Text style={styles.welcomeText}>Reset Password</Text>
              <Text style={styles.loginText}>Enter your email to reset your password</Text>

              {/* Email Field */}
              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={20} color="#3949ab" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Email Address"
                  placeholderTextColor="#9e9e9e"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              {/* Reset Password Button */}
              <TouchableOpacity 
                onPress={handleResetPassword} 
                style={styles.loginButton}
                disabled={loading}
              >
                <LinearGradient
                  colors={['#1a237e', '#3949ab']}
                  style={styles.loginGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.loginButtonText}>
                    {loading ? 'SENDING EMAIL...' : 'RESET PASSWORD'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              {/* Back to Login */}
              <View style={styles.signupContainer}>
                <Text style={styles.noAccountText}>Remember your password? </Text>
                <TouchableOpacity onPress={handleBackLogin}
                style={({ pressed }) => [
                  { opacity: pressed ? 0.5 : 1 }
                ]}>
                  
                  <Text style={styles.signupText}>Login</Text>
                </TouchableOpacity>
              </View>
            </View>

          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  keyboardAvoidView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    position: 'relative',
  },
  decorationTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 200,
    overflow: 'hidden',
  },
  decorationBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 200,
    overflow: 'hidden',
  },
  circle1: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    top: -80,
    left: -60,
  },
  circle2: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    top: -20,
    right: -40,
  },
  circle3: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    bottom: -80,
    right: -60,
  },
  circle4: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    bottom: -30,
    left: -40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 90,
    height: 90,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 10,
    letterSpacing: 1,
  },
  formContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 8,
  },
  welcomeText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1a237e',
    marginBottom: 8,
  },
  loginText: {
    fontSize: 16,
    color: '#757575',
    marginBottom: 28,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 18,
    backgroundColor: '#f5f5f5',
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#424242',
    height: 56,
  },
  loginButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 28,
    elevation: 2,
    shadowColor: '#1a237e',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  loginGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  noAccountText: {
    fontSize: 14,
    color: '#757575',
  },
  signupText: {
    fontSize: 14,
    color: '#1a237e',
    fontWeight: 'bold',
  },
});