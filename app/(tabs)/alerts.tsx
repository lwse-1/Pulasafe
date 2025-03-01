import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  SafeAreaView,
  StatusBar,
  TextInput
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

// Define the Alert interface
interface AlertData {
  id: number;
  location: string;
  category: string;
  severity: string;
  timestamp: string;
  imageUrl?: string;
  description: string;
  status: 'New' | 'Acknowledged' | 'In Progress' | 'Resolved';
  affectedArea: string;
  estimatedImpact: string;
  reportedBy: string;
}

// Define the types for your navigation parameters
type RootStackParamList = {
  AlertListScreen: undefined;
  AlertDetailScreen: { alertId: number };
};

// Define the navigation prop type
type AlertListScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AlertListScreen'>;

export default function AlertListScreen() {
  const colorScheme = useColorScheme() || 'light';
  const isDark = colorScheme === 'dark';
  const navigation = useNavigation<AlertListScreenNavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSeverity, setSelectedSeverity] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  // Mock alerts data
  const alerts: AlertData[] = [
    {
      id: 1,
      location: 'Gaborone, Botswana',
      category: 'Flooding',
      severity: 'High',
      timestamp: '2023-06-15 09:30 AM',
      imageUrl: 'https://example.com/images/flooding1.jpg',
      description: 'Severe flooding reported in the coastal area of Gaborone following heavy rainfall. Multiple roads are submerged and some residential areas are at risk.',
      status: 'In Progress',
      affectedArea: '3.5 km²',
      estimatedImpact: '~500 households, 2 hospitals, 3 schools',
      reportedBy: 'Weather Service Department',
    },
    {
      id: 2,
      location: 'Gaborone East District',
      category: 'Power Outage',
      severity: 'Medium',
      timestamp: '2023-06-15 10:15 AM',
      description: 'Power outage affecting multiple neighborhoods in Gaborone East District due to damaged infrastructure from flooding.',
      status: 'Acknowledged',
      affectedArea: '2.1 km²',
      estimatedImpact: '~350 households, 1 clinic',
      reportedBy: 'Power Utility Company',
    },
    {
      id: 3,
      location: 'Central Gaborone',
      category: 'Traffic Incident',
      severity: 'Low',
      timestamp: '2023-06-15 08:45 AM',
      description: 'Multiple vehicle collision on Main Street causing significant traffic delays. No serious injuries reported.',
      status: 'Resolved',
      affectedArea: '0.5 km²',
      estimatedImpact: 'Commuter delays of up to 1 hour',
      reportedBy: 'Traffic Police Department',
    },
    {
      id: 4,
      location: 'Gaborone South',
      category: 'Health Emergency',
      severity: 'High',
      timestamp: '2023-06-14 14:20 PM',
      description: 'Outbreak of waterborne disease reported in multiple neighborhoods following recent flooding.',
      status: 'In Progress',
      affectedArea: '4.2 km²',
      estimatedImpact: '~120 cases reported, 2 hospitals affected',
      reportedBy: 'Public Health Department',
    },
    {
      id: 5,
      location: 'Main Highway, Gaborone',
      category: 'Road Closure',
      severity: 'Low',
      timestamp: '2023-06-15 11:30 AM',
      description: 'Highway section closed due to flooding. Alternative routes established.',
      status: 'Acknowledged',
      affectedArea: '3.0 km',
      estimatedImpact: 'Affects intercity transit and local commuters',
      reportedBy: 'Highway Authority',
    },
  ];

  // Get severity styling
  const getSeverityStyle = (severity: string) => {
    let color = '#777';
    let bgColor = '#f1f1f1';
    
    if (severity === 'High') {
      color = '#d9534f';
      bgColor = '#f9e2e2';
    } else if (severity === 'Medium') {
      color = '#f0ad4e';
      bgColor = '#fcf8e3';
    } else if (severity === 'Low') {
      color = '#5cb85c';
      bgColor = '#e6f5e6';
    }
    
    return { color, bgColor };
  };

  // Get status styling
  const getStatusStyle = (status: string) => {
    let color = '#777';
    let bgColor = '#f1f1f1';
    
    if (status === 'New') {
      color = '#0275d8';
      bgColor = '#e6f2ff';
    } else if (status === 'Acknowledged') {
      color = '#f0ad4e';
      bgColor = '#fcf8e3';
    } else if (status === 'In Progress') {
      color = '#5bc0de';
      bgColor = '#e8f8fc';
    } else if (status === 'Resolved') {
      color = '#5cb85c';
      bgColor = '#e6f5e6';
    }
    
    return { color, bgColor };
  };

  // Filter alerts based on search query and filters
  const filteredAlerts = alerts.filter(alert => {
    // Search query filter
    const matchesSearch = searchQuery === '' || 
      alert.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Category filter
    const matchesCategory = selectedCategory === null || alert.category === selectedCategory;
    
    // Severity filter
    const matchesSeverity = selectedSeverity === null || alert.severity === selectedSeverity;
    
    // Status filter
    const matchesStatus = selectedStatus === null || alert.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesSeverity && matchesStatus;
  });

  // Categories, Severities, and Statuses for filters
  const categories = [...new Set(alerts.map(alert => alert.category))];
  const severities = ['High', 'Medium', 'Low'];
  const statuses = ['New', 'Acknowledged', 'In Progress', 'Resolved'];

  // Clear all filters
  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedSeverity(null);
    setSelectedStatus(null);
  };

  // Render each alert item
  const renderAlertItem = ({ item }: { item: AlertData }) => {
    const severityStyle = getSeverityStyle(item.severity);
    const statusStyle = getStatusStyle(item.status);
    
    return (
      <TouchableOpacity 
        style={[styles.alertCard, { backgroundColor: isDark ? '#1e1e1e' : '#fff' }]}
        onPress={() => navigation.navigate('AlertDetailScreen', { alertId: item.id })}
      >
        <View style={styles.alertHeader}>
          <Text style={styles.alertId}>#{item.id}</Text>
          <View style={styles.badgeContainer}>
            <View style={[styles.severityBadge, { backgroundColor: severityStyle.bgColor }]}>
              <Text style={[styles.severityText, { color: severityStyle.color }]}>
                {item.severity}
              </Text>
            </View>
          </View>
        </View>
        
        <Text style={styles.alertLocation}>{item.location}</Text>
        <Text style={styles.alertCategory}>{item.category}</Text>
        
        <View style={styles.alertDetails}>
          <Text style={styles.alertDescription} numberOfLines={2}>
            {item.description}
          </Text>
        </View>
        
        <View style={styles.alertFooter}>
          <Text style={styles.timestamp}>{item.timestamp}</Text>
          <View style={[styles.statusBadge, { backgroundColor: statusStyle.bgColor }]}>
            <Text style={[styles.statusText, { color: statusStyle.color }]}>
              {item.status}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // Render filter option
  const renderFilterOption = (
    title: string, 
    options: string[], 
    selectedOption: string | null, 
    setOption: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    return (
      <View style={styles.filterSection}>
        <Text style={styles.filterTitle}>{title}</Text>
        <View style={styles.filterOptions}>
          {options.map(option => (
            <TouchableOpacity
              key={option}
              style={[
                styles.filterOption,
                { backgroundColor: selectedOption === option ? '#6366f1' : isDark ? '#333' : '#f0f0f0' }
              ]}
              onPress={() => setOption(option === selectedOption ? null : option)}
            >
              <Text style={{ 
                color: selectedOption === option ? '#fff' : isDark ? '#ddd' : '#333',
                fontSize: 13
              }}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#121212' : '#f8f9fa' }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: isDark ? '#fff' : '#000' }]}>Emergency Alerts</Text>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setFilterVisible(!filterVisible)}
        >
          <IconSymbol 
            size={24} 
            name={filterVisible ? "xmark" : "slider.horizontal.3"} 
            color={Colors[colorScheme].text} 
          />
        </TouchableOpacity>
      </View>
      
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={[
          styles.searchBar, 
          { backgroundColor: isDark ? '#333' : '#f0f0f0' }
        ]}>
          <IconSymbol size={20} name="magnifyingglass" color="#777" />
          <TextInput
            style={[styles.searchInput, { color: isDark ? '#fff' : '#000' }]}
            placeholder="Search alerts..."
            placeholderTextColor="#777"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery !== '' && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <IconSymbol size={18} name="xmark.circle.fill" color="#777" />
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      {/* Filters */}
      {filterVisible && (
        <View style={[styles.filtersContainer, { backgroundColor: isDark ? '#1e1e1e' : '#fff' }]}>
          {renderFilterOption('Category', categories, selectedCategory, setSelectedCategory)}
          {renderFilterOption('Severity', severities, selectedSeverity, setSelectedSeverity)}
          {renderFilterOption('Status', statuses, selectedStatus, setSelectedStatus)}
          
          <TouchableOpacity 
            style={styles.clearFiltersButton}
            onPress={clearFilters}
          >
            <Text style={styles.clearFiltersText}>Clear All Filters</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {/* Alerts List */}
      <FlatList
        data={filteredAlerts}
        renderItem={renderAlertItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.alertsList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <IconSymbol size={48} name="exclamationmark.triangle" color="#aaa" />
            <Text style={styles.emptyStateText}>No alerts match your criteria</Text>
          </View>
        }
      />
      
      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab}>
        <IconSymbol size={24} name="plus" color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  filterButton: {
    padding: 8,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderRadius: 20,
    height: 44,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  filtersContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  filterSection: {
    marginBottom: 12,
  },
  filterTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  filterOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  clearFiltersButton: {
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginTop: 4,
  },
  clearFiltersText: {
    color: '#6366f1',
    fontSize: 14,
    fontWeight: '500',
  },
  alertsList: {
    padding: 16,
    paddingBottom: 80, // Extra space for FAB
  },
  alertCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  alertId: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  badgeContainer: {
    flexDirection: 'row',
  },
  severityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  severityText: {
    fontSize: 12,
    fontWeight: '600',
  },
  alertLocation: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  alertCategory: {
    fontSize: 15,
    color: '#555',
    marginBottom: 8,
  },
  alertDetails: {
    marginBottom: 12,
  },
  alertDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: '#666',
  },
  alertFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timestamp: {
    fontSize: 13,
    color: '#777',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyStateText: {
    marginTop: 12,
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
});