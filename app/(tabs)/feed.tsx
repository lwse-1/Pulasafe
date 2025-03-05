import React, { useState, useEffect, useCallback } from 'react';
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
  Alert,
  ActivityIndicator,
  RefreshControl,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { supabase } from '../supabase/supabase';
import * as ImagePicker from 'expo-image-picker';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

// Define types for the props and data structures
type Category = {
  id: number;
  name: string;
  color: string;
};

type Post = {
  id: number;
  text: string;
  category: string;
  category_color: string;
  location: string;
  created_at: string;
  has_photo: boolean;
  photo_url: string | null;
  likes_count: number;
  comments_count: number;
  liked_by_current_user: boolean;
};

type CreatePostCardProps = {
  onPostCreated: (newPost: Post) => void;
  isSubmitting: boolean;
};

type PostItemProps = {
  post: Post;
  onLike: (postId: number) => void;
  onComment: (postId: number) => void;
  onDelete: (postId: number) => void;
};

type FilterTabsProps = {
  activeTab: string;
  onTabChange: (tabId: string) => void;
};

// Supabase helper to upload image
const uploadImage = async (uri: string): Promise<string | null> => {
  try {
    const photoFilename = `post_${Date.now()}.jpg`;
    const formData = new FormData();
    formData.append('file', {
      uri,
      type: 'image/jpeg',
      name: photoFilename,
    } as any);

    const { error } = await supabase.storage
      .from('post_images')
      .upload(photoFilename, formData);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('post_images')
      .getPublicUrl(photoFilename);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    return null;
  }
};

// Post Creation Component
const CreatePostCard = ({ onPostCreated, isSubmitting }: CreatePostCardProps) => {
  const colorScheme = useColorScheme() || 'light';
  const isDark = colorScheme === 'dark';
  const [postText, setPostText] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [location, setLocation] = useState<string>('');
  const [photoAttached, setPhotoAttached] = useState<boolean>(false);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  // Fetch categories from the database
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .order('id');
        
        if (error) throw error;
        
        if (data) {
          setCategories(data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        // Fall back to hardcoded categories if there's an error
        setCategories([
          { id: 1, name: 'Flooding', color: '#4285F4' },
          { id: 2, name: 'Fire', color: '#EA4335' },
          { id: 3, name: 'Power Outage', color: '#FBBC05' },
          { id: 4, name: 'Infrastructure', color: '#34A853' },
          { id: 5, name: 'Other', color: '#8e44ad' },
        ]);
      }
    };

    fetchCategories();
  }, []);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission Required', 'You need to allow access to your photos to attach images.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
      setPhotoAttached(true);
    }
  };

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission Required', 'You need to allow access to your camera to take photos.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
      setPhotoAttached(true);
    }
  };

  const handlePost = async () => {
    if (postText.trim().length === 0) return;

    try {
      let photoUrl = null;
      if (photoAttached && photoUri) {
        photoUrl = await uploadImage(photoUri);
      }

      const newPostData = {
        text: postText,
        category: selectedCategory ? selectedCategory.name : 'Other',
        category_color: selectedCategory ? selectedCategory.color : '#8e44ad',
        location: location || 'Unknown Location',
        has_photo: photoAttached && !!photoUrl,
        photo_url: photoUrl,
      };

      const { data, error } = await supabase
        .from('posts')
        .insert(newPostData)
        .select()
        .single();

      if (error) throw error;

      const newPost: Post = {
        id: data.id,
        text: data.text,
        category: data.category,
        category_color: data.category_color,
        location: data.location,
        created_at: data.created_at,
        has_photo: data.has_photo,
        photo_url: data.photo_url,
        likes_count: 0,
        comments_count: 0,
        liked_by_current_user: false,
      };

      onPostCreated(newPost);

      setPostText('');
      setSelectedCategory(null);
      setLocation('');
      setPhotoAttached(false);
      setPhotoUri(null);
    } catch (error) {
      console.error('Error creating post:', error);
      Alert.alert('Error', 'Failed to create post. Please try again.');
    }
  };

  const togglePhoto = () => {
    if (photoAttached) {
      setPhotoAttached(false);
      setPhotoUri(null);
    } else {
      Alert.alert(
        'Add Photo',
        'Choose a photo source',
        [
          { text: 'Camera', onPress: takePhoto },
          { text: 'Gallery', onPress: pickImage },
          { text: 'Cancel', style: 'cancel' },
        ]
      );
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.card}
    >
      <View style={[styles.card, { backgroundColor: isDark ? '#1e1e1e' : '#fff' }]}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Create New Post</Text>
        </View>

        <View style={styles.postInputContainer}>
          <TextInput
            style={[styles.postInput, { color: isDark ? '#fff' : '#333' }]}
            placeholder="What's happening? Report an incident..."
            placeholderTextColor={isDark ? '#aaa' : '#999'}
            multiline
            value={postText}
            onChangeText={setPostText}
            accessibilityLabel="Post input field"
          />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryChip,
                {
                  backgroundColor: selectedCategory?.id === category.id
                    ? category.color
                    : isDark ? '#2a2a2a' : '#f0f0f0',
                }
              ]}
              onPress={() => setSelectedCategory(
                selectedCategory?.id === category.id ? null : category
              )}
              accessibilityLabel={`Select ${category.name} category`}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  {
                    color: selectedCategory?.id === category.id
                      ? '#fff'
                      : isDark ? '#ddd' : '#333'
                  }
                ]}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {selectedCategory && (
          <View style={styles.locationInputContainer}>
            <IconSymbol size={20} name="location.fill" color={Colors[colorScheme].tint} />
            <TextInput
              style={[styles.locationInput, { color: isDark ? '#fff' : '#333' }]}
              placeholder="Add location"
              placeholderTextColor={isDark ? '#aaa' : '#999'}
              value={location}
              onChangeText={setLocation}
              accessibilityLabel="Location input field"
            />
          </View>
        )}

        {photoAttached && photoUri && (
          <View style={styles.photoPreviewContainer}>
            <Image
              source={{ uri: photoUri }}
              style={styles.photoPreview}
              resizeMode="cover"
              accessibilityLabel="Attached photo preview"
            />
            <TouchableOpacity
              style={styles.removePhotoButton}
              onPress={togglePhoto}
              accessibilityLabel="Remove photo"
            >
              <IconSymbol size={20} name="xmark.circle.fill" color="#fff" />
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.postActionsContainer}>
          <View style={styles.postAttachmentOptions}>
            <TouchableOpacity
              style={[styles.attachmentButton, photoAttached && { opacity: 0.5 }]}
              onPress={togglePhoto}
              accessibilityLabel={photoAttached ? 'Photo added' : 'Add photo'}
            >
              <IconSymbol
                size={20}
                name="camera.fill"
                color={photoAttached ? '#999' : Colors[colorScheme].tint}
              />
              <Text style={styles.attachmentText}>
                {photoAttached ? 'Photo Added' : 'Add Photo'}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[
              styles.postButton,
              { 
                opacity: postText.trim().length > 0 && !isSubmitting ? 1 : 0.5,
                backgroundColor: Colors[colorScheme].tint,
              }
            ]}
            disabled={postText.trim().length === 0 || isSubmitting}
            onPress={handlePost}
            accessibilityLabel="Post button"
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.postButtonText}>Post</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

// Single Post Component
const PostItem = React.memo(({ post, onLike, onComment, onDelete }: PostItemProps) => {
  const colorScheme = useColorScheme() || 'light';
  const isDark = colorScheme === 'dark';
  const [showOptions, setShowOptions] = useState(false);

  const formattedDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });
  };

  const handleDeletePost = () => {
    Alert.alert(
      'Delete Post',
      'Are you sure you want to delete this post? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => setShowOptions(false),
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            onDelete(post.id);
            setShowOptions(false);
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.postItem, { backgroundColor: isDark ? '#1e1e1e' : '#fff' }]}>
      <View style={styles.postContent}>
        <Text style={[styles.postText, { color: isDark ? '#fff' : '#333' }]}>
          {post.text}
        </Text>

        <View style={styles.postMetadata}>
          {post.location && (
            <View style={styles.postMetaItem}>
              <IconSymbol size={16} name="location.fill" color="#888" />
              <Text style={styles.postMetaText}>{post.location}</Text>
            </View>
          )}

          {post.category && (
            <View style={[
              styles.categoryBadge,
              {
                backgroundColor: `${post.category_color}20`,
                borderColor: post.category_color,
                borderWidth: 1,
                borderRadius: 4,
                paddingHorizontal: 8,
                paddingVertical: 2,
                marginLeft: post.location ? 8 : 0,
              }
            ]}>
              <Text style={[styles.categoryBadgeText, { color: post.category_color }]}>
                {post.category}
              </Text>
            </View>
          )}
        </View>
      </View>

      {post.has_photo && post.photo_url && (
        <Image
          source={{ uri: post.photo_url }}
          style={styles.postImage}
          resizeMode="cover"
          accessibilityLabel="Post image"
        />
      )}

      <View style={styles.postActions}>
        <TouchableOpacity
          style={styles.postAction}
          onPress={() => onLike(post.id)}
          accessibilityLabel="Like post"
        >
          <IconSymbol 
            size={20} 
            name={post.liked_by_current_user ? "heart.fill" : "heart"} 
            color={post.liked_by_current_user ? "#ff3b30" : (isDark ? '#aaa' : '#666')} 
          />
          <Text style={[
            styles.postActionText,
            post.liked_by_current_user && { color: "#ff3b30" }
          ]}>
            {post.likes_count} Likes
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.postAction}
          onPress={() => onComment(post.id)}
          accessibilityLabel="Comment on post"
        >
          <IconSymbol size={20} name="bubble.left" color={isDark ? '#aaa' : '#666'} />
          <Text style={styles.postActionText}>{post.comments_count} Comments</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.postAction} accessibilityLabel="Share post">
          <IconSymbol size={20} name="arrowshape.turn.up.right" color={isDark ? '#aaa' : '#666'} />
          <Text style={styles.postActionText}>Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});

const FilterTabs = ({ activeTab, onTabChange }: FilterTabsProps) => {
  const colorScheme = useColorScheme() || 'light';
  const isDark = colorScheme === 'dark';
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([
    { id: 'all', name: 'All Posts' },
  ]);

  // Fetch categories for filters
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('name')
          .order('id');

        if (error) throw error;

        if (data) {
          const formattedCategories = [
            { id: 'all', name: 'All Posts' },
            ...data.map((cat) => ({
              id: cat.name.toLowerCase(),
              name: cat.name,
            })),
          ];
          setCategories(formattedCategories);
        }
      } catch (error) {
        console.error('Error fetching categories for tabs:', error);
        // Fall back to hardcoded tabs
        setCategories([
          { id: 'all', name: 'All Posts' },
          { id: 'flooding', name: 'Flooding' },
          { id: 'fire', name: 'Fire' },
          { id: 'power', name: 'Power Outage' },
          { id: 'infrastructure', name: 'Infrastructure' },
        ]);
      }
    };

    fetchCategories();
  }, []);

  return (
    <View style={styles.tabsContainer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabsContent}
      >
        {categories.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tab,
              activeTab === tab.id && styles.activeTab,
              { backgroundColor: isDark ? '#1e1e1e' : '#fff' },
            ]}
            onPress={() => onTabChange(tab.id)}
            accessibilityLabel={`Filter by ${tab.name}`}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab.id && styles.activeTabText,
              ]}
              numberOfLines={1}
            >
              {tab.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

// Main PostsScreen Component
export default function PostsScreen() {
  const colorScheme = useColorScheme() || 'light';
  const isDark = colorScheme === 'dark';
  const [activeTab, setActiveTab] = useState<string>('all');
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const fetchPosts = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Base query using the posts_with_comment_counts view
      let query = supabase
        .from('posts_with_comment_counts')
        .select('*')
        .order('created_at', { ascending: false });

      // Apply category filter if not on "all" tab
      if (activeTab !== 'all') {
        query = query.ilike('category', activeTab);
      }

      const { data, error } = await query;

      if (error) throw error;

      if (!data) {
        setPosts([]);
        return;
      }

      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
      Alert.alert('Error', 'Failed to load posts. Pull down to refresh.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleAddNewPost = async (newPost: Post) => {
    try {
      setIsSubmitting(true);
      await fetchPosts();
    } catch (error) {
      console.error('Error refreshing posts after adding new post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLikePost = async (postId: number) => {
    try {
      const post = posts.find(p => p.id === postId);
      if (!post) return;

      if (post.liked_by_current_user) {
        // Remove like
        await supabase
          .from('post_likes')
          .delete()
          .eq('post_id', postId);

        setPosts(posts.map(p => 
          p.id === postId 
            ? { ...p, likes_count: p.likes_count - 1, liked_by_current_user: false } 
            : p
        ));
      } else {
        // Add like
        await supabase
          .from('post_likes')
          .insert({ post_id: postId });

        setPosts(posts.map(p => 
          p.id === postId 
            ? { ...p, likes_count: p.likes_count + 1, liked_by_current_user: true } 
            : p
        ));
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      Alert.alert('Error', 'Failed to like/unlike post. Please try again.');
    }
  };

  const handleCommentPost = (postId: number) => {
    // In a real app, this would navigate to a comments screen
    Alert.alert('Comments', 'This feature will be implemented soon.');
  };

  const handleDeletePost = async (postId: number) => {
    try {
      const post = posts.find(p => p.id === postId);
      if (!post) return;

      // Check if post has a photo and delete it from storage if it does
      if (post.has_photo && post.photo_url) {
        const photoFileName = post.photo_url.split('/').pop();
        if (photoFileName) {
          const { error: storageError } = await supabase.storage
            .from('post_images')
            .remove([photoFileName]);
            
          if (storageError) {
            console.error('Error removing photo from storage:', storageError);
          }
        }
      }

      // Delete the post (cascade will handle likes and comments)
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;

      // Update state to remove the deleted post
      setPosts(posts.filter(p => p.id !== postId));
      Alert.alert('Success', 'Post deleted successfully.');
    } catch (error) {
      console.error('Error deleting post:', error);
      Alert.alert('Error', 'Failed to delete post. Please try again.');
    }
  };

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchPosts();
  };

  const tabBarHeight = useBottomTabBarHeight();
  const renderListEmptyComponent = () => {
    if (isLoading) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={Colors[colorScheme].tint} />
          <Text style={styles.emptyText}>Loading posts...</Text>
        </View>
      );
    }

    return (
      <View style={[styles.container, { paddingBottom: tabBarHeight }]}>
        <View style={styles.emptyContainer}>
          <IconSymbol size={50} name="text.bubble" color={isDark ? '#3a3a3a' : '#ddd'} />
          <Text style={styles.emptyText}>No posts found</Text>
          <Text style={styles.emptyText}>
            {activeTab === 'all'
              ? 'Be the first to post in this community!'
              : `No posts found in the "${activeTab}" category. Try a different filter.`}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#121212' : '#f8f9fa' }]}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Community Posts</Text>
          <View style={styles.headerRightContainer}>
            <TouchableOpacity style={styles.refreshButton} onPress={onRefresh} accessibilityLabel="Refresh posts">
              <IconSymbol size={22} name="arrow.clockwise" color={Colors[colorScheme].text} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.notificationButton} accessibilityLabel="Notifications">
              <IconSymbol size={24} name="bell.fill" color={Colors[colorScheme].text} />
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationCount}>3</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <FilterTabs activeTab={activeTab} onTabChange={setActiveTab} />

        <FlatList
          data={posts}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <PostItem
              post={item}
              onLike={handleLikePost}
              onComment={handleCommentPost}
              onDelete={handleDeletePost}
            />
          )}
          ListHeaderComponent={
            <CreatePostCard onPostCreated={handleAddNewPost} isSubmitting={isSubmitting} />
          }
          ListEmptyComponent={renderListEmptyComponent}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              colors={[Colors[colorScheme].tint]}
              tintColor={Colors[colorScheme].tint}
            />
          }
          contentContainerStyle={posts.length === 0 ? { flex: 1 } : {}}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          ListFooterComponent={() => <View style={{ height: 20 }} />}
        />
      </SafeAreaView>
    </KeyboardAvoidingView>
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
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8, 
  },
  notificationButton: {
    position: 'relative',
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#ff5252',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationCount: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  tabsContainer: {
    height: 50,
    backgroundColor: 'transparent',
  },
  tabsContent: {
    paddingHorizontal: 12,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginHorizontal: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  activeTab: {
    backgroundColor: '#4a6ed0',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
  },
  activeTabText: {
    color: 'white',
    fontWeight: 'bold',
  },
  postsListContent: {
    paddingBottom: 20,
  },
  card: {
    margin: 16,
    marginTop: 8,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  postInputContainer: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
    alignItems: 'flex-start',
  },
  userAvatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  postInput: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    padding: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    borderRadius: 8,
  },
  categoriesContainer: {
    padding: 16,
    flexDirection: 'row',
  },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  locationInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  locationInput: {
    flex: 1,
    marginLeft: 8,
    paddingVertical: 8,
    fontSize: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  photoPreviewContainer: {
    position: 'relative',
    marginHorizontal: 16,
    marginBottom: 16,
    height: 200,
    borderRadius: 8,
    overflow: 'hidden',
  },
  photoPreview: {
    width: '100%',
    height: '100%',
  },
  removePhotoButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  postActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  postAttachmentOptions: {
    flexDirection: 'row',
  },
  attachmentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  attachmentText: {
    fontSize: 14,
    marginLeft: 4,
  },
  postButton: {
    backgroundColor: '#4a6ed0',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  postButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  postItem: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    overflow: 'hidden',
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  postHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  postTime: {
    fontSize: 12,
    color: '#999',
  },
  moreButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionsMenu: {
    position: 'absolute',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  optionText: {
    marginLeft: 8,
    fontSize: 14,
  },
  postContent: {
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  postText: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 8,
  },
  postMetadata: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  postMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postMetaText: {
    fontSize: 12,
    color: '#888',
    marginLeft: 4,
  },
  categoryBadge: {
    marginTop: 4,
  },
  categoryBadgeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  postImage: {
    width: '100%',
    height: 240,
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  postAction: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  postActionText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#888',
  },
  separator: {
    height: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    marginTop: 10,
  },
  refreshButton: {
    padding: 8,
  },
});