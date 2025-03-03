import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

// Define the type for AlertItem props
interface AlertItemProps {
  id: number;
  location: string;
  category: string;
  severity: string;
  timestamp: string;
  imageUrl?: string;
  onPress: () => void;
}

// Donut Chart Component for Category Distribution
const CategoryDonutChart = () => {
  const colorScheme = useColorScheme() || 'light';
  const isDark = colorScheme === 'dark';


  // Mock data
  const categories = [
    { name: 'Flooding', count: 45, color: '#4285F4' },
    { name: 'Fire', count: 23, color: '#EA4335' },
    { name: 'Power Outage', count: 38, color: '#FBBC05' },
    { name: 'Infrastructure', count: 22, color: '#34A853' }
  ];
  
  const totalIncidents = categories.reduce((sum, category) => sum + category.count, 0);
  
  return (
    <View style={[styles.card, { backgroundColor: isDark ? '#1e1e1e' : '#fff' }]}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>Category Distribution</Text>
        <View style={styles.toggleContainer}>
          <TouchableOpacity style={[styles.toggleButton, styles.toggleActive]}>
            <Text style={styles.toggleText}>Weekly</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.toggleButton}>
            <Text style={styles.toggleText}>Monthly</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.donutChartContainer}>
        {/* Donut chart image would go here in a real app */}
        <View style={styles.donutChartPlaceholder}>
          <Text style={styles.donutChartTotal}>{totalIncidents}</Text>
          <Text style={styles.donutChartTotalLabel}>Total</Text>
        </View>
        
        <View style={styles.categoryList}>
          {categories.map(category => (
            <View key={category.name} style={styles.categoryItem}>
              <View style={[styles.categoryDot, { backgroundColor: category.color }]} />
              <Text style={styles.categoryName}>{category.name}</Text>
              <Text style={styles.categoryCount}>{category.count}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

// WhatsApp Engagement Component
const WhatsAppEngagement = () => {
  const colorScheme = useColorScheme() || 'light';
  const isDark = colorScheme === 'dark';
  
  // Mock data
  const messages = [
    { title: 'Flood Alert', location: 'Gaborone coastal area', time: '2 min ago' },
    { title: 'Power Outage', location: 'Francistown central district', time: '15 min ago' },
    { title: 'Road Closure', location: 'Maun, Main Highway', time: '45 min ago' },
  ];
  
  return (
    <View style={[styles.card, { backgroundColor: isDark ? '#1e1e1e' : '#fff' }]}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>WhatsApp Engagement</Text>
        <TouchableOpacity style={styles.viewAllButton}>
          <Text style={styles.viewAllText}>See all</Text>
          <IconSymbol size={16} name="chevron.right" color={Colors[colorScheme].tint} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.whatsappStatsContainer}>
        <View style={styles.whatsappIconContainer}>
          <IconSymbol size={32} name="message.badge" color="#25D366" />
        </View>
        <View style={styles.whatsappStats}>
          <Text style={styles.whatsappStatsValue}>24,568</Text>
          <Text style={styles.whatsappStatsLabel}>Total messages received</Text>
        </View>
      </View>
      
      {messages.map((message, index) => (
        <View key={index} style={styles.whatsappMessage}>
          <View style={styles.userIconContainer}>
            <IconSymbol size={20} name="person.fill" color="#aaa" />
          </View>
          <View style={styles.messageDetails}>
            <Text style={styles.messageTitle}>{message.title}</Text>
            <Text style={styles.messageLocation}>{message.location}</Text>
          </View>
          <Text style={styles.messageTime}>{message.time}</Text>
        </View>
      ))}
    </View>
  );
};

// Risk Analysis Component
const RiskAnalysisCard = () => {
  const colorScheme = useColorScheme() || 'light';
  const isDark = colorScheme === 'dark';

  return (
    <View style={[styles.card, { backgroundColor: isDark ? '#1e1e1e' : '#fff' }]}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>AI Risk Analysis</Text>
        <TouchableOpacity style={styles.detailsButton}>
          <Text style={styles.detailsText}>Details</Text>
          <IconSymbol size={16} name="chevron.right" color={Colors[colorScheme].tint} />
        </TouchableOpacity>
      </View>

      <View style={styles.riskItem}>
        <Text style={styles.riskLabel}>Flooding Risk</Text>
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: '85%', backgroundColor: '#4a6ed0' }]} />
        </View>
        <Text style={styles.riskPercentage}>85%</Text>
      </View>

      <View style={styles.riskItem}>
        <Text style={styles.riskLabel}>Fire Risk</Text>
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: '42%', backgroundColor: '#e05d44' }]} />
        </View>
        <Text style={styles.riskPercentage}>42%</Text>
      </View>

      <View style={styles.riskItem}>
        <Text style={styles.riskLabel}>Power Outage Risk</Text>
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: '63%', backgroundColor: '#f0ad4e' }]} />
        </View>
        <Text style={styles.riskPercentage}>63%</Text>
      </View>

      <View style={styles.riskItem}>
        <Text style={styles.riskLabel}>Infrastructure Risk</Text>
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: '29%', backgroundColor: '#8e44ad' }]} />
        </View>
        <Text style={styles.riskPercentage}>29%</Text>
      </View>
    </View>
  );
};

// Alert Item Component with Image
const AlertItem: React.FC<AlertItemProps> = ({ id, location, category, severity, timestamp, imageUrl, onPress }) => {
  let severityColor = '#777';
  let severityBgColor = '#f1f1f1';
  
  if (severity === 'High') {
    severityColor = '#d9534f';
    severityBgColor = '#f9e2e2';
  } else if (severity === 'Medium') {
    severityColor = '#f0ad4e';
    severityBgColor = '#fcf8e3';
  } else if (severity === 'Low') {
    severityColor = '#5cb85c';
    severityBgColor = '#e6f5e6';
  }
  
  return (
    <TouchableOpacity style={styles.alertItem} onPress={onPress}>
      {imageUrl && (
        <Image 
          source={{ uri: imageUrl }} 
          style={styles.alertImage}
          resizeMode="cover"
        />
      )}
      <View style={styles.alertContent}>
        <View style={styles.alertItemLeft}>
          <Text style={styles.alertId}>{id}</Text>
          <View style={styles.alertDetails}>
            <Text style={styles.alertLocation}>{location}</Text>
            <Text style={styles.alertCategory}>{category}</Text>
          </View>
        </View>
        <View style={styles.alertItemRight}>
          <View style={[styles.severityBadge, { backgroundColor: severityBgColor }]}>
            <Text style={[styles.severityText, { color: severityColor }]}>{severity}</Text>
          </View>
          <Text style={styles.timestamp}>{timestamp}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// Main Dashboard Component
export default function HomeDashboard() {
  const colorScheme = useColorScheme() || 'light';
  const isDark = colorScheme === 'dark';
  
  // Mock data with images
  const alerts = [
    { 
      id: 1, 
      location: 'Gaborone, Botswana', 
      category: 'Flooding', 
      severity: 'High', 
      timestamp: '2023-06-15 09:30 AM',
      imageUrl: 'https://example.com/images/flooding1.jpg'
    },
    { 
      id: 2, 
      location: 'Francistown, Botswana', 
      category: 'Fire', 
      severity: 'Medium', 
      timestamp: '2023-06-14 02:15 PM',
      imageUrl: 'https://example.com/images/fire1.jpg'
    },
    { 
      id: 3, 
      location: 'Maun, Botswana', 
      category: 'Power Outage', 
      severity: 'Low', 
      timestamp: '2023-06-14 11:45 AM',
      imageUrl: 'https://example.com/images/poweroutage1.jpg'
    },
  ];

  // Image carousel data
  const carouselImages = [
    { uri: 'https://example.com/images/disaster1.jpg', title: 'Flood in Gaborone' },
    { uri: 'https://example.com/images/disaster2.jpg', title: 'Fire in Francistown' },
    { uri: 'https://example.com/images/disaster3.jpg', title: 'Road damage in Maun' },
  ];
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#121212' : '#f8f9fa' }]}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Pula Safe</Text>
          <TouchableOpacity style={styles.notificationButton}>
            <IconSymbol size={24} name="bell.fill" color={Colors[colorScheme].text} />
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationCount}>3</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Image Carousel */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.carouselContainer}
        >
          {carouselImages.map((image, index) => (
            <View key={index} style={styles.carouselItem}>
              <Image 
                source={{ uri: image.uri }} 
                style={styles.carouselImage}
                resizeMode="cover"
              />
              <View style={styles.carouselOverlay}>
                <Text style={styles.carouselTitle}>{image.title}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
        
        <View style={styles.metricsContainer}>
          <View style={[styles.metricCard, { backgroundColor: isDark ? '#1e1e1e' : '#fff' }]}>
            <Text style={styles.metricLabel}>Total Incidents</Text>
            <Text style={styles.metricValue}>128</Text>
            <Text style={[styles.metricChange, { color: '#4caf50' }]}>+12% from last month</Text>
          </View>
          
          <View style={[styles.metricCard, { backgroundColor: isDark ? '#1e1e1e' : '#fff' }]}>
            <Text style={styles.metricLabel}>High Severity</Text>
            <Text style={styles.metricValue}>42</Text>
            <Text style={[styles.metricChange, { color: '#ff5252' }]}>+5% from last month</Text>
          </View>
        </View>

        <WhatsAppEngagement />
        
        <CategoryDonutChart />
        
        <View style={[styles.card, { backgroundColor: isDark ? '#1e1e1e' : '#fff' }]}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Real-Time Alerts</Text>
            <TouchableOpacity style={styles.viewAllButton}>
              <Text style={styles.viewAllText}>View all</Text>
              <IconSymbol size={16} name="chevron.right" color={Colors[colorScheme].tint} />
            </TouchableOpacity>
          </View>
          
          {alerts.map(alert => (
            <AlertItem 
              key={alert.id}
              id={alert.id}
              location={alert.location}
              category={alert.category}
              severity={alert.severity}
              timestamp={alert.timestamp}
              imageUrl={alert.imageUrl}
              onPress={() => console.log(`Alert ${alert.id} pressed`)}
            />
          ))}
        </View>
        
        <RiskAnalysisCard />

        {/* Map Image with Incident Markers */}
        <View style={[styles.card, { backgroundColor: isDark ? '#1e1e1e' : '#fff' }]}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Incident Map</Text>
            <TouchableOpacity style={styles.expandButton}>
              <Text style={styles.expandText}>Expand</Text>
              <IconSymbol size={16} name="arrow.up.right.square" color={Colors[colorScheme].tint} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.mapContainer}>
            <Image 
              source={{ uri: 'https://example.com/images/botswana-map.jpg' }}
              style={styles.mapImage}
              resizeMode="cover"
            />
            <View style={[styles.mapMarker, { top: '30%', left: '45%', backgroundColor: '#d9534f' }]} />
            <View style={[styles.mapMarker, { top: '25%', left: '65%', backgroundColor: '#f0ad4e' }]} />
            <View style={[styles.mapMarker, { top: '50%', left: '25%', backgroundColor: '#5cb85c' }]} />
          </View>
        </View>
        
        <View style={[styles.card, { backgroundColor: isDark ? '#1e1e1e' : '#fff' }]}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>AI Recommendations</Text>
          </View>
          
          <View style={styles.recommendationItem}>
            <IconSymbol size={20} name="checkmark.circle.fill" color="#4a6ed0" />
            <Text style={styles.recommendationText}>Deploy flood barriers in Gaborone areas</Text>
          </View>
          
          <View style={styles.recommendationItem}>
            <IconSymbol size={20} name="checkmark.circle.fill" color="#4a6ed0" />
            <Text style={styles.recommendationText}>Issue weather alerts for Maun region</Text>
          </View>
          
          <View style={styles.recommendationItem}>
            <IconSymbol size={20} name="checkmark.circle.fill" color="#4a6ed0" />
            <Text style={styles.recommendationText}>Prepare backup power for Francistown hospitals</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 85,
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
  notificationButton: {
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
  // Carousel styles
  carouselContainer: {
    paddingLeft: 16,
    marginBottom: 16,
  },
  carouselItem: {
    width: 280,
    height: 150,
    borderRadius: 12,
    marginRight: 12,
    overflow: 'hidden',
  },
  carouselImage: {
    width: '100%',
    height: '100%',
  },
  carouselOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 8,
  },
  carouselTitle: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  metricsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  metricCard: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  metricLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  metricValue: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  metricChange: {
    fontSize: 12,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  scoreValue: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  scoreMax: {
    fontSize: 16,
    fontWeight: '500',
    opacity: 0.7,
  },
  // WhatsApp Engagement
  whatsappStatsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  whatsappIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e9f9e9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  whatsappStats: {
    flex: 1,
  },
  whatsappStatsValue: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  whatsappStatsLabel: {
    fontSize: 14,
    opacity: 0.7,
  },
  whatsappMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  userIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  messageDetails: {
    flex: 1,
  },
  messageTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  messageLocation: {
    fontSize: 13,
    opacity: 0.7,
  },
  messageTime: {
    fontSize: 12,
    opacity: 0.7,
  },
  // Donut Chart
  donutChartContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  donutChartPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 15,
    borderColor: '#FBBC05',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  donutChartTotal: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  donutChartTotalLabel: {
    fontSize: 12,
    opacity: 0.7,
  },
  categoryList: {
    flex: 1,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  categoryName: {
    flex: 1,
    fontSize: 14,
  },
  categoryCount: {
    fontSize: 14,
    fontWeight: '500',
  },
  toggleContainer: {
    flexDirection: 'row',
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    overflow: 'hidden',
  },
  toggleButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  toggleActive: {
    backgroundColor: '#6366f1',
  },
  toggleText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#555',
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 14,
    marginRight: 4,
    color: '#6366f1',
  },
  expandButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  expandText: {
    fontSize: 14,
    marginRight: 4,
    color: '#6366f1',
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f1fe',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  detailsText: {
    fontSize: 14,
    marginRight: 4,
    color: '#6366f1',
  },
  alertItem: {
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f9f9f9',
  },
  alertImage: {
    width: '100%',
    height: 120,
  },
  alertContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
  },
  alertItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  alertId: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 12,
    width: 24,
    textAlign: 'center',
  },
  alertDetails: {
    flex: 1,
  },
  alertLocation: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  alertCategory: {
    fontSize: 13,
    opacity: 0.7,
  },
  alertItemRight: {
    alignItems: 'flex-end',
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 4,
  },
  severityText: {
    fontSize: 12,
    fontWeight: '500',
  },
  timestamp: {
    fontSize: 12,
    opacity: 0.7,
  },
  // Map
  mapContainer: {
    position: 'relative',
    height: 200,
    borderRadius: 8,
    overflow: 'hidden',
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  mapMarker: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'white',
  },
  riskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  riskLabel: {
    fontSize: 14,
    width: 140,
  },
  progressContainer: {
    flex: 1,
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginHorizontal: 8,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  riskPercentage: {
    fontSize: 14,
    fontWeight: '500',
    width: 40,
    textAlign: 'right',
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  recommendationText: {
    fontSize: 14,
    marginLeft: 8,
  },
});