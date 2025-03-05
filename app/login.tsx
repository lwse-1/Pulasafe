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
import AsyncStorage from '@react-native-async-storage/async-storage';

type RootStackParamList = {
  '(tabs)': undefined;
  'forgotPass': undefined;
  'signup': undefined;
};

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (rememberMe) {
        await AsyncStorage.setItem('rememberMe', 'true');
      } else {
        await AsyncStorage.removeItem('rememberMe');
      }

      console.log('User logged in successfully:', data);
      navigation.navigate('(tabs)');
    } catch (error: any) {
      Alert.alert('Error logging in', error.message);
      console.error('Error logging in:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigation.navigate('forgotPass');
  };

  const handleSignUp = () => {
    navigation.navigate('signup');
  };

  const handleGoogleSignIn = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });

      if (error) throw error;
    } catch (error: any) {
      Alert.alert('Error with Google Sign In', error.message);
    }
  };

  const handleAppleSignIn = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
      });

      if (error) throw error;
    } catch (error: any) {
      Alert.alert('Error with Apple Sign In', error.message);
    }
  };

  const handleFacebookSignIn = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
      });

      if (error) throw error;
    } catch (error: any) {
      Alert.alert('Error with Facebook Sign In', error.message);
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
              <Text style={styles.appName}>PULA SAFE</Text>
            </View>

            {/* Login Form */}
            <View style={styles.formContainer}>
              <Text style={styles.welcomeText}>Welcome Back</Text>
              <Text style={styles.loginText}>Sign in to continue</Text>

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

              {/* Password Field */}
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color="#3949ab" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="#9e9e9e"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color="#3949ab"
                  />
                </TouchableOpacity>
              </View>

              {/* Remember Me & Forgot Password */}
              <View style={styles.rememberForgotContainer}>
                <TouchableOpacity
                  style={styles.rememberContainer}
                  onPress={() => setRememberMe(!rememberMe)}
                >
                  <View style={[styles.checkbox, rememberMe && styles.checkboxActive]}>
                    {rememberMe && <Ionicons name="checkmark" size={16} color="#ffffff" />}
                  </View>
                  <Text style={styles.rememberText}>Remember me</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleForgotPassword}>
                  <Text style={styles.forgotText}>Forgot Password?</Text>
                </TouchableOpacity>
              </View>

              {/* Login Button */}
              <TouchableOpacity
                onPress={handleLogin}
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
                    {loading ? 'SIGNING IN...' : 'SIGN IN'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              {/* Social Login */}
              <View style={styles.orContainer}>
                <View style={styles.divider} />
                <Text style={styles.orText}>OR</Text>
                <View style={styles.divider} />
              </View>

              <View style={styles.socialContainer}>
                <TouchableOpacity style={styles.socialButton} onPress={handleGoogleSignIn}>
                  <Ionicons name="logo-google" size={22} color="#DB4437" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialButton} onPress={handleAppleSignIn}>
                  <Ionicons name="logo-apple" size={22} color="#000" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialButton} onPress={handleFacebookSignIn}>
                  <Ionicons name="logo-facebook" size={22} color="#4267B2" />
                </TouchableOpacity>
              </View>

              {/* Sign Up */}
              <View style={styles.signupContainer}>
                <Text style={styles.noAccountText}>Don't have an account? </Text>
                <TouchableOpacity 
                onPress={handleSignUp}
                // Add some visual feedback
                style={({ pressed }) => [
                  { opacity: pressed ? 0.5 : 1 }
                ]}
              >
                <Text style={styles.signupText}>Sign Up</Text>
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
  // Decorative elements
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
  // Logo
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
  // Form
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
  eyeIcon: {
    padding: 8,
  },
  rememberForgotContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 28,
  },
  rememberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#3949ab',
    borderRadius: 4,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxActive: {
    backgroundColor: '#3949ab',
  },
  rememberText: {
    fontSize: 14,
    color: '#757575',
  },
  forgotText: {
    fontSize: 14,
    color: '#3949ab',
    fontWeight: '600',
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
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  orText: {
    marginHorizontal: 10,
    color: '#9e9e9e',
    fontSize: 14,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 28,
  },
  socialButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e0e0e0',
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