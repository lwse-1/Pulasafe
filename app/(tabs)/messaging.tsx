import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView, 
  Image,
  TextInput,
  FlatList,
} from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { createClient } from '@supabase/supabase-js';
import { useAuth } from '@/app/AuthContext';
import { supabaseUrl, supabaseAnonKey } from '../supabase/supabase';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface Message {
  id: number;
  name: string;
  lastMessage: string;
  time: string;
  unreadCount: number;
  isOnline: boolean;
  alertType?: string;
  location?: string;
  avatar?: string;
  avatarColor?: string;
  reportedTime?: string;
  lastSeen?: string;
}

type OnPressFunction = (message: Message) => void;
type OnBackFunction = () => void;

const MessageItem = ({ message, onPress }: { message: Message; onPress: OnPressFunction }) => {
  const colorScheme = useColorScheme() || 'light';
  const isDark = colorScheme === 'dark';
  const tabBarHeight = useBottomTabBarHeight();

  return (
    <TouchableOpacity 
      style={[styles.messageItem, { borderBottomColor: isDark ? '#333' : '#f0f0f0' }]} 
      onPress={() => onPress(message)}
    >
      <View style={styles.userAvatar}>
        {message.avatar ? (
          <Image source={{ uri: message.avatar }} style={styles.avatarImage} />
        ) : (
          <View style={[styles.avatarPlaceholder, { backgroundColor: message.avatarColor || '#6366f1' }]}>
            <Text style={styles.avatarText}>{message.name.charAt(0)}</Text>
          </View>
        )}
        {message.isOnline && <View style={styles.onlineIndicator} />}
      </View>
      
      <View style={styles.messageContent}>
        <View style={styles.messageHeader}>
          <Text style={[styles.userName, { color: isDark ? '#fff' : '#000' }]}>{message.name}</Text>
          <Text style={styles.messageTime}>{message.time}</Text>
        </View>
        
        <View style={styles.messagePreviewContainer}>
          <Text 
            style={[styles.messagePreview, { color: isDark ? '#ddd' : '#555' }]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {message.lastMessage}
          </Text>
          
          {message.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadCount}>{message.unreadCount}</Text>
            </View>
          )}
        </View>
        
        {message.alertType && (
          <View style={[styles.alertBadge, { backgroundColor: getAlertColor(message.alertType).bgColor }]}>
            <Text style={[styles.alertText, { color: getAlertColor(message.alertType).textColor }]}>
              {message.alertType}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const ChatScreen = ({ message, onBack }: { message: Message; onBack: OnBackFunction }) => {
  const colorScheme = useColorScheme() || 'light';
  const isDark = colorScheme === 'dark';
  const [newMessage, setNewMessage] = useState('');
  const tabBarHeight = useBottomTabBarHeight();
  
  const chatHistory = [
    { id: 1, text: `${message.alertType || 'Alert'} in ${message.location}`, isUser: false, time: '09:30 AM' },
    { id: 2, text: 'Can you provide more details about the situation?', isUser: true, time: '09:32 AM' },
    { id: 3, text: `${message.lastMessage}`, isUser: false, time: '09:35 AM' },
    { id: 4, text: 'Thank you for the information. I will take necessary actions.', isUser: true, time: '09:40 AM' },
  ];
  
  const sendMessage = () => {
    if (newMessage.trim().length > 0) {
      console.log('Sending message:', newMessage);
      setNewMessage('');
    }
  };
  
  return (
    <View style={[styles.container, { paddingBottom: tabBarHeight }]}>
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#121212' : '#f8f9fa' }]}>
      <View style={[styles.chatHeader, { backgroundColor: isDark ? '#1e1e1e' : '#fff' }]}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <IconSymbol size={24} name="chevron.left" color={Colors[colorScheme].tint} />
        </TouchableOpacity>
        
        <View style={styles.userAvatar}>
          {message.avatar ? (
            <Image source={{ uri: message.avatar }} style={styles.avatarImage} />
          ) : (
            <View style={[styles.avatarPlaceholder, { backgroundColor: message.avatarColor || '#6366f1' }]}>
              <Text style={styles.avatarText}>{message.name.charAt(0)}</Text>
            </View>
          )}
        </View>
        
        <View style={styles.chatHeaderInfo}>
          <Text style={[styles.chatHeaderName, { color: isDark ? '#fff' : '#000' }]}>{message.name}</Text>
          <Text style={styles.chatHeaderStatus}>
            {message.isOnline ? 'Online' : `Last seen ${message.lastSeen || 'recently'}`}
          </Text>
        </View>
        
        <TouchableOpacity style={styles.headerButton}>
          <IconSymbol size={20} name="phone" color={Colors[colorScheme].tint} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.headerButton}>
          <IconSymbol size={20} name="ellipsis" color={Colors[colorScheme].tint} />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.chatMessages}>
        {message.alertType && (
          <View style={styles.alertInfoCard}>
            <View style={[styles.alertIconContainer, { backgroundColor: getAlertColor(message.alertType).bgColor }]}>
              <IconSymbol size={20} name="exclamationmark.triangle" color={getAlertColor(message.alertType).textColor} />
            </View>
            <View style={styles.alertInfoContent}>
              <Text style={styles.alertInfoTitle}>{message.alertType} Alert</Text>
              <Text style={styles.alertInfoLocation}>{message.location}</Text>
              <Text style={styles.alertInfoTime}>Reported: {message.reportedTime || message.time}</Text>
            </View>
          </View>
        )}
        
        {chatHistory.map((chat) => (
          <View 
            key={chat.id} 
            style={[
              styles.chatBubbleContainer,
              chat.isUser ? styles.userBubbleContainer : styles.contactBubbleContainer
            ]}
          >
            <View 
              style={[
                styles.chatBubble,
                chat.isUser 
                  ? [styles.userBubble, { backgroundColor: isDark ? '#0b5a93' : '#e3f2fd' }] 
                  : [styles.contactBubble, { backgroundColor: isDark ? '#333' : '#f1f1f1' }]
              ]}
            >
              <Text style={[
                styles.chatBubbleText, 
                { color: chat.isUser ? (isDark ? '#fff' : '#0d47a1') : (isDark ? '#fff' : '#333') }
              ]}>
                {chat.text}
              </Text>
              <Text style={styles.chatBubbleTime}>{chat.time}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
      
      <View style={[styles.inputContainer, { backgroundColor: isDark ? '#1e1e1e' : '#fff' }]}>
        <TouchableOpacity style={styles.attachButton}>
          <IconSymbol size={20} name="paperclip" color={Colors[colorScheme].tint} />
        </TouchableOpacity>
        
        <TextInput
          style={[styles.messageInput, { 
            backgroundColor: isDark ? '#333' : '#f1f1f1',
            color: isDark ? '#fff' : '#000' 
          }]}
          placeholder="Type a message..."
          placeholderTextColor={isDark ? '#aaa' : '#999'}
          value={newMessage}
          onChangeText={setNewMessage}
        />
        
        <TouchableOpacity 
          style={[styles.sendButton, { 
            backgroundColor: newMessage.trim().length > 0 ? '#6366f1' : (isDark ? '#333' : '#f1f1f1') 
          }]}
          onPress={sendMessage}
          disabled={newMessage.trim().length === 0}
        >
          <IconSymbol 
            size={20} 
            name="paperplane.fill" 
            color={newMessage.trim().length > 0 ? '#fff' : (isDark ? '#555' : '#999')} 
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
    </View>
  );
};

const getAlertColor = (alertType: string) => {
  switch (alertType.toLowerCase()) {
    case 'high':
    case 'urgent':
    case 'flooding':
    case 'fire':
      return { bgColor: '#ffebee', textColor: '#d32f2f' };
    case 'medium':
    case 'warning':
    case 'power outage':
      return { bgColor: '#fff8e1', textColor: '#ff8f00' };
    case 'low':
    case 'info':
    case 'infrastructure':
      return { bgColor: '#e8f5e9', textColor: '#388e3c' };
    default:
      return { bgColor: '#e3f2fd', textColor: '#1976d2' };
  }
};

export default function MessagesPage() {
  const colorScheme = useColorScheme() || 'light';
  const isDark = colorScheme === 'dark';
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const tabBarHeight = useBottomTabBarHeight();
  
  const messages: Message[] = [
    { 
      id: 1, 
      name: 'Gaborone Emergency Center', 
      lastMessage: 'Water levels rising in Gaborone coastal area. Deploy flood barriers ASAP.',
      time: '2 min ago',
      unreadCount: 3,
      isOnline: true,
      alertType: 'Flooding',
      location: 'Gaborone coastal area',
      avatarColor: '#4285F4',
      reportedTime: 'Today at 09:15 AM',
      lastSeen: 'just now'
    },
  ];
  
  const filteredMessages = messages.filter(message => {
    const matchesSearch = 
      message.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (message.location && message.location.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (filter === 'all') return matchesSearch;
    if (filter === 'unread') return matchesSearch && message.unreadCount > 0;
    if (filter === 'alerts') return matchesSearch && message.alertType;
    return matchesSearch;
  });
  
  const handleMessagePress: OnPressFunction = (message) => {
    setSelectedMessage(message);
  };
  
  const handleBack: OnBackFunction = () => {
    setSelectedMessage(null);
  };
  
  if (selectedMessage) {
    return <ChatScreen message={selectedMessage} onBack={handleBack} />;
  }
  
  return (
    <View style={[styles.container, { paddingBottom: tabBarHeight }]}>
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#121212' : '#f8f9fa' }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
        <TouchableOpacity style={styles.headerButton}>
          <IconSymbol size={24} name="bell.fill" color={Colors[colorScheme].text} />
          {messages.reduce((count, msg) => count + msg.unreadCount, 0) > 0 && (
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationCount}>{messages.reduce((count, msg) => count + msg.unreadCount, 0)}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
      
      <View style={[styles.searchContainer, { backgroundColor: isDark ? '#1e1e1e' : '#fff' }]}>
        <View style={[styles.searchBar, { backgroundColor: isDark ? '#333' : '#f1f1f1' }]}>
          <IconSymbol size={20} name="magnifyingglass" color={isDark ? '#aaa' : '#999'} />
          <TextInput
            style={[styles.searchInput, { color: isDark ? '#fff' : '#000' }]}
            placeholder="Search messages..."
            placeholderTextColor={isDark ? '#aaa' : '#999'}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <IconSymbol size={20} name="xmark.circle.fill" color={isDark ? '#aaa' : '#999'} />
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity 
            style={[
              styles.filterButton, 
              filter === 'all' && [styles.activeFilter, { backgroundColor: isDark ? '#6366f1' : '#e8eaff' }]
            ]}
            onPress={() => setFilter('all')}
          >
            <Text 
              style={[
                styles.filterText, 
                filter === 'all' && { color: isDark ? '#fff' : '#6366f1', fontWeight: '600' }
              ]}
            >
              All Messages
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.filterButton, 
              filter === 'unread' && [styles.activeFilter, { backgroundColor: isDark ? '#6366f1' : '#e8eaff' }]
            ]}
            onPress={() => setFilter('unread')}
          >
            <Text 
              style={[
                styles.filterText, 
                filter === 'unread' && { color: isDark ? '#fff' : '#6366f1', fontWeight: '600' }
              ]}
            >
              Unread
            </Text>
            {messages.reduce((count, msg) => count + msg.unreadCount, 0) > 0 && (
              <View style={styles.filterBadge}>
                <Text style={styles.filterBadgeText}>{messages.reduce((count, msg) => count + msg.unreadCount, 0)}</Text>
              </View>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.filterButton, 
              filter === 'alerts' && [styles.activeFilter, { backgroundColor: isDark ? '#6366f1' : '#e8eaff' }]
            ]}
            onPress={() => setFilter('alerts')}
          >
            <Text 
              style={[
                styles.filterText, 
                filter === 'alerts' && { color: isDark ? '#fff' : '#6366f1', fontWeight: '600' }
              ]}
            >
              Alerts
            </Text>
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>
                {messages.filter(msg => msg.alertType).length}
              </Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </View>
      
      <FlatList
        data={filteredMessages}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => <MessageItem message={item} onPress={handleMessagePress} />}
        style={styles.messagesList}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <IconSymbol size={40} name="bubble.left.fill" color={isDark ? '#555' : '#ccc'} />
            <Text style={[styles.emptyText, { color: isDark ? '#aaa' : '#777' }]}>
              No messages found
            </Text>
          </View>
        }
      />
      
      <TouchableOpacity 
        style={[styles.floatingButton, { backgroundColor: '#6366f1' }]}
        onPress={() => console.log('New message')}
      >
        <IconSymbol size={24} name="square.and.pencil" color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  </View>
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
    fontSize: 22,
    fontWeight: 'bold',
  },
  headerButton: {
    position: 'relative',
    padding: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#ff5252',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationCount: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  filterContainer: {
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 8,
    borderRadius: 20,
  },
  activeFilter: {
    borderWidth: 0,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
  },
  filterBadge: {
    backgroundColor: '#ff5252',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 6,
  },
  filterBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  messagesList: {
    flex: 1,
  },
  messageItem: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  userAvatar: {
    position: 'relative',
    marginRight: 12,
  },
  avatarImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#4caf50',
    borderWidth: 2,
    borderColor: '#fff',
  },
  messageContent: {
    flex: 1,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  messageTime: {
    fontSize: 12,
    color: '#aaa',
  },
  messagePreviewContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  messagePreview: {
    fontSize: 14,
    flex: 1,
    marginRight: 8,
  },
  unreadBadge: {
    backgroundColor: '#6366f1',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadCount: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  alertBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 6,
  },
  alertText: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 12,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 8,
  },
  chatHeaderInfo: {
    flex: 1,
    marginLeft: 8,
  },
  chatHeaderName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  chatHeaderStatus: {
    fontSize: 12,
    color: '#888',
  },
  chatMessages: {
    flex: 1,
    padding: 12,
  },
  alertInfoCard: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  alertIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  alertInfoContent: {
    flex: 1,
  },
  alertInfoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  alertInfoLocation: {
    fontSize: 14,
    marginBottom: 2,
  },
  alertInfoTime: {
    fontSize: 12,
    color: '#888',
  },
  chatBubbleContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  userBubbleContainer: {
    justifyContent: 'flex-end',
  },
  contactBubbleContainer: {
    justifyContent: 'flex-start',
  },
  chatBubble: {
    maxWidth: '80%',
    borderRadius: 16,
    padding: 12,
  },
  userBubble: {
    borderBottomRightRadius: 4,
  },
  contactBubble: {
    borderBottomLeftRadius: 4,
  },
  chatBubbleText: {
    fontSize: 16,
  },
  chatBubbleTime: {
    fontSize: 10,
    color: '#888',
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  attachButton: {
    padding: 8,
  },
  messageInput: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 8,
    fontSize: 16,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});