import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { router } from 'expo-router';

const NewMessageScreen = () => {
  const colorScheme = useColorScheme() || 'light';
  const isDark = colorScheme === 'dark';
  const [recipient, setRecipient] = useState('');
  const [message, setMessage] = useState('');

  const recipients = [
    { id: 1, name: 'Technical Support' },
    { id: 2, name: 'Emergency Response' },
    { id: 3, name: 'Risk Assessment' },
    { id: 4, name: 'Community Outreach' },
  ];

  const handleSendMessage = () => {
    if (!recipient || !message) {
      alert('Please select a recipient and write a message.');
      return;
    }

    console.log('Sending message to:', recipient, 'Message:', message);
    router.back();
  };

  const getRecipientStyles = (itemName: string) => {
    const isSelected = recipient === itemName;
    return {
      button: {
        backgroundColor: isSelected 
          ? (isDark ? '#4a4a4a' : '#f0f0f0') 
          : 'transparent',
        borderWidth: 1,
        borderColor: isSelected 
          ? (isDark ? '#666' : '#ddd') 
          : (isDark ? '#444' : '#e0e0e0'),
      },
      text: {
        color: isSelected 
          ? (isDark ? '#fff' : '#333') 
          : (isDark ? '#aaa' : '#666'),
      }
    };
  };

  return (
    <SafeAreaView style={[styles.container, { 
      backgroundColor: isDark ? '#121212' : '#ffffff' 
    }]}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.back()} 
          style={styles.backButton}
        >
          <IconSymbol 
            size={20} 
            name="chevron.left" 
            color={isDark ? '#fff' : '#333'} 
          />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { 
          color: isDark ? '#fff' : '#000' 
        }]}>New Message</Text>
      </View>

      <ScrollView 
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={[styles.sectionTitle, { 
          color: isDark ? '#aaa' : '#666' 
        }]}>Select Recipient</Text>
        
        <View style={styles.recipientGrid}>
          {recipients.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.recipientButton, 
                getRecipientStyles(item.name).button
              ]}
              onPress={() => setRecipient(item.name)}
            >
              <Text
                style={[
                  styles.recipientText, 
                  getRecipientStyles(item.name).text
                ]}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.sectionTitle, { 
          color: isDark ? '#aaa' : '#666',
          marginTop: 24 
        }]}>Your Message</Text>
        
        <TextInput
          style={[
            styles.messageInput,
            {
              backgroundColor: isDark ? '#1e1e1e' : '#f9f9f9',
              borderColor: isDark ? '#333' : '#e0e0e0',
              color: isDark ? '#fff' : '#333',
            },
          ]}
          placeholder="Write your message here..."
          placeholderTextColor={isDark ? '#666' : '#999'}
          multiline
          numberOfLines={4}
          value={message}
          onChangeText={setMessage}
        />

        <TouchableOpacity 
          style={[
            styles.sendButton, 
            { 
              backgroundColor: isDark 
                ? (message && recipient ? '#333' : '#222') 
                : (message && recipient ? '#f0f0f0' : '#f8f8f8') 
            }
          ]}
          onPress={handleSendMessage}
          disabled={!message || !recipient}
        >
          <Text style={[
            styles.sendButtonText, 
            { 
              color: isDark 
                ? (message && recipient ? '#fff' : '#666') 
                : (message && recipient ? '#333' : '#999') 
            }
          ]}>
            Send Message
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  content: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  recipientGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  recipientButton: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 6,
    minWidth: '45%',
    alignItems: 'center',
  },
  recipientText: {
    fontSize: 14,
    fontWeight: '500',
  },
  messageInput: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 12,
    fontSize: 15,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  sendButton: {
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginTop: 16,
  },
  sendButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
});

export default NewMessageScreen;