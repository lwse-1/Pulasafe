import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Dimensions,
} from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

// AI Insight Card Component
const InsightCard = ({ title, description, accuracy, impactLevel, timeframe, icon }) => {
  const colorScheme = useColorScheme() || 'light';
  const isDark = colorScheme === 'dark';
  
  // Determine impact level color
  let impactColor = '#5cb85c'; // Low - Green
  if (impactLevel === 'Medium') {
    impactColor = '#f0ad4e'; // Medium - Yellow
  } else if (impactLevel === 'High') {
    impactColor = '#d9534f'; // High - Red
  } else if (impactLevel === 'Critical') {
    impactColor = '#8e44ad'; // Critical - Purple
  }
  
  return (
    <View style={[styles.insightCard, { backgroundColor: isDark ? '#1e1e1e' : '#fff' }]}>
      <View style={styles.insightHeader}>
        <View style={[styles.iconContainer, { backgroundColor: isDark ? '#2a2a2a' : '#f0f1fe' }]}>
          <IconSymbol size={24} name={icon} color="#6366f1" />
        </View>
        <View style={styles.insightTitleContainer}>
          <Text style={[styles.insightTitle, { color: isDark ? '#f0f0f0' : '#333' }]}>{title}</Text>
          <View style={styles.insightMetrics}>
            <View style={styles.accuracyContainer}>
              <Text style={styles.accuracyLabel}>Accuracy</Text>
              <Text style={styles.accuracyValue}>{accuracy}%</Text>
            </View>
            <View style={[styles.impactBadge, { backgroundColor: `${impactColor}20` }]}>
              <Text style={[styles.impactText, { color: impactColor }]}>{impactLevel} Impact</Text>
            </View>
          </View>
        </View>
      </View>
      
      <Text style={[styles.insightDescription, { color: isDark ? '#bbb' : '#666' }]}>
        {description}
      </Text>
      
      <View style={styles.insightFooter}>
        <Text style={[styles.timeframeText, { color: isDark ? '#aaa' : '#888' }]}>
          {timeframe}
        </Text>
        <TouchableOpacity style={styles.detailsButton}>
          <Text style={styles.detailsButtonText}>View Details</Text>
          <IconSymbol size={16} name="chevron.right" color="#6366f1" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

// AI Accuracy Meter Component
const AIAccuracyMeter = ({ score }) => {
  const colorScheme = useColorScheme() || 'light';
  const isDark = colorScheme === 'dark';
  
  // Calculate color based on score
  let color = '#d9534f'; // Red for low scores
  if (score >= 70 && score < 85) {
    color = '#f0ad4e'; // Yellow for medium scores
  } else if (score >= 85) {
    color = '#5cb85c'; // Green for high scores
  }
  
  return (
    <View style={[styles.meterCard, { backgroundColor: isDark ? '#1e1e1e' : '#fff' }]}>
      <Text style={[styles.meterTitle, { color: isDark ? '#f0f0f0' : '#333' }]}>AI Prediction Accuracy</Text>
      
      <View style={styles.meterContainer}>
        <View style={styles.meterGraphic}>
          <View style={[styles.meterBackground, { backgroundColor: isDark ? '#2a2a2a' : '#f0f0f0' }]} />
          <View 
            style={[
              styles.meterFill, 
              { width: `${score}%`, backgroundColor: color }
            ]} 
          />
        </View>
        <View style={styles.meterValueContainer}>
          <Text style={[styles.meterValue, { color }]}>{score}%</Text>
          <Text style={[styles.meterLabel, { color: isDark ? '#bbb' : '#666' }]}>Overall</Text>
        </View>
      </View>
      
      <View style={styles.meterLegend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#5cb85c' }]} />
          <Text style={[styles.legendText, { color: isDark ? '#bbb' : '#666' }]}>85-100% (Excellent)</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#f0ad4e' }]} />
          <Text style={[styles.legendText, { color: isDark ? '#bbb' : '#666' }]}>70-84% (Good)</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#d9534f' }]} />
          <Text style={[styles.legendText, { color: isDark ? '#bbb' : '#666' }]}>0-69% (Needs Improvement)</Text>
        </View>
      </View>
    </View>
  );
};

// AI Feature Card Component
const AIFeatureCard = ({ title, description, icon, isNew }) => {
  const colorScheme = useColorScheme() || 'light';
  const isDark = colorScheme === 'dark';
  
  return (
    <View style={[styles.featureCard, { backgroundColor: isDark ? '#1e1e1e' : '#fff' }]}>
      <View style={[styles.featureIconContainer, { backgroundColor: isDark ? '#2a2a2a' : '#f0f1fe' }]}>
        <IconSymbol size={28} name={icon} color="#6366f1" />
      </View>
      <View style={styles.featureContent}>
        <View style={styles.featureTitleRow}>
          <Text style={[styles.featureTitle, { color: isDark ? '#f0f0f0' : '#333' }]}>{title}</Text>
          {isNew && (
            <View style={styles.newBadge}>
              <Text style={styles.newBadgeText}>NEW</Text>
            </View>
          )}
        </View>
        <Text style={[styles.featureDescription, { color: isDark ? '#bbb' : '#666' }]}>
          {description}
        </Text>
      </View>
    </View>
  );
};

// Data Source Card Component
const DataSourceCard = ({ name, status, lastUpdated, recordCount }) => {
  const colorScheme = useColorScheme() || 'light';
  const isDark = colorScheme === 'dark';
  
  const isActive = status === 'Active';
  
  return (
    <View style={[styles.dataSourceCard, { backgroundColor: isDark ? '#1e1e1e' : '#fff' }]}>
      <View style={styles.dataSourceHeader}>
        <Text style={[styles.dataSourceName, { color: isDark ? '#f0f0f0' : '#333' }]}>{name}</Text>
        <View style={[
          styles.statusBadge, 
          { backgroundColor: isActive ? '#5cb85c20' : '#d9534f20' }
        ]}>
          <View style={[styles.statusDot, { backgroundColor: isActive ? '#5cb85c' : '#d9534f' }]} />
          <Text style={[styles.statusText, { color: isActive ? '#5cb85c' : '#d9534f' }]}>
            {status}
          </Text>
        </View>
      </View>
      
      <View style={styles.dataSourceDetails}>
        <View style={styles.dataSourceDetail}>
          <Text style={[styles.detailLabel, { color: isDark ? '#aaa' : '#888' }]}>Last Updated</Text>
          <Text style={[styles.detailValue, { color: isDark ? '#f0f0f0' : '#333' }]}>{lastUpdated}</Text>
        </View>
        <View style={styles.dataSourceDetail}>
          <Text style={[styles.detailLabel, { color: isDark ? '#aaa' : '#888' }]}>Records</Text>
          <Text style={[styles.detailValue, { color: isDark ? '#f0f0f0' : '#333' }]}>{recordCount.toLocaleString()}</Text>
        </View>
      </View>
    </View>
  );
};

// Training Progress Component
const TrainingProgress = () => {
  const colorScheme = useColorScheme() || 'light';
  const isDark = colorScheme === 'dark';
  
  // Mock data for model training
  const trainingData = [
    { metric: 'Disaster Image Recognition', progress: 92, color: '#4285F4' },
    { metric: 'Natural Language Processing', progress: 86, color: '#EA4335' },
    { metric: 'Weather Pattern Analysis', progress: 78, color: '#FBBC05' },
    { metric: 'Infrastructure Assessment', progress: 64, color: '#34A853' },
  ];
  
  return (
    <View style={[styles.trainingCard, { backgroundColor: isDark ? '#1e1e1e' : '#fff' }]}>
      <View style={styles.cardHeader}>
        <Text style={[styles.cardTitle, { color: isDark ? '#f0f0f0' : '#333' }]}>AI Model Training Progress</Text>
        <TouchableOpacity style={styles.refreshButton}>
          <IconSymbol size={18} name="arrow.clockwise" color="#6366f1" />
        </TouchableOpacity>
      </View>
      
      <Text style={[styles.lastUpdatedText, { color: isDark ? '#aaa' : '#888' }]}>
        Last updated: Today, 09:45 AM
      </Text>
      
      {trainingData.map((item, index) => (
        <View key={index} style={styles.trainingItem}>
          <Text style={[styles.trainingMetric, { color: isDark ? '#f0f0f0' : '#333' }]}>
            {item.metric}
          </Text>
          <View style={styles.trainingProgressRow}>
            <View style={[styles.progressBackground, { backgroundColor: isDark ? '#2a2a2a' : '#f0f0f0' }]}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${item.progress}%`, backgroundColor: item.color }
                ]} 
              />
            </View>
            <Text style={[styles.progressPercentage, { color: isDark ? '#f0f0f0' : '#333' }]}>
              {item.progress}%
            </Text>
          </View>
        </View>
      ))}
      
      <TouchableOpacity style={styles.viewDetailsButton}>
        <Text style={styles.viewDetailsText}>View Training Details</Text>
      </TouchableOpacity>
    </View>
  );
};

// Main AI Insights Component
export default function AIInsightsScreen() {
  const colorScheme = useColorScheme() || 'light';
  const isDark = colorScheme === 'dark';
  
  // Mock data for AI insights
  const aiInsights = [
    {
      title: 'Flood Risk Prediction',
      description: 'AI analysis indicates a 75% probability of flooding in the Gaborone river basin within the next 48 hours due to recent rainfall patterns and upstream conditions.',
      accuracy: 88,
      impactLevel: 'Critical',
      timeframe: 'Next 48 hours',
      icon: 'drop.fill',
    },
    {
      title: 'Power Outage Forecast',
      description: 'Based on weather conditions and grid performance data, there is a moderate likelihood of power disruptions in the eastern Francistown district.',
      accuracy: 76,
      impactLevel: 'Medium',
      timeframe: 'Next 24 hours',
      icon: 'bolt.fill',
    },
    {
      title: 'Wildfire Vulnerability',
      description: 'Dry conditions and high temperatures have created elevated wildfire risk in northwestern regions. Satellite imagery shows concerning vegetation dryness indices.',
      accuracy: 92,
      impactLevel: 'High',
      timeframe: 'Next 72 hours',
      icon: 'flame.fill',
    },
  ];
  
  // Mock data for AI features
  const aiFeatures = [
    {
      title: 'Anomaly Detection',
      description: 'Identifies unusual patterns in data that may indicate emerging threats or incidents before they escalate.',
      icon: 'exclamationmark.triangle.fill',
      isNew: false,
    },
    {
      title: 'Predictive Analytics',
      description: 'Forecasts potential safety risks based on historical data, weather patterns, and infrastructure conditions.',
      icon: 'chart.line.uptrend.xyaxis',
      isNew: true,
    },
    {
      title: 'Image Recognition',
      description: 'Analyzes photos from users and surveillance systems to identify hazards, damage, and emergency situations.',
      icon: 'camera.fill',
      isNew: false,
    },
    {
      title: 'Natural Language Processing',
      description: 'Processes WhatsApp messages and reports to extract key information and categorize incidents automatically.',
      icon: 'text.bubble.fill',
      isNew: true,
    },
  ];
  
  // Mock data for data sources
  const dataSources = [
    {
      name: 'Botswana Meteorological Services',
      status: 'Active',
      lastUpdated: 'Today, 07:30 AM',
      recordCount: 428563,
    },
    {
      name: 'National Disaster Management Agency',
      status: 'Active',
      lastUpdated: 'Yesterday, 06:45 PM',
      recordCount: 156742,
    },
    {
      name: 'Ministry of Infrastructure',
      status: 'Inactive',
      lastUpdated: '3 days ago',
      recordCount: 89245,
    },
  ];
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#121212' : '#f8f9fa' }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* AI Summary Banner */}
        <View style={[styles.summaryBanner, { backgroundColor: isDark ? '#2a2a2a' : '#f0f1fe' }]}>
          <View style={styles.summaryTextContainer}>
            <Text style={[styles.summaryTitle, { color: isDark ? '#f0f0f0' : '#333' }]}>
              AI Analysis Summary
            </Text>
            <Text style={[styles.summaryDescription, { color: isDark ? '#bbb' : '#666' }]}>
              3 active critical predictions • 7 potential risks monitored • 4 AI models deployed
            </Text>
          </View>
          <View style={[styles.aiIconContainer, { backgroundColor: isDark ? '#1e1e1e' : '#fff' }]}>
            <IconSymbol size={32} name="brain" color="#6366f1" />
          </View>
        </View>
        
        {/* AI Accuracy Meter */}
        <AIAccuracyMeter score={87} />
        
        {/* AI Insights Section */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#f0f0f0' : '#333' }]}>
            Critical Predictions
          </Text>
          <TouchableOpacity style={styles.viewAllButton}>
            <Text style={styles.viewAllText}>View All</Text>
            <IconSymbol size={16} name="chevron.right" color="#6366f1" />
          </TouchableOpacity>
        </View>
        
        {aiInsights.map((insight, index) => (
          <InsightCard 
            key={index}
            title={insight.title}
            description={insight.description}
            accuracy={insight.accuracy}
            impactLevel={insight.impactLevel}
            timeframe={insight.timeframe}
            icon={insight.icon}
          />
        ))}
        
        {/* AI Model Training Progress */}
        <TrainingProgress />
        
        {/* AI Features Section */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#f0f0f0' : '#333' }]}>
            AI Capabilities
          </Text>
        </View>
        
        <View style={styles.featuresGrid}>
          {aiFeatures.map((feature, index) => (
            <AIFeatureCard 
              key={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              isNew={feature.isNew}
            />
          ))}
        </View>
        
        {/* Data Sources Section */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#f0f0f0' : '#333' }]}>
            AI Data Sources
          </Text>
          <TouchableOpacity style={styles.manageButton}>
            <Text style={styles.manageButtonText}>Manage</Text>
          </TouchableOpacity>
        </View>
        
        {dataSources.map((source, index) => (
          <DataSourceCard 
            key={index}
            name={source.name}
            status={source.status}
            lastUpdated={source.lastUpdated}
            recordCount={source.recordCount}
          />
        ))}
        
        {/* Add New Data Source Button */}
        <TouchableOpacity style={[styles.addSourceButton, { backgroundColor: isDark ? '#2a2a2a' : '#f0f1fe' }]}>
          <IconSymbol size={20} name="plus.circle.fill" color="#6366f1" />
          <Text style={styles.addSourceText}>Add New Data Source</Text>
        </TouchableOpacity>
        
        {/* Feedback Section */}
        <View style={[styles.feedbackContainer, { backgroundColor: isDark ? '#1e1e1e' : '#fff' }]}>
          <Text style={[styles.feedbackTitle, { color: isDark ? '#f0f0f0' : '#333' }]}>
            Help Improve Our AI
          </Text>
          <Text style={[styles.feedbackDescription, { color: isDark ? '#bbb' : '#666' }]}>
            Your feedback helps our AI models become more accurate. Report any prediction inaccuracies or insights you find helpful.
          </Text>
          <TouchableOpacity style={styles.feedbackButton}>
            <Text style={styles.feedbackButtonText}>Provide Feedback</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: isDark ? '#aaa' : '#888' }]}>
            AI insights are based on available data and may not represent all potential risks.
            Always follow official government advisories.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const { width } = Dimensions.get('window');
const featureCardWidth = (width - 48) / 2; // 2 columns with spacing

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
  infoButton: {
    padding: 4,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  // Summary Banner
  summaryBanner: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryTextContainer: {
    flex: 1,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  summaryDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  aiIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  // Section Headers
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 24,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 14,
    color: '#6366f1',
    marginRight: 4,
  },
  manageButton: {
    backgroundColor: '#f0f1fe',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  manageButtonText: {
    color: '#6366f1',
    fontSize: 12,
    fontWeight: '500',
  },
  // Insight Card
  insightCard: {
    margin: 16,
    marginTop: 8,
    marginBottom: 8,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  insightHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  insightTitleContainer: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  insightMetrics: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  accuracyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  accuracyLabel: {
    fontSize: 12,
    color: '#888',
    marginRight: 4,
  },
  accuracyValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#6366f1',
  },
  impactBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  impactText: {
    fontSize: 11,
    fontWeight: '500',
  },
  insightDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  insightFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeframeText: {
    fontSize: 12,
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailsButtonText: {
    fontSize: 14,
    color: '#6366f1',
    marginRight: 4,
  },
  // AI Accuracy Meter
  meterCard: {
    margin: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  meterTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  meterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  meterGraphic: {
    flex: 1,
    height: 16,
    marginRight: 16,
    position: 'relative',
  },
  meterBackground: {
    position: 'absolute',
    width: '100%',
    height: 16,
    borderRadius: 8,
  },
  meterFill: {
    position: 'absolute',
    height: 16,
    borderRadius: 8,
  },
  meterValueContainer: {
    alignItems: 'center',
  },
  meterValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  meterLabel: {
    fontSize: 12,
  },
  meterLegend: {
    marginTop: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
  },
  // AI Features
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
    marginHorizontal: 8,
  },
  featureCard: {
    width: featureCardWidth,
    margin: 8,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  featureIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureContent: {
    flex: 1,
  },
  featureTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 8,
    flex: 1,
  },
  newBadge: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  newBadgeText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#fff',
  },
  featureDescription: {
    fontSize: 12,
    lineHeight: 16,
  },
  // Data Sources
  dataSourceCard: {
    margin: 16,
    marginTop: 8,
    marginBottom: 8,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  dataSourceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dataSourceName: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  dataSourceDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dataSourceDetail: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  // Add Source Button
  addSourceButton: {
    margin: 16,
    marginTop: 8,
    padding: 14,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addSourceText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6366f1',
    marginLeft: 8,
  },
  // Training Card
  trainingCard: {
    margin: 16,
    borderRadius: 12,
    padding: 16,
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
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  refreshButton: {
    padding: 4,
  },
  lastUpdatedText: {
    fontSize: 12,
    marginBottom: 16,
  },
  trainingItem: {
    marginBottom: 12,
  },
  trainingMetric: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
  },
  trainingProgressRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBackground: {
    flex: 1,
    height: 10,
    borderRadius: 5,
    marginRight: 12,
  },
  progressFill: {
    height: 10,
    borderRadius: 5,
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: '500',
    width: 40,
    textAlign: 'right',
  },
  viewDetailsButton: {
    marginTop: 12,
    alignItems: 'center',
  },
  viewDetailsText: {
    fontSize: 14,
    color: '#6366f1',
    fontWeight: '500',
  },
  // Feedback
  feedbackContainer: {
    margin: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  feedbackTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  feedbackDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  feedbackButton: {
    backgroundColor: '#6366f1',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  feedbackButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  // Footer
  footer: {
    margin: 16,
    marginTop: 8,
  },
  footerText: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
});